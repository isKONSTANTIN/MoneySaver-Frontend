<template>
  <div class="w-full stats shadow-lg">
    <div class="stat">
      <div class="stat-title">Расход за этот месяц</div>
      <div class="stat-value">{{genericStatistics.costsMonthSum}} ₽</div>
      <div class="stat-desc">С учетом доходов: {{new Intl.NumberFormat().format(genericStatistics.costsMonthSum + genericStatistics.incomeMonthSum) + ' ₽'}}</div>
    </div>

    <div class="stat">
      <div class="stat-title">Расход вчера</div>
      <div class="stat-value">{{genericStatistics.costsYesterdaySum}} ₽</div>
      <div class="stat-desc">С учетом доходов: {{new Intl.NumberFormat().format(genericStatistics.costsYesterdaySum + genericStatistics.incomeYesterdaySum) + ' ₽'}}</div>
    </div>

    <div class="stat">
      <div class="stat-title">Расход сегодня</div>
      <div class="stat-value">{{genericStatistics.costsTodaySum}} ₽</div>
      <div class="stat-desc">С учетом доходов: {{new Intl.NumberFormat().format(genericStatistics.costsTodaySum + genericStatistics.incomeTodaySum) + ' ₽'}}</div>
    </div>
  </div>

</template>

<script>
export default {
  name: "generalStatistics",

  computed: {
    genericStatistics: function (){
      return this.$store.state.genericStatistics;
    },
  },

  methods: {
    async getCostsAtDay(year, month, day) {
      var result
      const session = this.$cookies.get("auth_session");

      await fetch(this.$axios.defaults.baseURL + "api/info/dayChanges?token=" + session + "&year=" + year + "&month=" + month + "&day=" + day)
        .then(response => response.json())
        .then(r => {
          result = r
        })
        .catch((e) => {
          console.log(e)
        })

      return result
    }
  }
}
</script>

<style scoped>

</style>
