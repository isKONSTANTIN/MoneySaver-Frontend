<template>
  <div>
    <div data-theme="light" class="flex gap-2 flex-wrap justify-center lg:justify-start">
      <button class="btn btn-sm bg-neutral text-neutral-content" @click="$store.commit('showModal', {'name': 'new-transaction'})">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        транзакция
      </button>

      <button class="btn btn-sm bg-neutral text-neutral-content" @click="$store.commit('showModal', {'name': 'new-tag'})">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
        тег
      </button>

      <button class="btn btn-sm bg-neutral text-neutral-content" @click="$store.commit('showModal', {'name': 'new-plan'})">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        план
      </button>

      <button class="btn btn-sm bg-neutral text-neutral-content" @click="$store.commit('showModal', {'name': 'new-repeat-transaction'})">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        повтор. транзакция
      </button>
      <button class="btn btn-sm bg-neutral text-neutral-content" @click="$store.commit('showModal', {'name': 'account-transfer'})">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        между счетами
      </button>
    </div>

  </div>
</template>

<script>
export default {
  name: "actions"
}
</script>

<style scoped>

</style>
