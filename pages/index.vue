<template>
  <div>
    <div class="flex flex-col items-center w-full upper">
      <navbar class="mt-5 mb-8 w-4/5"></navbar>

      <div class="content">
        <div class="hiddenPanel">
          <accounts class="row-span-4"></accounts>
          <month-statistics class="row-span-3 lg:row-span-2 lg:col-span-2"></month-statistics>
          <plans class="row-span-3 lg:row-span-1 lg:col-span-2"></plans>
          <actions class="row-start-1 lg:row-start-auto row-span-1"></actions>
          <transactions class="row-span-2"></transactions>
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
export default {
  name: 'IndexPage',
  middleware: 'auth',
  components: {FooterPanel, Plans, Actions, Transactions, MonthStatistics, Modals, Accounts, Navbar},

  beforeMount() {
    const session = this.$cookies.get("auth_session");

    actions.preloadData(this, session)
  }
}
</script>
