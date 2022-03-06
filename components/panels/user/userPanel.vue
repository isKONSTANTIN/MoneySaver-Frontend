<template>
  <div class="panel">

    <div class="flex flex-col h-full">
      <div class="flex items-center flex-1">
        <div class="avatar">
          <div class="p-3 mask mask-hexagon bg-neutral-focus text-neutral-content flex justify-center items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 m-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        <div class="flex flex-col">
          <div class="font-extrabold text-lg ml-2">
            {{userMail}}
          </div>
        </div>
      </div>

      <div class="flex items-center">
        <template v-if="registration">
          <div class="badge badge-warning gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Активен до {{expiresIn}}
          </div>

          <div v-if="demoAccount" class="badge badge-warning gap-2">
            Демо-аккаунт
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "userPanel",

  computed: {
    userMail: function (){
      return this.$store.state.user.email;
    },

    registration: function (){
      return this.$store.state.server.registration;
    },
  },

  data() {
    return {
      registrationTime: undefined,
      expiresIn: undefined,
      demoAccount: false,
    }
  },

  methods: {
    getDate(unix){
      var date = new Date(unix * 1000);

      return date.getDate().toString().padStart(2, '0') + "." + (date.getMonth() + 1).toString().padStart(2, '0') + "." + date.getFullYear();
    },
  },

  async mounted() {
    const session = this.$cookies.get("auth_session");

    if (this.registration){
      await this.$axios.get("/user/registration/getData?token=" + session)
        .then(response => response.data)
        .then(result => {
          this.registrationTime = this.getDate(result.registrationTime.seconds)
          this.expiresIn = this.getDate(result.expiresIn.seconds)
          this.demoAccount = result.demoAccount
        })
    }
  }
}
</script>

<style scoped>

</style>
