<template>
  <div>
    <div class="flex flex-col items-center w-full upper">
      <navbar class="mt-5 mb-8 w-4/5"></navbar>

      <div class="content">
        <div class="hiddenPanel">

          <div class="panel lg:col-span-3 row-span-2">
            <div class="flex justify-between">
              <h2 class="font-bold">Статистика по тегам:</h2>

              <div>
                <select @change="loadData()" v-model="year" class="select select-bordered select-sm max-w-xs">
                  <option selected="selected">{{getYear(0)}}</option>
                  <option>{{getYear(-1)}}</option>
                  <option>{{getYear(-2)}}</option>
                  <option>{{getYear(-3)}}</option>
                  <option>{{getYear(-4)}}</option>
                  <option>{{getYear(-5)}}</option>
                </select>
                <button @click="downloadReport()" class="ml-1 btn btn-accent btn-sm">Скачать .CSV</button>
              </div>

            </div>

            <hr class="my-4">
            <line-chart :chart-data="yearTagsData"></line-chart>
          </div>

          <div class="panel">
            <h2 class="font-bold">Расходы за год:</h2>
            <hr class="my-4">
            <doughnut-chart :chart-data="doughnutCostsTagsData"></doughnut-chart>
          </div>

          <div class="panel">
            <h2 class="font-bold">Доходы за год:</h2>
            <hr class="my-4">
            <doughnut-chart :chart-data="doughnutIncomesTagsData"></doughnut-chart>
          </div>

          <div class="panel">
            <h2 class="font-bold">Доходы и расходы:</h2>
            <hr class="my-4">
            <bar-chart :chart-data="barYearTagsData"></bar-chart>
          </div>

        </div>
      </div>

      <modals></modals>
    </div>

    <footer-panel class="mt-6"></footer-panel>
  </div>
</template>

<script>
import FooterPanel from "../components/panels/footerPanel";
import Navbar from "../components/panels/navbar";
import LineChart from "../components/objects/charts/lineChart";
import moment from "moment";
import {actions} from "../store";
import DoughnutChart from "../components/objects/charts/doughnutChart";
import BarChart from "../components/objects/charts/barChart";
import Modals from "../components/modals/modals";

export default {
  name: "analytics",
  middleware: 'auth',
  components: {BarChart, DoughnutChart, LineChart, FooterPanel, Navbar, Modals},

  data() {
    return {
      year: new Date().getFullYear(),
      yearTagsData: {},
      barYearTagsData: {},
      doughnutCostsTagsData: {},
      doughnutIncomesTagsData: {},
    }
  },

  computed: {
    tagsMap: function () {
      return this.$store.state.tagsMap;
    }
  },

  methods: {
    downloadReport(){
      const session = this.$cookies.get("auth_session");
      fetch(this.$axios.defaults.baseURL + "api/info/report?token=" + session + "&year=" + this.year)
        .then(res => res.blob())
        .then(blob =>{
          var file = window.URL.createObjectURL(blob)
          window.location.assign(file)
        });
    },

    getYear(offset){
      return new Date().getFullYear() + offset;
    },

    stringToColour(str) {
      var hash = 0;
      for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      var colour = '#';
      for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
      }
      return colour;
    },

    calculateYearTagsData(data) {
      var monthsCount = parseInt(this.year) === new Date().getFullYear() ? new Date().getMonth() + 1 : 12  // TODO: + 12 -> 1
      var datasets = []
      var costsSum = []
      var incomesSum = []

      for (const [tag, months] of Object.entries(data)) {
        var monthWithZeros = [];

        for (var i = 0; i < monthsCount; i++) {
          var delta = months[i + 1] === undefined ? 0 : months[i + 1];

          if (incomesSum[i] === undefined)
            incomesSum[i] = 0

          if (costsSum[i] === undefined)
            costsSum[i] = 0

          if (delta > 0){
            incomesSum[i] = incomesSum[i] + delta
          }else {
            costsSum[i] = costsSum[i] + delta;
          }

          monthWithZeros.push(delta)
        }

        datasets.push({
          label: this.tagsMap[tag].name,
          data: monthWithZeros,
          cubicInterpolationMode: 'monotone',
          borderColor: this.stringToColour(this.tagsMap[tag].name)
        })
      }

      datasets.push({
        label: "Итоговый расход",
        data: costsSum,
        cubicInterpolationMode: 'monotone',
        borderDash: [5, 5],
        borderColor: "#ffabab"
      })

      datasets.push({
        label: "Итоговый доход",
        data: incomesSum,
        cubicInterpolationMode: 'monotone',
        borderDash: [5, 5],
        borderColor: "#caffab"
      })

      const moment = require('moment');
      moment.locale('ru');

      const labels = moment.months();
      this.yearTagsData = {
        labels: labels,
        datasets: datasets
      };

      this.barYearTagsData = {
        labels: labels,
        datasets: [
          {
            label: "Итоговый доход",
            data: incomesSum,
            cubicInterpolationMode: 'monotone',
            backgroundColor: "#caffab"
          },
          {
            label: "Итоговый расход",
            data: costsSum,
            cubicInterpolationMode: 'monotone',
            backgroundColor: "#ffabab"
          }
        ]
      }
    },

    calculateDoughnutsTagsData(data){
      var costs = {}
      costs.labels = []
      costs.datas = []
      costs.colors = []

      var incomes = {}
      incomes.labels = []
      incomes.datas = []
      incomes.colors = []

      for (const [tag, months] of Object.entries(data)) {
        var tagDelta = 0;

        for (var i = 1; i <= (parseInt(this.year) === new Date().getFullYear() ? new Date().getMonth() + 1 : 12); i++)
          tagDelta += months[i] === undefined ? 0 : months[i]

        var to = tagDelta < 0 ? costs : (tagDelta > 0 ? incomes : undefined)

        if (to !== undefined){
          to.labels.push(this.tagsMap[tag].name)
          to.datas.push(Math.abs(tagDelta))
          to.colors.push(this.stringToColour(this.tagsMap[tag].name))
        }
      }

      this.doughnutCostsTagsData = {
        labels: costs.labels,
        datasets: [
          {
            label: 'Dataset 1',
            data: costs.datas,
            backgroundColor: costs.colors,
          }
        ],
      }

      this.doughnutIncomesTagsData = {
        labels: incomes.labels,
        datasets: [
          {
            label: 'Dataset 1',
            data: incomes.datas,
            backgroundColor: incomes.colors,
          }
        ],
      }
    },

    async loadData() {
      const session = this.$cookies.get("auth_session");

      var data = {}

      await fetch(this.$axios.defaults.baseURL + "api/info/yearChanges?token=" + session + "&year=" + this.year)
        .then(response => response.json())
        .then(result => {
          data = result;
        })

      var tags = {}

      for (const [month, map] of Object.entries(data)) {
        for (const [tag, delta] of Object.entries(map)) {
          if (tags[tag] === undefined)
            tags[tag] = []

          tags[tag][month] = delta
        }
      }

      this.calculateYearTagsData(tags)
      this.calculateDoughnutsTagsData(tags)
    }
  },

  async mounted() {
    const session = this.$cookies.get("auth_session");

    await actions.preloadData(this, session)
    await this.loadData()
  }
}
</script>

<style scoped>

</style>
