<template>
  <div>
    <div class="flex flex-col items-center w-full upper">
      <navbar class="mt-5 mb-8 w-4/5"></navbar>

      <div class="content">
        <div class="panel">

          <div class="flex justify-between mr-4">
            <h2 class="font-bold">Все транзакции:</h2>
            <div>
              <button class="btn btn-ghost btn-xs" @click="$store.commit('showModal', {'name': 'new-transaction'})">+</button>
              <button class="btn btn-ghost btn-xs" @click="changePage(-1)"><</button>
              <button class="btn btn-ghost btn-xs" @click="changePage(1)">></button>
            </div>

          </div>
          <hr class="my-2">
          <div class="flex justify-between items-center">
            <div class="flex gap-2">
              <div class="text-sm rounded-box border p-1">
                <select v-model="filterTag" @change="applyFilter" class="select select-sm">
                  <option selected>Любой тег</option>
                  <option v-for="tag in tags">{{tag.name}}</option>
                </select>
              </div>

              <div class="text-sm rounded-box border p-1">
                <select v-model="filterAccount" @change="applyFilter" class="select select-sm">
                  <option selected>Любой счет</option>
                  <option v-for="acc in accounts">{{acc.name}}</option>
                </select>
              </div>

              <div class="text-sm rounded-box border pl-2 p-1">
                От: <input type="date" class="input input-sm p-0 pl-1" @change="applyFilter" v-model="filterDataFrom">
              </div>

              <div class="text-sm rounded-box border pl-2 p-1">
                До: <input type="date" class="input input-sm p-0 pl-1" @change="applyFilter" v-model="filterDataUpTo">
              </div>

              <div class="text-sm rounded-box border flex items-center justify-center">
                <input type="text" placeholder="Описание" v-model="filterDesc" @change="applyFilter" class="input input-sm">
              </div>
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
                <th>Описание</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="transaction in transactions">
                <th>{{new Intl.NumberFormat().format(transaction.delta)}}</th>
                <td>
                  {{getTagName(transaction.tag)}}
                </td>
                <td>{{getDate(transaction.date.seconds)}}</td>
                <td>{{getAccountName(transaction.account)}}</td>
                <td>{{transaction.description}}</td>
                <td>
                  <button @click="$store.commit('showModal', {'name': 'transaction-editor', data: transaction})" class="btn btn-ghost p-1">
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
  name: "allTransactions",
  middleware: ['serverRequired', 'auth'],
  components: {FooterPanel, ListedTag, Actions, Transactions, MonthStatistics, Modals, Accounts, Navbar},

  data() {
    return {
      transactions: {},
      page: 1,

      filterTag: "Любой тег",
      filterAccount: "Любой счет",
      filterDesc: "",
      filterDataFrom: 0,
      filterDataUpTo: 0
    }
  },

  computed: {
    tagsMap: function () {
      return this.$store.state.tagsMap;
    },

    accountsMap: function () {
      return this.$store.state.accountsMap;
    },

    accounts: function (){
      return this.$store.state.accounts;
    },

    tags: function (){
      return this.$store.state.tags;
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
      this.loadTransactions(this.page);
    },

    applyFilter() {
      this.loadTransactions(this.page);
    },

    loadTransactions(page){
      const session = this.$cookies.get("auth_session");

      const filter = {
        descriptionContains: this.filterDesc
      }

      const tagObj = this.tags.find(t => t.name === this.filterTag)
      const accountObj = this.accounts.find(a => a.name === this.filterAccount)
      const timeFrom = new Date(this.filterDataFrom).getTime();
      const timeUpTo = new Date(this.filterDataUpTo).getTime();

      if (tagObj)
        filter.tag = tagObj.id

      if (accountObj)
        filter.account = accountObj.id

      if (!isNaN(timeFrom))
        filter.dateFrom = timeFrom;

      if (!isNaN(timeUpTo))
        filter.dateUpTo = timeUpTo;

      console.log(filter.dateFrom)

      this.$axios.get("/transactions?token=" + session + "&count=25" + "&offset=" + ((page - 1) * 25) + "&filter=" + encodeURIComponent(JSON.stringify(filter)))
        .then(response => response.data)
        .then(result => {
          this.transactions = result
        })
    }
  },

  async asyncData({$cookies, $axios, store}) {
    const session = $cookies.get("auth_session");

    await actions.preloadData({$axios: $axios, $store: store}, session)
  },

  beforeMount() {
    this.loadTransactions(this.page)

    this.$store.commit("setModalHideEvent", {
      name: "new-transaction",
      func: () => {
        this.page = 1
        this.loadTransactions(this.page)
      }
    })

    this.$store.commit("setModalHideEvent", {
      name: "transaction-editor",
      func: () => {
        this.loadTransactions(this.page)
      }
    })
  }
}
</script>

<style scoped>

.panel {
  @apply shadow-lg rounded-2xl p-0 pt-4 pl-2 lg:p-4 bg-base-100;
}

</style>
