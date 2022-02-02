<template>
  <BarChart :chartData="chartData" :options="options"></BarChart>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import { BarChart} from 'vue-chart-3';

export default defineComponent({
  name: "barChart",

  components: {BarChart},

  props: {
    chartData: Object,
    options: {}
  },
});
</script>

<style scoped>

</style>
