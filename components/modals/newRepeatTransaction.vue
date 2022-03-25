<template>
  <div class="modal">
    <div class="modal-box">
      <h2 class="font-bold mb-1">Добавить повтор. транзакцию</h2>
      <hr class="mb-4">

      <div class="form-control">
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="label">
              <span class="label-text">{{(tag === undefined || tag.kind === 0) ? "Сумма" : (tag.kind === -1 ? "Расход" : "Доход")}}</span>
            </label>
            <input v-model="delta" v-bind:class="{'border-red-400': tag !== undefined && tag.kind === -1, 'border-green-400': tag !== undefined && tag.kind === 1}" class="input input-bordered w-full">

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
        <select v-model="tagName" class="select select-bordered w-full">
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

      <error class="mt-2" :text="error"></error>

      <div class="modal-action">
        <label @click="$store.commit('hideModal', 'new-repeat-transaction')" class="btn btn-ghost">
          Отменить
        </label>
        <label @click="apply()" :disabled="inProgress" class="btn btn-success">
          Создать
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import {actions} from "../../store";
import Error from "../objects/error";

export default {
  name: "newRepeatTransaction",
  components: {Error},
  computed: {
    accounts: function (){
      return this.$store.state.accounts;
    },

    tags: function (){
      return this.$store.state.tags;
    },

    tag: function () {
      return this.tags.find(t => t.name === this.tagName)
    }
  },

  data() {
    return {
      delta: 0,
      tagName: "",
      startRepeat: new Date().toISOString().substr(0, 10),
      repeatFunc: "Еженедельно",
      repeatArg: "",
      account: "",
      description: "",
      inProgress: false,

      error: ""
    }
  },

  created() {
    this.$store.commit("setModalShowEvent", {name: 'new-repeat-transaction', func: () => {
        this.account = Object.values(this.accounts)[0].name;
      }
    })
  },

  methods: {
    apply(){
      var days = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"]
      var delta = this.delta;

      var account = this.accounts.find(a => a.name === this.account)
      var repeatFunc = this.repeatFunc === "Еженедельно" ? 0 : (this.repeatFunc === "Ежемесячно" ? 1 : 2)
      var repeatArg = repeatFunc === 0 ? days.findIndex(s => s === this.repeatArg) + 1 : parseInt(this.repeatArg)

      if (this.tag === undefined){
        this.error = "Тег не найден!"
        return;
      }

      if (account === undefined){
        this.error = "Счет не найден!"
        return;
      }

      if (delta === 0){
        this.error = "Сумма не должна быть нулевая!"
        return;
      }

      if (repeatArg < 1 || isNaN(repeatArg)){
        this.error = "Неправильный аргумент типа повтора"
        return;
      }

      if (this.tag.kind !== 0)
        delta *= this.tag.kind;

      var startRepeat = new Date(this.startRepeat).getTime() / 1000 + 60 * 60 * 9;

      if (isNaN(startRepeat))
        startRepeat = new Date().getTime() / 1000;

      const session = this.$cookies.get("auth_session");

      this.inProgress = true
      actions.apiPostRequest("transactions/repeat/add?token=" + session, {delta: delta, tag: this.tag.id, account: account.id, repeatArg: repeatArg, startRepeat: parseInt(startRepeat), repeatFunc: repeatFunc, description: this.description}, this)
        .then(() => {
          actions.preloadData(this, session, true)
          this.$store.commit('hideModal', 'new-repeat-transaction')
        })
        .catch((e) => {
          this.error = "Неизвестная ошибка!"
          console.log(e)
        })
        .finally(() => {
          this.inProgress = false
      })
    }
  }
}
</script>

<style scoped>

</style>
