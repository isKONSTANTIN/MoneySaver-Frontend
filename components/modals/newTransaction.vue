<template>
  <div class="modal">
    <div class="modal-box">
      <h2 class="font-bold mb-1">Добавить транзакцию</h2>
      <hr class="mb-4">

      <div class="form-control">
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="label">
              <span class="label-text">Сумма</span>
            </label>
            <input v-model="delta" @change="calculateDelta" class="input input-bordered w-full">

            <label class="label">
              <span class="label-text">Тег</span>
            </label>
            <select v-model="tag" class="select select-bordered w-full">
              <option v-for="tag in tags">{{tag.name}}</option>
            </select>
          </div>

          <div>
            <label class="label">
              <span class="label-text">Дата</span>
            </label>
            <input type="date" class="input input-bordered w-full" v-model="date">

            <label class="label">
              <span class="label-text">Счет</span>
            </label>
            <select v-model="account" class="select select-bordered w-full">
              <option v-for="account in accounts">{{account.name}}</option>
            </select>
          </div>
        </div>

        <label class="label">
          <span class="label-text">Описание</span>
        </label>
        <input type="text" v-model="description" class="input input-bordered w-full">
      </div>

      <error class="mt-2" :text="error"></error>

      <div class="mt-6 flex justify-between w-full">
        <button :disabled="inProgress" @click="fromQR()" class="btn" :class="{'btn-error': qrCodeError, 'btn-ghost': !qrCodeError}">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </button>
        <div>
          <label @click="$store.commit('hideModal', 'new-transaction')" class="btn btn-ghost">
            Отменить
          </label>
          <label @click="apply()" :disabled="inProgress" class="btn btn-success">
            Создать
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {actions} from "../../store";
import Error from "../objects/error";

export default {
  name: "newTransaction",
  components: {Error},
  computed: {
    accounts: function (){
      return this.$store.state.accounts;
    },

    tags: function (){
      return this.$store.state.tags;
    },
  },

  data() {
    return {
      delta: 0,
      tag: "",
      date: new Date().toISOString().substr(0, 10),
      account: "",
      description: "",
      qrCodeError: false,

      inProgress: false,
      error: ""
    }
  },

  methods: {
    calculateDelta(){
      var newDelta = NaN

      try{
        newDelta = parseFloat(eval(this.delta.replace(",", '.').replace(/[^-()\d/*+.]/g, '')));
      }catch {

      }

      if (!isNaN(newDelta))
        this.delta = newDelta
    },

    apply(){
      var delta = this.delta

      var tag = this.tags.find(t => t.name === this.tag)
      var account = this.accounts.find(a => a.name === this.account)

      if (tag === undefined){
        this.error = "Тег не найден!"
        return;
      }

      if (account === undefined){
        this.error = "Счет не найден!"
        return;
      }

      if (delta === 0 || isNaN(delta) || !isFinite(delta) || Math.abs(delta) > 2147483647){
        this.error = "Сумма должна быть корректной!"
        return;
      }

      if (tag.kind !== 0)
        delta *= tag.kind;

      var time = new Date(this.date).getTime() / 1000 + 60 * 60 * 9;

      if (isNaN(time))
        time = new Date().getTime() / 1000;

      const session = this.$cookies.get("auth_session");
      this.inProgress = true;

      actions.apiPostRequest("transactions/add?token=" + session, {delta: delta, tag: tag.id, date: parseInt(time), account: account.id, description: this.description}, this)
        .then(() => {
          actions.preloadData(this, session, true)
          this.$store.commit('hideModal', 'new-transaction')
        })
        .catch((e) => {
          this.error = "Неизвестная ошибка!"
          console.log(e)
        })
        .finally(() => {
          this.inProgress = false
      })
    },

    fromQR(){
      if (this.$store.state.user.receiptToken === ""){
        this.$store.commit('showModal', {name: 'receipt-token-setter'})
        return
      }

      this.$store.commit('showModal',
        {
          name: 'qr-scanner',
          data: {
            resultFunc: (d) => {
              const session = this.$cookies.get("auth_session");
              this.$axios.get("/receipt/check?token=" + session + "&args=" + btoa(d))
                .then(response => response.data)
                .then(result => {
                    if (result.code === 1){
                      var data = result.data.json
                      this.delta = data.totalSum / 100.0
                      this.date = new Date(data.dateTime).toISOString().substr(0, 10)
                      this.account = this.accounts[0].name
                      this.description = data.user
                      this.qrCodeError = false
                    }else {
                      this.qrCodeError = true;
                    }

                  }
                ).catch(e => {})
            }
          }
        })

    }
  }
}
</script>

<style scoped>

</style>
