<template>
  <div class="panel">
    <h2 class="font-bold">Действия:</h2>
    <hr class="my-4">

    <div class="gridPanel">
      <button class="btn" @click="$store.commit('showModal', {'name': 'new-transaction'})">Добавить транзакцию</button>
      <button class="btn" @click="$store.commit('showModal', {'name': 'new-tag'})">Добавить тег</button>
      <button class="btn" @click="$store.commit('showModal', {'name': 'new-plan'})">Добавить план</button>
      <button class="btn" @click="$store.commit('showModal', {'name': 'new-repeat-transaction'})">Добавить повтор. транзакцию</button>
    </div>

  </div>
</template>

<script>
export default {
  name: "actions"
}
</script>

<style scoped>
.gridPanel {
  @apply grid grid-cols-2 gap-2;
}
</style>
