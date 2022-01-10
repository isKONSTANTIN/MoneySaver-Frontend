<template>
  <div class="modal">
    <div class="modal-box">
      <h2 class="font-bold mb-1">Добавить повтор. транзакцию</h2>
      <hr class="mb-4">

      <div class="form-control">
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="label">
              <span class="label-text">Сумма</span>
            </label>
            <input type="number" v-model="delta" class="input input-bordered w-full">
          </div>

          <div>
            <label class="label">
              <span class="label-text">Счет</span>
            </label>
            <select v-model="account" class="select select-bordered w-full">
              <option v-for="account in accounts">{{account.name}}</option>
            </select>
          </div>
        </div>

        <label class="label">
          <span class="label-text">Тег</span>
        </label>
        <select v-model="tag" class="select select-bordered w-full">
          <option v-for="tag in tags">{{tag.name}}</option>
        </select>

        <div class="grid grid-cols-4 lg:grid-cols-5 gap-2">
          <div class="col-span-4 lg:col-span-2">
            <label class="label">
              <span class="label-text">Дата начала повтора</span>
            </label>
            <input type="date" class="input input-bordered w-full" v-model="startRepeat">
          </div>
          <div class="col-span-2 lg:col-span-2">
            <label class="label">
              <span class="label-text">Тип повтора</span>
            </label>
            <select v-model="repeatFunc" class="select select-bordered w-full">
              <option>Еженедельно</option>
              <option>Ежемесячно</option>
              <option>Каждые N дней</option>
            </select>
          </div>

          <div class="col-span-2 lg:col-span-1">
            <div v-if="repeatFunc === 'Еженедельно'">
              <label class="label">
                <span class="label-text">День</span>
              </label>
              <select v-model="repeatArg" class="select select-bordered w-full">
                <option>ПН</option>
                <option>ВТ</option>
                <option>СР</option>
                <option>ЧТ</option>
                <option>ПТ</option>
                <option>СБ</option>
                <option>ВС</option>
              </select>
            </div>
            <div v-else>
              <label class="label">
                <span class="label-text">{{repeatFunc === 'Ежемесячно' ? 'День' : 'Через'}}</span>
              </label>
              <input type="number" v-model="repeatArg" class="input input-bordered w-full">
            </div>
          </div>
        </div>

        <label class="label">
          <span class="label-text">Описание</span>
        </label>
        <input type="text" v-model="description" class="input input-bordered w-full">
      </div>

      <div class="modal-action">
        <label @click="$store.commit('hideModal', 'new-repeat-transaction')" class="btn btn-ghost">
          Отменить
        </label>
        <label @click="apply()" class="btn btn-success">
          Создать
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import {actions} from "../../store";

export default {
  name: "newRepeatTransaction",

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
      startRepeat: new Date().toISOString().substr(0, 10),
      repeatFunc: "Еженедельно",
      repeatArg: "",
      account: "",
      description: ""
    }
  },

  methods: {
    apply(){
      var days = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"]
      var delta = this.delta;

      var tag = this.tags.find(t => t.name === this.tag)
      var account = this.accounts.find(a => a.name === this.account)
      var repeatFunc = this.repeatFunc === "Еженедельно" ? 0 : (this.repeatFunc === "Ежемесячно" ? 1 : 2)
      var repeatArg = repeatFunc === 0 ? days.findIndex(s => s === this.repeatArg) + 1 : parseInt(this.repeatArg)

      if (tag === undefined || account === undefined || delta === 0 || repeatArg < 1 || isNaN(repeatArg))
        return;

      if (tag.kind !== 0)
        delta *= tag.kind;

      var startRepeat = new Date(this.startRepeat).getTime() / 1000 + 60 * 60 * 9;

      if (isNaN(startRepeat))
        startRepeat = new Date().getTime() / 1000;

      const session = this.$cookies.get("auth_session");

      actions.apiPostRequest("transactions/repeat/add?token=" + session, {delta: delta, tag: tag.id, account: account.id, repeatArg: repeatArg, startRepeat: parseInt(startRepeat), repeatFunc: repeatFunc, description: this.description}, this.$axios.defaults.baseURL)
        .then(() => {
          actions.preloadData(this, session)
          this.$store.commit('hideModal', 'new-repeat-transaction')
        })
    }
  }
}
</script>

<style scoped>

</style>
