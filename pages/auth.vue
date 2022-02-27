<template>
<div>
  <div class="hero min-h-screen">
    <div class="hero-content">
      <div class="max-w-md">
        <div class="card shadow">
          <div class="panel">
            <h2 class="font-bold">Аутентификация</h2>
            <hr class="my-2">

            <div>
              <label class="input-group">
                <span class="w-28">Почта</span>
                <input type="email" placeholder="hello@example.com" v-model="email" class="input input-bordered w-full">
              </label>

              <label class="input-group mt-1">
                <span class="w-28">Пароль</span>
                <input type="password" v-model="password" class="input input-bordered w-full">
              </label>
              <label class="label text-2xs" v-if="!error">
                В случае проблем со входом, обратитесь к администратору
              </label>
              <label class="label text-2xs text-error" v-else>
                Неправильный логин или пароль. Попробуйте еще раз
              </label>
            </div>

            <div class="modal-action mt-2">
              <label @click="apply()" class="btn btn-success">
                Войти
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <footer-panel></footer-panel>
</div>
</template>

<script>
import FooterPanel from "../components/panels/footerPanel";
import {actions} from "../store";
export default {
  name: "auth",
  middleware: 'nonauthed',
  components: {FooterPanel},

  data() {
    return {
      email: "",
      password: "",
      error: false
    }
  },

  methods: {
    apply(){
      this.error = false;
      actions.apiPostRequest("user/auth", {email: this.email, password: this.password}, this)
        .catch(r => {
          this.error = true
        })
        .then(response => response.data)
        .then((r) => {
          this.$cookies.set("auth_session", r.token,{maxAge: 60 * 60 * 24 * 7});
          this.$router.push('/');
        })
    }
  }
}
</script>

<style scoped>
.min-h-screen {
  min-height: 90vh;
}
</style>
