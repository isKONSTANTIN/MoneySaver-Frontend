<template>
  <div class="w-full stats shadow-lg">
    <div class="stat">
      <div class="stat-title">Расход за этот месяц</div>
      <div class="stat-value">{{gs.costsMonthSum}} ₽</div>
      <div class="stat-desc">С учетом доходов: {{new Intl.NumberFormat().format(gs.costsMonthSum + gs.incomeMonthSum) + ' ₽'}}</div>
    </div>

    <div class="stat">
      <div class="stat-title">Расход вчера</div>
      <div class="stat-value">{{gs.costsYesterdaySum}} ₽</div>
      <div class="stat-desc">С учетом доходов: {{new Intl.NumberFormat().format(gs.costsYesterdaySum + gs.incomeYesterdaySum) + ' ₽'}}</div>
    </div>

    <div class="stat">
      <div class="stat-title">Расход сегодня</div>
      <div class="stat-value">{{gs.costsTodaySum}} ₽</div>
      <div class="stat-desc">С учетом доходов: {{new Intl.NumberFormat().format(gs.costsTodaySum + gs.incomeTodaySum) + ' ₽'}}</div>
    </div>
  </div>

</template>

<script>
export default {
  name: "generalStatistics",

  computed: {
    gs: function (){
      return this.$store.state.genericStatistics;
    },
  },

  methods: {

  }
}
</script>

<style scoped>

</style>
