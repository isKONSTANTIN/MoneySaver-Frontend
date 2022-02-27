<template>
  <div class="modal">
    <div class="modal-box">
      <h2 class="font-bold mb-1">Сохранить повтор. транзакцию</h2>
      <hr class="mb-4">

      <div class="form-control">
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="label">
              <span class="label-text">Сумма</span>
            </label>
            <input type="number" v-model="delta" class="input input-bordered w-full">
          </div>

          <div>
            <label class="label">
              <span class="label-text">Счет</span>
            </label>
            <select v-model="account" class="select select-bordered w-full">
              <option v-for="account in accounts">{{account.name}}</option>
            </select>
          </div>
        </div>

        <label class="label">
          <span class="label-text">Тег</span>
        </label>
        <select v-model="tag" class="select select-bordered w-full">
          <option v-for="tag in tags">{{tag.name}}</option>
        </select>

        <div class="grid grid-cols-4 gap-2">
          <div class="col-span-4">
            <label class="label">
              <span class="label-text">Дата начала/прошлого повтора</span>
            </label>
            <input type="date" class="input input-bordered w-full" v-model="lastRepeat">
          </div>
          <div class="col-span-2">
            <label class="label">
              <span class="label-text">Тип повтора</span>
            </label>
            <select v-model="repeatFunc" class="select select-bordered w-full">
              <option>Еженедельно</option>
              <option>Ежемесячно</option>
              <option>Каждые N дней</option>
            </select>
          </div>

          <div class="col-span-2">
            <div v-if="repeatFunc === 'Еженедельно'">
              <label class="label">
                <span class="label-text">День</span>
              </label>
              <select v-model="repeatArg" class="select select-bordered w-full">
                <option>ПН</option>
                <option>ВТ</option>
                <option>СР</option>
                <option>ЧТ</option>
                <option>ПТ</option>
                <option>СБ</option>
                <option>ВС</option>
              </select>
            </div>
            <div v-else>
              <label class="label">
                <span class="label-text">{{repeatFunc === 'Ежемесячно' ? 'День' : 'Через'}}</span>
              </label>
              <input type="number" v-model="repeatArg" class="input input-bordered w-full">
            </div>
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
          <label @click="$store.commit('hideModal', 'repeat-transaction-editor')" class="btn btn-ghost">
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
  name: "repeatTransactionEditor",
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
      delta: 0,
      tag: "",
      lastRepeat: "",
      repeatFunc: "",
      repeatArg: "",
      account: "",
      description: "",
      id: 0,

      inProgress: false,
      error: ""
    }
  },

  created() {
    var days = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"]

    this.$store.commit("setModalShowEvent", {name: 'repeat-transaction-editor', func: (data) => {
        this.id = data.id;
        this.delta = data.delta;
        this.tag = this.tagsMap[data.tag].name;
        this.lastRepeat = new Date(data.lastRepeat.seconds * 1000).toISOString().substr(0, 10);
        this.repeatFunc = data.repeatFunc === 0 ? "Еженедельно" : ( data.repeatFunc === 1 ? "Ежемесячно" : "Каждые N дней")
        this.repeatArg = data.repeatFunc === 0 ? days[data.arg - 1] : data.arg
        this.account = this.accountsMap[data.account].name;
        this.description = data.description;
      }
    })
  },

  methods: {
    deleteTransaction() {
      const session = this.$cookies.get("auth_session");
      this.inProgress = true;

      actions.apiPostRequest("transactions/repeat/remove?token=" + session, {id: this.id}, this)
        .then(() => {
          this.$store.commit('hideModal', 'repeat-transaction-editor')
        })
        .catch((e) => {
          this.error = "Неизвестная ошибка!"
          console.log(e)
        })
        .finally(() => {
          this.inProgress = false
        })
    },
    apply(){
      var days = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"]
      var delta = this.delta;

      var tag = this.tags.find(t => t.name === this.tag)
      var account = this.accounts.find(a => a.name === this.account)
      var repeatFunc = this.repeatFunc === "Еженедельно" ? 0 : (this.repeatFunc === "Ежемесячно" ? 1 : 2)
      var repeatArg = repeatFunc === 0 ? days.findIndex(s => s === this.repeatArg) + 1 : parseInt(this.repeatArg)

      if (tag === undefined){
        this.error = "Тег не найден!"
        return;
      }

      if (account === undefined){
        this.error = "Счет не найден!"
        return;
      }

      if (delta === 0){
        this.error = "Сумма не должна быть нулевая!"
        return;
      }

      if (repeatArg < 1 || isNaN(repeatArg)){
        this.error = "Неправильный аргумент типа повтора"
        return;
      }

      var lastRepeat = new Date(this.lastRepeat).getTime() / 1000 + 60 * 60 * 9;

      if (isNaN(lastRepeat))
        lastRepeat = new Date().getTime() / 1000;

      const session = this.$cookies.get("auth_session");
      this.inProgress = true;

      actions.apiPostRequest("transactions/repeat/edit?token=" + session, {id: this.id, delta: delta, tag: tag.id, account: account.id, repeatArg: repeatArg, lastRepeat: parseInt(lastRepeat), repeatFunc: repeatFunc, description: this.description}, this)
        .then(() => {
          actions.preloadData(this, session, true)
          this.$store.commit('hideModal', 'repeat-transaction-editor')
        })
        .catch((e) => {
          this.error = "Неизвестная ошибка!"
          console.log(e)
        })
        .finally(() => {
          this.inProgress = false;
      })
    }
  }
}
</script>

<style scoped>

</style>
