<template>
  <div class="modal">
    <div class="modal-box">
      <h2 class="font-bold mb-1">Изменить план</h2>
      <hr class="mb-4">

      <div class="form-control">
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="label">
              <span class="label-text">Сумма</span>
            </label>
            <input type="number" v-model="delta" class="input input-bordered w-full">

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

        <label class="label">
          <span class="label-text">Состояние</span>
        </label>
        <select v-model="state" class="select select-bordered w-full">
          <option>Ожидает</option>
          <option>Выполнен</option>
          <option>Не выполнен</option>
        </select>
      </div>

      <div class="modal-action">
        <label @click="$store.commit('hideModal', 'plan-editor')" class="btn btn-ghost">
          Отменить
        </label>
        <label @click="apply()" class="btn btn-success">
          Сохранить
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import {actions} from "~/store";

export default {
  name: "planEditor",

  data() {
    return {
      id: 0,
      delta: 0,
      tag: "",
      date: "",
      account: "",
      description: "",
      state: "",
    }
  },

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

  created() {
    this.$store.commit("setModalShowEvent", {name: 'plan-editor', func: (data) => {
        this.id = data.id;
        this.delta = data.delta;
        this.tag = this.tagsMap[data.tag].name;
        this.date = new Date(data.date.seconds * 1000).toISOString().substr(0, 10);
        this.account = this.accountsMap[data.account].name;
        this.description = data.description;
        this.state = data.state === -1 ? "Не выполнен" : (data.state === 1 ? "Выполнен" : "Ожидает");
      }
    })
  },

  methods: {
    apply(){
      const session = this.$cookies.get("auth_session");

      if (this.delta === 0 || this.tag === "" || this.account === "" || this.state === "")
        return

      var tag = this.tags.find(t => t.name === this.tag)
      var account = this.accounts.find(a => a.name === this.account)

      var time = new Date(this.date).getTime() / 1000 + 60 * 60 * 9
      if (isNaN(time))
        time = new Date().getTime() / 1000;

      actions.apiPostRequest("plans/edit?token=" + session, {
        id: this.id,
        delta: parseFloat(this.delta),
        tag: tag.id,
        date: parseInt(time),
        account: account.id,
        description: this.description,
        state: this.state === "Не выполнен" ? -1 : (this.state === "Выполнен" ? 1 : 0)
      }, this.$axios.defaults.baseURL)
        .then(() => {
          actions.reloadPlans(this, session)
          this.$store.commit('hideModal', 'plan-editor')
        })
    }
  }
}
</script>

<style scoped>

</style>
