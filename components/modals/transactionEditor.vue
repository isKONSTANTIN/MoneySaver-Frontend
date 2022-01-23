<template>
  <div class="modal">
    <div class="modal-box">
      <h2 class="font-bold mb-1">Изменить транзакцию</h2>
      <hr class="mb-4">

      <div class="form-control">
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="label">
              <span class="label-text">Сумма</span>
            </label>
            <input v-model="delta" @change="calculateDelta" class="input input-bordered w-full">

            <label class="label">
              <span class="label-text">Тег</span>
            </label>
            <select v-model="tag" class="select select-bordered w-full">
              <option v-for="tag in tags">{{tag.name}}</option>
            </select>
          </div>

          <div>
            <label class="label">
              <span class="label-text">Дата</span>
            </label>
            <input type="date" class="input input-bordered w-full" v-model="date">

            <label class="label">
              <span class="label-text">Счет</span>
            </label>
            <select v-model="account" class="select select-bordered w-full">
              <option v-for="account in accounts">{{account.name}}</option>
            </select>
          </div>
        </div>

        <label class="label">
          <span class="label-text">Описание</span>
        </label>
        <input type="text" v-model="description" class="input input-bordered w-full">
      </div>

      <error class="mt-2" :text="error"></error>

      <div class="mt-6 flex justify-between w-full">
        <button :disabled="inProgress" @click="deleteTransaction()" class="btn btn-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
        <div>
          <label @click="$store.commit('hideModal', 'transaction-editor')" class="btn btn-ghost">
            Отменить
          </label>
          <label @click="apply()" :disabled="inProgress" class="btn btn-success">
            Сохранить
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {actions} from "../../store";
import Error from "../objects/error";

export default {
  name: "transactionEditor",
  components: {Error},

  computed: {
    accounts: function (){
      return this.$store.state.accounts;
    },

    tags: function (){
      return this.$store.state.tags;
    },

    accountsMap: function (){
      return this.$store.state.accountsMap;
    },

    tagsMap: function (){
      return this.$store.state.tagsMap;
    },
  },

  data() {
    return {
      id: 0,
      delta: 0,
      tag: "",
      date: new Date().toISOString().substr(0, 10),
      account: "",
      description: "",

      inProgress: false,
      error: ""
    }
  },

  created() {
    this.$store.commit("setModalShowEvent", {name: 'transaction-editor', func: (data) => {
        this.id = data.id;
        this.delta = this.tagsMap[data.tag].kind !== 0 ? Math.abs(data.delta) : data.delta;
        this.tag = this.tagsMap[data.tag].name;
        this.date = new Date(data.date.seconds * 1000).toISOString().substr(0, 10);
        this.account = this.accountsMap[data.account].name;
        this.description = data.description
      }
    })
  },

  methods: {
    deleteTransaction() {
      const session = this.$cookies.get("auth_session");
      this.inProgress = true;

      actions.apiPostRequest("transactions/cancel?token=" + session, {id: this.id}, this.$axios.defaults.baseURL)
        .then(() => {
          this.$store.commit('hideModal', 'transaction-editor')
        })
        .catch((e) => {
          this.error = "Неизвестная ошибка!"
          console.log(e)
        })
        .finally(() => {
          this.inProgress = false
        })
    },

    calculateDelta(){
      var newDelta = NaN

      try{
        newDelta = parseFloat(eval(this.delta.replace(/[^-()\d/*+.]/g, '')));
      }catch {

      }

      if (!isNaN(newDelta))
        this.delta = newDelta
    },

    apply(){
      var delta = this.delta

      var tag = this.tags.find(t => t.name === this.tag)
      var account = this.accounts.find(a => a.name === this.account)

      if (tag === undefined){
        this.error = "Тег не найден!"
        return;
      }

      if (account === undefined){
        this.error = "Счет не найден!"
        return;
      }

      if (delta === 0 || isNaN(delta) || !isFinite(delta) || Math.abs(delta) > 2147483647){
        this.error = "Сумма должна быть корректной!"
        return;
      }

      if (tag.kind !== 0)
        delta *= tag.kind;

      var time = new Date(this.date).getTime() / 1000 + 60 * 60 * 9;

      if (isNaN(time))
        time = new Date().getTime() / 1000;

      const session = this.$cookies.get("auth_session");
      this.inProgress = true;

      actions.apiPostRequest("transactions/edit?token=" + session, {id: this.id, delta: delta, tag: tag.id, date: parseInt(time), account: account.id, description: this.description}, this.$axios.defaults.baseURL)
        .then(() => {
          actions.preloadData(this, session)
          this.$store.commit('hideModal', 'transaction-editor')
        })
        .catch((e) => {
          this.error = "Неизвестная ошибка!"
          console.log(e)
        })
        .finally(() => {
          this.inProgress = false
        })
    },
  }

}
</script>

<style scoped>

</style>
