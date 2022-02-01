<template>
  <div class="panel">
    <h2 class="font-bold">Активные сессии:</h2>
    <hr class="mb-2 mt-1">

    <error class="mb-2" :text="error"></error>

    <div class="flex flex-col gap-2">
      <div v-for="session in sessions" class="rounded-2xl shadow flex gap-2 flex-row justify-between p-2 w-full">
        <div class="badge justify-start badge-sm overflow-hidden font-mono whitespace-nowrap" :class="{'badge-error' : !session.notDeactivatable, 'badge-success' : session.notDeactivatable}">
          {{session.session}}
        </div>

        <div data-tip="Активен до" class="tooltip z-10 badge badge-warning badge-sm font-mono">
          {{getDate(session.expiredAt.seconds)}}
        </div>

        <button v-if="!session.notDeactivatable" data-tip="Деактивировать" class="tooltip z-10 badge badge-warning badge-sm" @click="deactivate(session.session)">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {actions} from "../../../store";
import Error from "../../objects/error";
export default {
  name: "sessionsPanel",
  components: {Error},
  data() {
    return {
      sessions: {},
      inProgress: false,
      error: ""
    }
  },

  mounted() {
    this.loadSessions()
  },

  methods:{
    loadSessions() {
      const session = this.$cookies.get("auth_session");

      fetch(this.$axios.defaults.baseURL + "api/user/getSessions?token=" + session)
        .then(response => response.json())
        .then(result => {
          this.sessions = result

          this.sessions.find(s => s.session === session).notDeactivatable = true
        })
    },

    getDate(unix){
      var date = new Date(unix * 1000);

      return date.getDate().toString().padStart(2, '0') + "." + (date.getMonth() + 1).toString().padStart(2, '0') + "." + date.getFullYear();
    },

    deactivate(old) {
      if (this.inProgress)
        return

      const session = this.$cookies.get("auth_session");

      actions.apiPostRequest("user/deactivateSession?token=" + session, {session: old}, this.$axios.defaults.baseURL)
        .then(() => {
          this.loadSessions()
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
