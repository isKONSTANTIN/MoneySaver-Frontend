<template>
  <div data-theme="light" class="p-2 rounded-2xl bg-base-100">
    <DoughnutChart :chartData="chartData" :options="options"></DoughnutChart>
  </div>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import {DoughnutChart} from 'vue-chart-3';

export default defineComponent({
  name: "doughnutChart",

  components: {DoughnutChart},

  props: {
    chartData: Object,
    options: {}
  },
});
</script>

<style scoped>

</style>
