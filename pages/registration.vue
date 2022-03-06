<template>
  <div>
    <div class="hero min-h-screen">
      <div class="hero-content">
        <div class="max-w-md">
          <div class="card shadow">
            <div class="panel">
              <h2 class="font-bold">Регистрация</h2>
              <hr class="my-2">

              <div>
                <label class="input-group">
                  <span class="w-48">Почта</span>
                  <input type="email" placeholder="hello@example.com" v-model="email" class="input input-bordered w-full">
                </label>

                <label class="input-group mt-1">
                  <span class="w-48">Пароль</span>
                  <input type="password" v-model="password" class="input input-bordered w-full">
                </label>

                <label class="input-group mt-1">
                  <span class="w-48">Повторите пароль</span>
                  <input type="password" v-model="repeatPassword" class="input input-bordered w-full">
                </label>

                <label class="label text-2xs" v-if="!error">
                  В случае проблем с регистрацией, обратитесь к администратору
                </label>
                <label class="label text-2xs text-error" v-else>
                  {{error}}
                </label>
              </div>

              <div class="modal-action mt-2">

              </div>

              <div class="modal-action mt-2 justify-between">
                <NuxtLink v-if="registration" to="/auth" class="btn btn-primary">Назад</NuxtLink>
                <label @click="apply()" class="btn btn-success">
                  Зарегистрироваться
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
  name: "registration",
  middleware: ['serverRequired', 'nonauthed'],
  components: {FooterPanel},

  data() {
    return {
      email: "",
      password: "",
      repeatPassword: "",
      error: ""
    }
  },

  computed: {
    registration: function (){
      return this.$store.state.server.registration;
    },
  },

  methods: {
    apply(){
      this.error = "";

      if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email))) {
        this.error = "Введите корректную почту"
        return;
      }

      if (this.password !== this.repeatPassword){
        this.error = "Пароли не совпадают"
        return
      }

      if (this.password.includes(" ")){
        this.error = "Пароль не должен содержать пробелы"
        return;
      }

      if (this.password.length < 6){
        this.error = "Пароль слишком короткий! Минимум 6 символов"
        return
      }

      actions.apiPostRequest("user/registration", {email: this.email, password: this.password}, this)
        .catch(r => {
          this.error = "Ошибка регистрации. Возможно, почта уже занята"
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
