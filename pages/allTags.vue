<template>
  <div>
    <div class="flex flex-col items-center w-full upper">
      <navbar class="mt-5 mb-8 w-4/5"></navbar>

      <div class="content">
        <div class="w-full shadow stats mb-2">
          <div class="stat place-items-center place-content-center">
            <div class="stat-title">Общий доход</div>
            <div class="stat-value text-success">{{new Intl.NumberFormat().format(incomeSum())}} ₽</div>
          </div>

          <div class="stat place-items-center place-content-center">
            <div class="stat-title">Общий расход</div>
            <div class="stat-value text-error">{{new Intl.NumberFormat().format(costsSum())}} ₽</div>
          </div>

          <div class="stat place-items-center place-content-center">
            <div class="stat-title">Итого</div>
            <div class="stat-value">{{new Intl.NumberFormat().format(incomeSum() - costsSum())}} ₽</div>
          </div>
        </div>

        <div class="panel">
          <div class="flex justify-between mr-4">
            <h2 class="font-bold">Все теги:</h2>
            <button class="btn btn-ghost btn-xs" @click="$store.commit('showModal', {'name': 'new-tag'})">+</button>
          </div>
          <hr class="my-2">
          <div class="overflow-x-auto">
            <table class="table table-compact table-zebra">
              <thead>
              <tr>
                <th>Название</th>
                <th>Тип</th>
                <th>Рублей в месяц</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="tag in tags">
                <th>{{tag.name}}</th>
                <td>{{tag.kind === -1 ? "Расходы" : (tag.kind === 1 ? "Доходы" : "Совместный")}}</td>
                <td>{{new Intl.NumberFormat().format(tag.limit)}}</td>
                <td>
                  <button @click="$store.commit('showModal', {'name': 'tag-editor', data: tag})" class="btn btn-ghost p-1">
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
import Actions from "../components/panels/actions";
import Transactions from "../components/panels/transactions";
import MonthStatistics from "../components/panels/monthStatistics";
import Modals from "../components/modals/modals";
import Accounts from "../components/panels/accounts";
import Navbar from "../components/panels/navbar";
import ListedTag from "../components/objects/listedTag";
import FooterPanel from "../components/panels/footerPanel";

export default {
  name: "allTags",
  middleware: 'auth',
  components: {FooterPanel, ListedTag, Actions, Transactions, MonthStatistics, Modals, Accounts, Navbar},

  computed: {
    tags: function (){
      return this.$store.state.tags;
    },
  },

  methods: {
    incomeSum() {
      var result = 0;
      Object.values(this.tags).filter(t => t.kind === 1).forEach(t => result += t.limit)
      return result
    },

    costsSum() {
      var result = 0;
      Object.values(this.tags).filter(t => t.kind === -1).forEach(t => result += t.limit)
      return result
    },
  },

  beforeMount() {
    const session = this.$cookies.get("auth_session");

    actions.preloadData(this, session)
  }
}
</script>

<style scoped>
.content {
  @apply w-full lg:w-4/5;
}

.panel {
  @apply shadow-lg rounded-2xl p-0 pt-4 pb-4 pl-2 lg:p-4 bg-base-100;
}

</style>
