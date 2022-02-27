<template>
  <div class="card min-w-max" :class="{ 'bg-plan-p': plan.delta > 0, 'bg-plan-n': plan.delta <= 0 }">
    <div class="card-body p-5">
      <div class="flex justify-between w-full">
        <p class="text-lg font-bold">
          {{new Intl.NumberFormat().format(plan.delta)}} ₽
        </p>
        <p class="text-xs ml-2"> {{getTagName(plan.tag)}}</p>
      </div>
      <hr>

      <p>
        {{getDate(plan.date.seconds)}}, {{getAccountName(plan.account)}}
      </p>
      <p class="text-xs">{{plan.description}}</p>
      <div class="flex justify-end buttons mt-auto">
        <button @click="completePlan" class="btn btn-ghost p-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>

        <button @click="failPlan" class="btn btn-ghost p-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <button @click="$store.commit('showModal', {name: 'plan-editor', data: plan})" class="btn btn-ghost p-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {actions} from "~/store";

export default {
  name: "plan",

  props: {
    plan: Object
  },

  computed: {
    tagsMap: function () {
      return this.$store.state.tagsMap;
    },

    accountsMap: function () {
      return this.$store.state.accountsMap;
    },
  },

  methods: {
    getDate(unix){
      var date = new Date(unix * 1000);

      return date.getDate().toString().padStart(2, '0') + "." + (date.getMonth() + 1).toString().padStart(2, '0') + "." + date.getFullYear();
    },

    getTagName(id){
      var tag = this.tagsMap[id];

      if (tag === undefined)
        return ""

      return tag.name;
    },

    getAccountName(id){
      var account = this.accountsMap[id];

      if (account === undefined)
        return ""

      return account.name;
    },

    completePlan(){
      const session = this.$cookies.get("auth_session");

      actions.apiPostRequest("plans/complete?token=" + session, {id: this.plan.id}, this)
        .then(() => {
          actions.preloadData(this, session, true)
        })
    },

    failPlan(){
      const session = this.$cookies.get("auth_session");

      actions.apiPostRequest("plans/fail?token=" + session, {id: this.plan.id}, this)
        .then(() => {
          actions.reloadPlans(this, session)
        })
    }
  }
}
</script>

<style scoped>
.card-body{
  @apply p-3;
}

.bg-plan-p {
  @apply alert-success;
}

.bg-plan-n {
  @apply alert-error;
}

.buttons .btn {
  @apply min-h-0;
  height: fit-content;
}
</style>
