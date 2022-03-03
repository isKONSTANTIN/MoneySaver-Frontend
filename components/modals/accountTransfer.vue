<template>
  <div class="modal">
    <div class="modal-box">
      <h2 class="font-bold mb-1">Перевод между счетами</h2>
      <hr class="mb-4">
      <div class="flex justify-center items-stretch">
        <div class="flex flex-col flex-auto items-stretch">
          <div class="dropdown">
            <div tabindex="0" class="m-1">
              <account v-if="accounts[fromId]" :account="accounts[fromId]" :hide-actions="true"></account>
            </div>

            <ul tabindex="0" class="p-2 shadow menu dropdown-content bg-base-100 rounded-box">
              <li v-for="(account, index) in accounts" @click="fromId = index; hideDropdown()">
                <account :hide-actions="true" :account="account" v-if="fromId !== index && toId !== index" :primary-account-id="-1"></account>
              </li>
            </ul>
          </div>

          <div class="dropdown">
            <div tabindex="1" class="m-1">
              <account :hide-actions="true" v-if="accounts[toId]" :account="accounts[toId]"></account>
            </div>

            <ul tabindex="1" class="p-2 shadow menu dropdown-content bg-base-100 rounded-box">
              <li v-for="(account, index) in accounts" @click="toId = index; hideDropdown()">
                <account :hide-actions="true" :account="account" v-if="fromId !== index && toId !== index" :primary-account-id="-1"></account>
              </li>
            </ul>
          </div>
        </div>

        <div class="flex flex-col justify-around">
          <div class="p-2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>

          <div class="btn lg:btn-xs btn-ghost w-min" @click="reverseAccounts()">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>

          <div class="p-2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
        </div>
      </div>
      <button class="w-0 h-0 m-0" id="focus" ref="focus" />
      <div class="form-control">
        <label class="label">
          <span class="label-text">Сумма</span>
        </label>
        <input type="number" min="0" v-model="amount" placeholder="Сумма" class="input input-bordered">
      </div>

      <error class="mt-2" :text="error"></error>

      <div class="modal-action">
        <label @click="$store.commit('hideModal', 'account-transfer')" class="btn btn-ghost">
          Отменить
        </label>
        <label @click="apply()" :disabled="inProgress" class="btn btn-success">
          Перевести
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import Error from "../objects/error";
import Account from "../objects/account";
import {actions} from "../../store";
import accounts from "../panels/accounts";

export default {
  name: "accountTransfer",
  components: {Account, Error},

  data() {
    return {
      amount: 0,
      fromId: 0,
      toId: 1,
      inProgress: false,
      error: ""
    }
  },

  computed: {
    accounts: function () {
      return this.$store.state.accounts;
    },

    tags: function () {
      return this.$store.state.tags;
    },
  },

  methods: {
    apply(){
      if (this.amount <= 0){
        this.error = "Неправильная сумма"
        return
      }

      const session = this.$cookies.get("auth_session");
      this.inProgress = true;

      actions.apiPostRequest("accounts/transfer?token=" + session, {from: this.accounts[this.fromId].id, to: this.accounts[this.toId].id, amount: this.amount}, this)
        .then(() => {
          actions.reloadAccounts(this, session, true)
          this.$store.commit('hideModal', 'account-transfer')
        })
        .catch((e) => {
          this.error = "Неизвестная ошибка!"
          console.log(e)
        })
        .finally(() => {
          this.inProgress = false
        })
    },

    hideDropdown(){
      this.$refs.focus.focus()
    },

    reverseAccounts(){
      const fid = this.fromId;
      this.fromId = this.toId;
      this.toId = fid;
    },
  }
}
</script>

<style scoped>

</style>
