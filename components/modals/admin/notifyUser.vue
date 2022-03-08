<template>
  <div class="modal">
    <div class="modal-box">
      <h2 class="font-bold">Уведомление для {{user.email}}</h2>
      <hr class="mb-2 mt-1">

      <div class="form-control">
        <label class="label">
          <span class="label-text">Заголовок</span>
        </label>
        <input type="text" v-model="title" placeholder="" class="input input-bordered">

        <label class="label">
          <span class="label-text">Сообщение</span>
        </label>
        <input type="text" v-model="text" placeholder="" class="input input-bordered">
      </div>

      <error class="mt-2" :text="error"></error>

      <div class="modal-action">
        <label @click="$store.commit('hideModal', 'admin-notify-user')" class="btn btn-ghost">
          Отменить
        </label>
        <label @click="apply()" :disabled="inProgress" class="btn btn-warning">
          Отправить
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import {actions} from "../../../store";
import Error from "../../objects/error";

export default {
  name: "notifyUser",
  components: {Error},

  data() {
    return {
      user: {},
      title: "",
      text: "",
      inProgress: false,

      error: ""
    }
  },

  methods: {
    apply(){
      if (this.title === ""){
        this.error = "Введите заголовок!"
        return
      }else if (this.text === ""){
        this.error = "Введите сообщение!"
        return
      }

      const session = this.$cookies.get("auth_session");

      this.inProgress = true
      actions.apiPostRequest("admin/sendNotificationToUser?token=" + session, {email: this.user.email, title: this.title, text: this.text}, this)
        .then(response => response.data)
        .then((response) => {
          this.$store.commit('hideModal', 'admin-notify-user');
          console.log("sended to " + response.devices + " devices")
        })
        .catch((e) => {
          this.error = "Неизвестная ошибка!"
          console.log(e)
        })
        .finally(() => {
          this.inProgress = false
        })
    }
  },

  created() {
    this.$store.commit("setModalShowEvent", {name: 'admin-notify-user', func: (data) => {
        this.user = data;
      }
    })
  },
}
</script>

<style scoped>

</style>
