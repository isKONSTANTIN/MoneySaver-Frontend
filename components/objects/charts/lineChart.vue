<template>
  <LineChart :chartData="chartData"></LineChart>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import { LineChart} from 'vue-chart-3';

export default defineComponent({
  name: "lineChart",

  components: {LineChart},

  props: {
    chartData: Object
  },
});
</script>

<style scoped>

</style>
