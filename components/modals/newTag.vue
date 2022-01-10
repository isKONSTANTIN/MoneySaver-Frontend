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
          <span class="label-text">Лимит</span>
        </label>
        <input type="number" v-model="limit" placeholder="" class="input input-bordered">

        <div class="modal-action">
          <label @click="$store.commit('hideModal', 'new-tag')" class="btn btn-ghost">
            Отменить
          </label>
          <label @click="apply()" class="btn btn-success">
            Создать
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {actions} from "../../store";

export default {
  name: "newTag",

  data() {
    return {
      name: "",
      kind: "",
      limit: 0
    }
  },

  methods: {
    apply(){
      const session = this.$cookies.get("auth_session");

      if (this.name === "")
        return

      var kind = this.kind === "Доходы" ? 1 : (this.kind === "Расходы" ? -1 : 0)

      actions.apiPostRequest("tags/add?token=" + session, {name: this.name, kind: kind, limit: this.limit}, this.$axios.defaults.baseURL)
        .then(() => {
          actions.preloadData(this, session)
          this.$store.commit('hideModal', 'new-tag')
        })
    }
  }
}
</script>

<style scoped>

</style>
