<template>
  <div class="">
    <div class="flex justify-center items-center lg:justify-start">
      <h2 class="font-bold mb-0.5">Счета</h2>

      <div @click="$store.commit('showModal', {'name': 'new-account'})" class="btn btn-sm btn-ghost ml-1.5 p-0.5">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
    </div>

    <account v-for="account in accounts" :account="account"></account>

  </div>
</template>

<script>
import Account from "../objects/account";
export default {
  name: "accounts",
  components: {Account},
  computed: {
    accounts: function (){
      return this.$store.state.accounts;
    },
  },

  methods: {

  }
}
</script>

<style scoped>

</style>
