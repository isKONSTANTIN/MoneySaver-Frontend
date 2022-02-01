<template>
  <div class="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box">
    <div class="flex-none px-2 mx-2">
    <span class="text-lg font-bold">
      MoneySaver
    </span>
    </div>
    <div class="flex-1 px-2 mx-2">
      <div class="items-stretch hidden lg:flex">
        <NuxtLink to="/" class="btn btn-ghost btn-sm rounded-btn">Дом</NuxtLink>
        <NuxtLink to="/allTransactions" class="btn btn-ghost btn-sm rounded-btn">Транзакции</NuxtLink>
        <NuxtLink to="/allPlans" class="btn btn-ghost btn-sm rounded-btn">Планы</NuxtLink>
        <NuxtLink to="/allTags" class="btn btn-ghost btn-sm rounded-btn">Теги</NuxtLink>
        <NuxtLink to="/allRepeatTransactions" class="btn btn-ghost btn-sm rounded-btn">Повтор. транзакции</NuxtLink>
        <NuxtLink to="/analytics" class="btn btn-ghost btn-sm rounded-btn">Аналитика</NuxtLink>
      </div>
    </div>

    <div class="flex-none mr-2">
      <div class="hidden lg:flex cursor-default font-bold">
        <NuxtLink to="/user" class="btn btn-ghost btn-sm rounded-btn">{{userMail}}</NuxtLink>
      </div>
      <div class="dropdown dropdown-end lg:hidden">
        <div tabindex="0" class="m-1 btn btn-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </div>
        <div tabindex="0" class="p-2 shadow menu dropdown-content bg-base-100 text-base-content rounded-box">
          <div class="cursor-default font-bold text-center">
            <NuxtLink to="/user" class="btn btn-ghost btn-sm rounded-btn">{{userMail}}</NuxtLink>
            <hr class="mb-1">
          </div>
          <NuxtLink to="/" class="btn btn-ghost btn-sm rounded-btn">Дом</NuxtLink>
          <NuxtLink to="/allTransactions" class="btn btn-ghost btn-sm rounded-btn">Транзакции</NuxtLink>
          <NuxtLink to="/allPlans" class="btn btn-ghost btn-sm rounded-btn">Планы</NuxtLink>
          <NuxtLink to="/allTags" class="btn btn-ghost btn-sm rounded-btn">Теги</NuxtLink>
          <NuxtLink to="/allRepeatTransactions" class="btn btn-ghost btn-sm rounded-btn">Повтор. транзакции</NuxtLink>
          <NuxtLink to="/analytics" class="btn btn-ghost btn-sm rounded-btn">Аналитика</NuxtLink>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "navbar",

  computed: {
    userMail: function (){
      return this.$store.state.user.email;
    },
  },

}
</script>

<style scoped>

</style>
