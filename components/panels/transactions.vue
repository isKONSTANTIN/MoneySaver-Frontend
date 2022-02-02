<template>
<div class="panel">
  <h2 class="font-bold">Последние транзакции:</h2>
  <hr class="my-4">

  <div class="overflow-x-auto">
    <table class="table w-full table-compact table-zebra">
      <thead>
      <tr>
        <th>Сумма</th>
        <th>Тег</th>
        <th>Дата</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="transaction in transactions">
        <th>{{new Intl.NumberFormat().format(transaction.delta)}}</th>
        <td>
          <div :data-tip="transaction.description" class="tooltip z-10">
            {{getTagName(transaction.tag)}}
          </div>
        </td>
        <td>{{getDate(transaction.date.seconds)}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script>

export default {
  name: "transactions",

  computed: {
    transactions: function () {
      return this.$store.state.shortTransactions;
    },

    tagsMap: function () {
      return this.$store.state.tagsMap;
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
    }
  }
}
</script>

<style scoped>

</style>
