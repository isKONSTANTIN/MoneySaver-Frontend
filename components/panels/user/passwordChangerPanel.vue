<template>
  <div class="panel">
    <h2 class="font-bold">Смена пароля:</h2>
    <hr class="mb-2 mt-1">

    <div class="form-control">
      <label class="label">
        <span class="label-text">Текущий пароль</span>
      </label>
      <input type="password" v-model="oldPassword" placeholder="" class="input input-bordered">

      <label class="label">
        <span class="label-text">Новый пароль</span>
      </label>
      <input type="password" v-model="newPassword" placeholder="" class="input input-bordered">
    </div>

    <error class="mt-2" :text="error"></error>

    <label @click="apply()" :disabled="inProgress" class="btn btn-warning w-full mt-4">
      Обновить
    </label>
  </div>
</template>

<script>
import Error from "../../objects/error";
import {actions} from "../../../store";

export default {
  name: "passwordChangerPanel",
  components: {Error},

  data() {
    return {
      oldPassword: "",
      newPassword: "",
      inProgress: false,

      error: ""
    }
  },

  methods: {
    apply(){
      if (this.oldPassword === ""){
        this.error = "Введите текущий пароль!"
        return
      }else if (this.newPassword === ""){
        this.error = "Введите новый пароль!"
        return
      }

      const session = this.$cookies.get("auth_session");

      this.inProgress = true
      actions.apiPostRequest("user/changePassword?token=" + session, {oldPassword: this.oldPassword, newPassword: this.newPassword}, this)
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
  }
}
</script>

<style scoped>

</style>
