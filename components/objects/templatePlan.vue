<template>
  <div class="card min-w-max templateBorder">
    <div class="card-body p-5 justify-center items-center">
      <button class="btn btn-ghost text-gray-400" @click="$store.commit('showModal', {'name': 'new-plan'})">Добавить план</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "templatePlan"
}
</script>

<style scoped>
.templateBorder {
  @apply border-4 border-dashed;
}
</style>
