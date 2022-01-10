<template>
  <div class="panel">
    <h2 class="font-bold">Расходы за месяц по тегам:</h2>
    <hr class="my-4">

    <div class="gridPanel">
      <div v-for="cost in costs">
        <h2 class="font-medium">{{cost.tag.name}}:</h2>
        <progress class="progress progress-info" :value="cost.left" :max="cost.tag.limit"></progress>
        <div class="flex flex-nowrap font-light">
          {{
            cost.left > 0 ? 'Осталось ' + new Intl.NumberFormat().format(cost.left) + ' из ' + new Intl.NumberFormat().format(cost.tag.limit) + ' ₽'
              : 'Перерасход ' + new Intl.NumberFormat().format(Math.abs(cost.left)) + ' ₽ (лимит: ' + new Intl.NumberFormat().format(cost.tag.limit) + ')'
          }}
        </div>
      </div>
    </div>
    <hr class="my-2">
    <div class="w-full text-center font-bold">
      Всего за месяц потрачено: {{new Intl.NumberFormat().format(costsSum())}} ₽
    </div>
  </div>
</template>

<script>

import TagsChart from "../objects/charts/lineChart";
export default {
  name: "monthStatistics",
  components: {TagsChart},

  computed: {
    costs: function (){
      return this.$store.state.costsPrepared;
    },
  },

  methods: {
    costsSum(){
      var result = 0;

      this.costs.map(c => c.tag.limit - c.left).forEach(c => result += c);

      return result;
    }
  }

}
</script>

<style scoped>
  .gridPanel {
    @apply grid grid-cols-1 gap-4 lg:grid-cols-3;
  }
</style>
