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

      <error class="mt-2" :text="error"></error>

      <div class="modal-action">
        <label @click="$store.commit('hideModal', 'new-account')" class="btn btn-ghost">
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
import {actions} from "../../store";
import Error from "../objects/error";

export default {
  name: "newAccount",
  components: {Error},
  data() {
    return {
      name: "",
      inProgress: false,
      error: ""
    }
  },

  methods: {
    apply(){
      const session = this.$cookies.get("auth_session");

      this.inProgress = true;
      actions.apiPostRequest("accounts/add?token=" + session, {name: this.name}, this)
        .then(() => {
          actions.reloadAccounts(this, session, true)
          this.$store.commit('hideModal', 'new-account')
        })
        .catch(e => {
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
