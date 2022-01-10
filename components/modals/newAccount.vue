<template>
  <div class="modal">
    <div class="modal-box">
      <h2 class="font-bold mb-1">Создать счет</h2>
      <hr class="mb-4">

      <div class="form-control">
        <label class="label">
          <span class="label-text">Название</span>
        </label>
        <input type="text" v-model="name" placeholder="" class="input input-bordered">
      </div>

      <div class="modal-action">
        <label @click="$store.commit('hideModal', 'new-account')" class="btn btn-ghost">
          Отменить
        </label>
        <label @click="apply()" class="btn btn-success">
          Создать
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import {actions} from "../../store";

export default {
  name: "newAccount",

  data() {
    return {
      name: ""
    }
  },

  methods: {
    apply(){
      const session = this.$cookies.get("auth_session");

      actions.apiPostRequest("accounts/add?token=" + session, {name: this.name}, this.$axios.defaults.baseURL)
        .then(() => {
          actions.reloadAccounts(this, session)
          this.$store.commit('hideModal', 'new-account')
        })
    }
  }
}
</script>

<style scoped>

</style>
