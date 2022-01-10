<template>
  <BarChart :chartData="chartData"></BarChart>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import { BarChart} from 'vue-chart-3';

export default defineComponent({
  name: "barChart",

  components: {BarChart},

  props: {
    chartData: Object
  },
});
</script>

<style scoped>

</style>
