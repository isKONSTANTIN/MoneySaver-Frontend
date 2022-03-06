<template>
  <div>
    <div class="flex flex-col items-center w-full upper">
      <navbar class="mt-5 mb-8 w-4/5"></navbar>

      <div class="content">
        <div class="hiddenPanel">
          <user-panel class="row-span-1"></user-panel>
          <sessions-panel class="row-span-2"></sessions-panel>
          <password-changer-panel class="row-span-2"></password-changer-panel>
          <receipt-token-panel class="row-span-1"></receipt-token-panel>

          <template v-if="user.isAdmin">
            <hr class="lg:col-span-3">
            <user-list-panel class="row-span-2" ref="userList"></user-list-panel>
            <register-user-panel :user-list="reloadUsers"></register-user-panel>
          </template>

        </div>
      </div>

      <modals></modals>
    </div>

    <footer-panel class="mt-6"></footer-panel>
  </div>
</template>

<script>
import FooterPanel from "../components/panels/footerPanel";
import Modals from "../components/modals/modals";
import Accounts from "../components/panels/accounts";
import Navbar from "../components/panels/navbar";
import {actions} from "../store";
import UserPanel from "../components/panels/user/userPanel";
import SessionsPanel from "../components/panels/user/sessionsPanel";
import ReceiptTokenPanel from "../components/panels/user/receiptTokenPanel";
import PasswordChangerPanel from "../components/panels/user/passwordChangerPanel";
import RegisterUserPanel from "../components/panels/user/admin/registerUserPanel";
import UserListPanel from "../components/panels/user/admin/userListPanel";

export default {
  name: "user",
  middleware: ['serverRequired', 'auth'],
  components: {
    UserListPanel,
    RegisterUserPanel,
    PasswordChangerPanel, ReceiptTokenPanel, SessionsPanel, UserPanel, FooterPanel, Modals, Accounts, Navbar},

  mounted() {

  },

  computed: {
    user: function (){
      return this.$store.state.user;
    },
  },

  methods: {
    reloadUsers(page) {
      this.$refs.userList.changePageG(page)
    }
  },

  async asyncData({$cookies, $axios, store}) {
    const session = $cookies.get("auth_session");

    var context = {$axios: $axios, $store: store}

    await actions.preloadData(context, session)
  },
}
</script>

<style scoped>

</style>
