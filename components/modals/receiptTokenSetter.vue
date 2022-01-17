<template>
  <div class="modal">
    <div class="modal-box">
      <h2 class="font-bold mb-1">Токен доступа</h2>
      <hr class="mb-4">

      <div class="form-control">

        <div class="alert alert-warning">
          <div class="flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mx-2 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <label>
              Для получения данных от ФНС используется сторонний серсис.
            </label>
          </div>
        </div>
        <br>
        <div class="card shadow-2xl lg:card-side bg-primary text-primary-content">
          <div class="card-body">
            <p>
              Пожалуйста, зарегистрируйтесь на <a class="link" href="https://proverkacheka.com/">proverkacheka.com</a>,
              зайдите в личный кабинет, откройте вкладку "Мой профиль" и получите "Токен доступа к API".
            </p>
            <div class="justify-end card-actions">
              <a href="https://proverkacheka.com/" target="_blank" class="btn btn-primary">
                Перейти на сайт

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 ml-2 stroke-current">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div class="alert">
          <div class="flex-1">
            <label>

            </label>
          </div>
        </div>

        <label class="label">
          <span class="label-text">Токен</span>
        </label>
        <input type="text" v-model="token" placeholder="" class="input input-bordered">
      </div>

      <error class="mt-2" :text="error"></error>

      <div class="modal-action">
        <label @click="$store.commit('hideModal', 'receipt-token-setter')" class="btn btn-ghost">
          Отменить
        </label>
        <label @click="apply()" :disabled="inProgress" class="btn btn-success">
          Установить
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import {actions} from "../../store";
import Error from "../objects/error";

export default {
  name: "receiptTokenSetter",
  components: {Error},
  data() {
    return {
      token: "",
      inProgress: false,

      error: ""
    }
  },

  methods: {
    apply(){
      const session = this.$cookies.get("auth_session");

      if (this.token === ""){
        this.error = "Токен не должен быть пустым!"
        return
      }

      this.inProgress = true;
      actions.apiPostRequest("user/updateReceiptToken?token=" + session, {receipt: this.token}, this.$axios.defaults.baseURL)
        .then(() => {
          actions.reloadUser(this, session)
          this.$store.commit('hideModal', 'receipt-token-setter')
          this.token = ""
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
