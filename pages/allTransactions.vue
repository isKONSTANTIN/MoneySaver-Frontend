<template>
  <div>
    <div class="flex flex-col items-center w-full upper">
      <navbar class="mt-5 mb-8 w-4/5"></navbar>

      <div class="content">
        <div class="panel min-w-max">

          <div class="flex justify-between mr-4">
            <h2 class="font-bold">Все транзакции:</h2>
            <div>
              <button class="btn btn-ghost btn-xs" @click="$store.commit('showModal', {'name': 'new-transaction'})">+</button>
              <button class="btn btn-ghost btn-xs" @click="changePage(-1)"><</button>
              <button class="btn btn-ghost btn-xs" @click="changePage(1)">></button>
            </div>

          </div>
          <hr class="my-2">

          <table class="table min-w-max w-full table-compact table-zebra">
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
              <td>{{new Intl.NumberFormat().format(transaction.delta)}}</td>
              <td>
                {{getTagName(transaction.tag)}}
              </td>
              <td>{{getDate(transaction.date.seconds)}}</td>
              <td>{{getAccountName(transaction.account)}}</td>
              <td>{{transaction.description}}</td>
              <td>
                <button @click="cancelTransaction(transaction.id)" class="btn btn-ghost p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
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
  middleware: 'auth',
  components: {FooterPanel, ListedTag, Actions, Transactions, MonthStatistics, Modals, Accounts, Navbar},

  data() {
    return {
      transactions: {},
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
      this.loadTransactions(this.page);
    },

    loadTransactions(page){
      const session = this.$cookies.get("auth_session");

      fetch(this.$axios.defaults.baseURL + "api/transactions?token=" + session + "&count=25" + "&offset=" + ((page - 1) * 25))
        .then(response => response.json())
        .then(result => {
          this.transactions = result
        })
    },

    cancelTransaction(id) {
      const session = this.$cookies.get("auth_session");

      actions.apiPostRequest("transactions/cancel?token=" + session, {id: id}, this.$axios.defaults.baseURL)
        .then(() => {
          this.loadTransactions(this.page)
        })
    }
  },

  beforeMount() {
    const session = this.$cookies.get("auth_session");

    actions.preloadData(this, session)
    this.loadTransactions(this.page)

    this.$store.commit("setModalHideEvent", {
      name: "new-transaction",
      func: () => {
        this.page = 1
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
