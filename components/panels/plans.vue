<template>
  <div class="panel">
    <h2 class="font-bold">Планы:</h2>
    <hr class="my-4">

    <div class="gap-2 flex flex-wrap flex-col lg:flex-row">
      <plan v-for="plan in plans" :plan="plan"></plan>
    </div>

  </div>
</template>

<script>
import Plan from "~/components/objects/plan";
export default {
  name: "plans",
  components: {Plan},
  computed: {
    plans: function (){
      return this.$store.state.plans;
    },
  },
}
</script>

<style scoped>

</style>
