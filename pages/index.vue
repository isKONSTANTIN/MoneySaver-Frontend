<template>
  <div>
    <div class="flex flex-col items-center w-full upper">
      <navbar class="mt-5 mb-8 w-4/5"></navbar>

      <div class="content">
        <div class="hiddenPanel auto-rows-max">
          <div class="row-span-5 flex flex-col gap-6">
            <accounts></accounts>
            <transactions></transactions>
          </div>
          <actions class="row-start-1 lg:row-start-auto row-span-1 lg:col-span-2"></actions>
          <plans class="row-span-3 lg:row-span-1 lg:col-span-2"></plans>
          <general-statistics class="lg:col-span-2"></general-statistics>
          <month-statistics class="lg:col-span-2"></month-statistics>
        </div>

      </div>

      <modals></modals>
    </div>

    <footer-panel class="mt-6"></footer-panel>
  </div>
</template>

<script>
import Navbar from "../components/panels/navbar";
import Accounts from "../components/panels/accounts";
import Modals from "../components/modals/modals";
import MonthStatistics from "../components/panels/monthStatistics";
import {actions} from "../store";
import Transactions from "../components/panels/transactions";
import Actions from "../components/panels/actions";
import Plans from "~/components/panels/plans";
import FooterPanel from "../components/panels/footerPanel";
import GeneralStatistics from "../components/panels/generalStatistics";
export default {
  name: 'IndexPage',
  middleware: 'auth',
  components: {GeneralStatistics, FooterPanel, Plans, Actions, Transactions, MonthStatistics, Modals, Accounts, Navbar},

  mounted() {
    const session = this.$cookies.get("auth_session");

    actions.notifications(this, session)
  },

  async asyncData({$cookies, $axios, store}) {
    const session = $cookies.get("auth_session");

    var context = {$axios: $axios, $store: store}

    await actions.preloadData(context, session)
  }
}
</script>
