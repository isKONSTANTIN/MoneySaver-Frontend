<template>
  <div class="card background shadow-lg">
    <div class="card-body p-5">
      <div class="card-title">{{account.name}}
        <div v-if="!hideActions" class="btn btn-ghost p-1 max-h-min" @click="editName(account)">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </div>
      </div>
      <p class="font-bold text-lg"> {{new Intl.NumberFormat().format(account.amount)}} ₽</p>
    </div>

  </div>
</template>

<script>
export default {
  name: "account",

  props: {
    account: Object,
    hideActions: false
  },

  mounted() {

  },

  methods: {
    editName(account){
      this.$store.commit("showModal", {name: "account-name-setter", data: account})
    }
  }
}
</script>

<style scoped>
.background {
  @apply mt-3 bg-base-100;

  background-image: url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='%23cadbc9' fill-opacity='0.3' fill-rule='evenodd'/%3E%3C/svg%3E");
}

.btn{
  min-height: 0;
  height: 2rem;
}

</style>
