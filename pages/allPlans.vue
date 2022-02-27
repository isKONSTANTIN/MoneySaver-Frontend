<template>
  <div>
    <div class="flex flex-col items-center w-full upper">
      <navbar class="mt-5 mb-8 w-4/5"></navbar>

      <div class="content">
        <div class="panel">

          <div class="flex justify-between mr-4">
            <h2 class="font-bold">Все планы:</h2>
            <div>
              <button class="btn btn-ghost btn-xs" @click="$store.commit('showModal', {'name': 'new-plan'})">+</button>
              <button class="btn btn-ghost btn-xs" @click="changePage(-1)"><</button>
              <button class="btn btn-ghost btn-xs" @click="changePage(1)">></button>
            </div>

          </div>
          <hr class="my-2">

          <div class="overflow-x-auto">
            <table class="table w-full table-compact table-zebra">
              <thead>
              <tr>
                <th>Сумма</th>
                <th>Тег</th>
                <th>Дата</th>
                <th>Счет</th>
                <th>Состояние</th>
                <th>Описание</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="plan in allPlans">
                <th>{{new Intl.NumberFormat().format(plan.delta)}}</th>
                <td>
                  {{getTagName(plan.tag)}}
                </td>
                <td>{{getDate(plan.date.seconds)}}</td>
                <td>{{getAccountName(plan.account)}}</td>
                <td><p :class="{'text-red-600' : plan.state === -1, 'text-green-600' : plan.state === 1}">{{plan.state === -1 ? "Не выполнен" : (plan.state === 1 ? "Выполнен" : "Ожидает")}}</p></td>
                <td>{{plan.description}}</td>
                <td>
                  <button @click="$store.commit('showModal', {'name': 'plan-editor', data: plan})" class="btn btn-ghost p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <modals></modals>
    </div>

    <footer-panel class="mt-6"></footer-panel>
  </div>
</template>

<script>
import {actions} from "../store";
import Navbar from "../components/panels/navbar";
import ListedTag from "../components/objects/listedTag";
import Actions from "../components/panels/actions";
import Transactions from "../components/panels/transactions";
import MonthStatistics from "../components/panels/monthStatistics";
import Modals from "../components/modals/modals";
import Accounts from "../components/panels/accounts";
import FooterPanel from "../components/panels/footerPanel";

export default {
  name: "allPlans",
  middleware: 'auth',
  components: {FooterPanel, ListedTag, Actions, Transactions, MonthStatistics, Modals, Accounts, Navbar},

  data() {
    return {
      allPlans: {},
      page: 1
    }
  },

  computed: {
    tagsMap: function () {
      return this.$store.state.tagsMap;
    },

    accountsMap: function () {
      return this.$store.state.accountsMap;
    },
  },

  methods: {
    getDate(unix){
      var date = new Date(unix * 1000);

      return date.getDate().toString().padStart(2, '0') + "." + (date.getMonth() + 1).toString().padStart(2, '0') + "." + date.getFullYear();
    },

    getTagName(id){
      var tag = this.tagsMap[id];

      if (tag === undefined)
        return ""

      return tag.name;
    },

    getAccountName(id){
      var account = this.accountsMap[id];

      if (account === undefined)
        return ""

      return account.name;
    },

    changePage(delta){
      if (this.page + delta === 0)
        return

      this.page += delta;
      this.loadPlans(this.page);
    },

    loadPlans(page){
      const session = this.$cookies.get("auth_session");
      this.$axios.get("/plans/all?token=" + session + "&count=25" + "&offset=" + ((page - 1) * 25))
        .then(response => response.data)
        .then(result => {
          this.allPlans = result
        })
    }
  },

  async asyncData({$cookies, $axios, store}) {
    const session = $cookies.get("auth_session");

    await actions.preloadData({$axios: $axios, $store: store}, session)
  },

  beforeMount() {
    this.loadPlans(this.page)

    this.$store.commit("setModalHideEvent", {
      name: "plan-editor",
      func: () => {
        this.page = 1
        this.loadPlans(this.page)
      }
    })

    this.$store.commit("setModalHideEvent", {
      name: "new-plan",
      func: () => {
        this.page = 1
        this.loadPlans(this.page)
      }
    })
  }
}
</script>

<style scoped>

</style>
