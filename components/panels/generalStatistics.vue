<template>
  <div class="w-full stats shadow-lg">
    <div class="stat">
      <div class="stat-title">Расход за этот месяц</div>
      <div class="stat-value">{{costsMonthSum}} ₽</div>
      <div class="stat-desc">С учетом доходов: {{new Intl.NumberFormat().format(costsMonthSum + incomeMonthSum) + ' ₽'}}</div>
    </div>

    <div class="stat">
      <div class="stat-title">Расход вчера</div>
      <div class="stat-value">{{costsYesterdaySum}} ₽</div>
      <div class="stat-desc">С учетом доходов: {{new Intl.NumberFormat().format(costsYesterdaySum + incomeYesterdaySum) + ' ₽'}}</div>
    </div>

    <div class="stat">
      <div class="stat-title">Расход сегодня</div>
      <div class="stat-value">{{costsTodaySum}} ₽</div>
      <div class="stat-desc">С учетом доходов: {{new Intl.NumberFormat().format(costsTodaySum + incomeTodaySum) + ' ₽'}}</div>
    </div>
  </div>

</template>

<script>
export default {
  name: "generalStatistics",

  computed: {
    monthChanges: function (){
      return this.$store.state.monthChanges;
    },
  },

  data() {
    return {
      costsTodaySum: 0,
      costsYesterdaySum: 0,
      costsMonthSum: 0,

      incomeTodaySum: 0,
      incomeYesterdaySum: 0,
      incomeMonthSum: 0
    }
  },


  async mounted() {
    var date = new Date()

    const tyear = date.getFullYear()
    const tmonth = date.getMonth() + 1
    const tday = date.getDate()

    date.setDate(date.getDate() - 1);

    const yyear = date.getFullYear()
    const ymonth = date.getMonth() + 1
    const yday = date.getDate()

    console.log(tyear, tmonth, tday)
    console.log(yyear, ymonth, yday)

    const changesToday = await this.getCostsAtDay(tyear, tmonth, tday)
    const changesYesterday = await this.getCostsAtDay(yyear, ymonth, yday)

    var costsTodaySum = 0
    var costsYesterdaySum = 0
    var costsMonthSum = 0

    var incomeTodaySum = 0
    var incomeYesterdaySum = 0
    var incomeMonthSum = 0

    for (const [key, value] of Object.entries(changesToday))
      if (value < 0) costsTodaySum += value
      else incomeTodaySum += value

    for (const [key, value] of Object.entries(changesYesterday))
      if (value < 0) costsYesterdaySum += value
      else incomeYesterdaySum += value

    for (const [key, value] of Object.entries(this.monthChanges))
      if (value < 0) costsMonthSum += value
      else incomeMonthSum += value

    this.costsYesterdaySum = Number(costsYesterdaySum.toFixed(2));
    this.costsTodaySum = Number(costsTodaySum.toFixed(2));
    this.costsMonthSum = Number(costsMonthSum.toFixed(2));

    this.incomeTodaySum = Number(incomeTodaySum.toFixed(2));
    this.incomeYesterdaySum = Number(incomeYesterdaySum.toFixed(2));
    this.incomeMonthSum = Number(incomeMonthSum.toFixed(2));
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
