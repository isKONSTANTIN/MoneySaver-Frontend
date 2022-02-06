<template>
  <div data-theme="light" class="p-2 rounded-2xl bg-base-100">
    <BarChart :chartData="chartData" :options="options"></BarChart>
  </div>
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
