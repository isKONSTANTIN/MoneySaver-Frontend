<template>
  <div class="modal">
    <div class="modal-box">
      <h2 class="font-bold mb-1">Добавить тег</h2>
      <hr class="mb-4">

      <div class="form-control">
        <label class="label">
          <span class="label-text">Название</span>
        </label>
        <input type="text" v-model="name" placeholder="" class="input input-bordered">

        <label class="label">
          <span class="label-text">Тип</span>
        </label>
        <select v-model="kind" class="select select-bordered w-full">
          <option>Доходы</option>
          <option>Расходы</option>
          <option>Совместный</option>
        </select>

        <label class="label">
          <span class="label-text">Рублей в месяц</span>
        </label>
        <input type="number" v-model="limit" placeholder="" class="input input-bordered">

        <error class="mt-2" :text="error"></error>

        <div class="modal-action">
          <label @click="$store.commit('hideModal', 'new-tag')" class="btn btn-ghost">
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
  name: "newTag",
  components: {Error},
  data() {
    return {
      name: "",
      kind: "",
      limit: 0,
      inProgress: false,

      error: ""
    }
  },

  methods: {
    apply(){
      const session = this.$cookies.get("auth_session");

      if (this.name === ""){
        this.error = "Имя не должно быть пустое!"
        return
      }

      var kind = this.kind === "Доходы" ? 1 : (this.kind === "Расходы" ? -1 : 0)

      this.inProgress = true;
      actions.apiPostRequest("tags/add?token=" + session, {name: this.name, kind: kind, limit: this.limit}, this)
        .then(() => {
          actions.preloadData(this, session, true)
          this.$store.commit('hideModal', 'new-tag')
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
