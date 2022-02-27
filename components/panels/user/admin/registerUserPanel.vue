<template>
  <div class="panel">
    <h2 class="font-bold">Новый пользователь</h2>
    <hr class="mb-2 mt-1">

    <div class="form-control">
      <label class="label">
        <span class="label-text">Почта</span>
      </label>
      <input type="email" v-model="email" placeholder="" class="input input-bordered">

      <label class="label">
        <span class="label-text">Пароль</span>
      </label>
      <input type="password" v-model="password" placeholder="" class="input input-bordered">
    </div>

    <error class="mt-2" :text="error"></error>

    <label @click="apply()" :disabled="inProgress" class="btn btn-warning w-full mt-4">
      Добавить
    </label>
  </div>
</template>

<script>
import {actions} from "../../../../store";
import Error from "../../../objects/error";

export default {
  name: "registerUserPanel",
  components: {Error},

  data() {
    return {
      email: "",
      password: "",
      inProgress: false,
      error: ""
    }
  },

  props: {
    userList: Function,
  },

  methods: {
    apply(){
      if (this.email === ""){
        this.error = "Введите почту!"
        return
      }else if (this.password === ""){
        this.error = "Введите пароль!"
        return
      }

      const session = this.$cookies.get("auth_session");

      this.inProgress = true
      actions.apiPostRequest("admin/registerUser?token=" + session, {email: this.email, password: this.password}, this)
        .then(() => {
          this.email = ""
          this.password = ""
          this.error = ""

          this.userList(1)
        })
        .catch((e) => {
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
