<template>
  <div data-theme="light" class="p-2 rounded-2xl bg-base-100">
    <LineChart :chartData="chartData" :options="options"></LineChart>
  </div>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import { LineChart } from 'vue-chart-3';

export default defineComponent({
  name: "lineChart",

  components: {LineChart},

  props: {
    chartData: Object,
    options: {}
  },
});
</script>

<style scoped>

</style>
