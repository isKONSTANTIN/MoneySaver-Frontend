<template>
  <div class="panel flex flex-col justify-items-stretch items-stretch">
    <div class="">
      <h2 class="font-bold">Скан QR-кодов:</h2>
      <hr class="mb-2 mt-1">
    </div>

    <div class="flex justify-center items-center flex-col w-full h-full">
      <div class="font-bold mb-1">Текущий токен для чеков:</div>
      <div class="flex items-center gap-2">
        <div class="badge badge-accent badge-lg">{{user.receiptToken}}</div>
        <button class="btn btn-circle btn-accent btn-xs" @click="$store.commit('showModal', {name: 'receipt-token-setter'})">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "receiptTokenPanel",

  computed: {
    user: function (){
      return this.$store.state.user;
    },
  },
}
</script>

<style scoped>

</style>
