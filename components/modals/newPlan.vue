<template>
  <div class="modal">
    <div class="modal-box">
      <h2 class="font-bold mb-1">Добавить план</h2>
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
      </div>

      <error class="mt-2" :text="error"></error>

      <div class="modal-action">
        <label @click="$store.commit('hideModal', 'new-plan')" class="btn btn-ghost">
          Отменить
        </label>
        <label @click="apply()" :disabled="inProgress" class="btn btn-success">
          Создать
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import {actions} from "~/store";
import Error from "../objects/error";

export default {
  name: "newPlan",
  components: {Error},
  computed: {
    accounts: function (){
      return this.$store.state.accounts;
    },

    tags: function (){
      return this.$store.state.tags;
    },
  },

  data() {
    return {
      delta: 0,
      tag: "",
      date: new Date().toISOString().substr(0, 10),
      account: "",
      description: "",
      inProgress: false,
      error: ""
    }
  },

  methods: {
    apply(){
      var delta = this.delta;

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

      if (delta === 0){
        this.error = "Сумма не должна быть нулевая!"
        return;
      }

      if (tag.kind !== 0)
        delta *= tag.kind;

      var time = new Date(this.date).getTime() / 1000 + 60 * 60 * 9;

      if (isNaN(time))
        time = new Date().getTime() / 1000;

      const session = this.$cookies.get("auth_session");

      this.inProgress = true
      actions.apiPostRequest("plans/add?token=" + session, {delta: delta, tag: tag.id, date: parseInt(time), account: account.id, description: this.description}, this)
        .then(() => {
          actions.preloadData(this, session, true)
          this.$store.commit('hideModal', 'new-plan')
        })
        .catch(e => {
          this.error = "Неизвестная ошибка!"
          console.log(e)
        }).finally(() => {
          this.inProgress = false
      })
    }
  }
}
</script>

<style scoped>

</style>
