<template>
  <div class="modal">
    <div class="modal-box">
      <h2 class="font-bold mb-1">Изменить имя</h2>
      <hr class="mb-4">

      <div class="form-control">
        <label class="label">
          <span class="label-text">Новое название</span>
        </label>
        <input type="text" v-model="newName" placeholder="" class="input input-bordered">
      </div>

      <div class="modal-action">
        <label @click="$store.commit('hideModal', 'account-name-setter')" class="btn btn-ghost">
          Отменить
        </label>
        <label @click="apply()" class="btn btn-success">
          Переименовать
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import {actions} from "../../store";

export default {
  name: "accountNameSetter",

  data() {
    return {
      newName: ""
    }
  },

  methods: {
    apply(){
      const session = this.$cookies.get("auth_session");
      const account = this.$store.state.modals["account-name-setter"].data;

      actions.apiPostRequest("accounts/setName?token=" + session, {id: account.id, name: this.newName}, this.$axios.defaults.baseURL)
        .then(() => {
          actions.reloadAccounts(this, session)
          this.$store.commit('hideModal', 'account-name-setter')
          this.newName = ""
        })
    }
  }
}
</script>

<style scoped>

</style>
