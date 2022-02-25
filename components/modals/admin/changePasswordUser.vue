<template>
  <div class="modal">
    <div class="modal-box">
      <h2 class="font-bold">Смена пароля для {{user.email}}</h2>
      <hr class="mb-2 mt-1">

      <div class="form-control">
        <label class="label">
          <span class="label-text">Новый пароль</span>
        </label>
        <input type="password" v-model="newPassword" placeholder="" class="input input-bordered">
      </div>

      <error class="mt-2" :text="error"></error>

      <div class="modal-action">
        <label @click="$store.commit('hideModal', 'admin-password-changer')" class="btn btn-ghost">
          Отменить
        </label>
        <label @click="apply()" :disabled="inProgress" class="btn btn-warning">
          Обновить
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import {actions} from "../../../store";
import Error from "../../objects/error";

export default {
  name: "changePasswordUser",
  components: {Error},

  data() {
    return {
      user: {},
      newPassword: "",
      inProgress: false,

      error: ""
    }
  },

  methods: {
    apply(){
      if (this.newPassword === ""){
        this.error = "Введите новый пароль!"
        return
      }

      const session = this.$cookies.get("auth_session");

      this.inProgress = true
      actions.apiPostRequest("admin/changeUserPassword?token=" + session, {email: this.user.email, password: this.newPassword}, this.$axios.defaults.baseURL)
        .then(() => {
          this.$cookies.remove("auth_session");
          this.$router.push("/auth")
        })
        .catch((e) => {
          if (e.toString().includes("Wrong password"))
            this.error = "Неправильный пароль!"
          else
            this.error = "Неизвестная ошибка!"
          console.log(e)
        })
        .finally(() => {
          this.inProgress = false
        })
    }
  },

  created() {
    this.$store.commit("setModalShowEvent", {name: 'admin-password-changer', func: (data) => {
        this.user = data;
      }
    })
  },
}
</script>

<style scoped>

</style>
