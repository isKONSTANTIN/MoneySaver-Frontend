<template>
  <DoughnutChart :chartData="chartData" :options="options"></DoughnutChart>
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
