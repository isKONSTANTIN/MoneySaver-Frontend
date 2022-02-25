<template>
  <div class="panel">

    <div class="flex justify-between">
      <h2 class="font-bold">Пользователи</h2>
      <div>
        <button class="btn btn-ghost btn-xs" @click="changePage(-1)"><</button>
        <button class="btn btn-ghost btn-xs" @click="changePage(1)">></button>
      </div>

    </div>
    <hr class="my-4">

    <div class="overflow-x-auto">
      <table class="table w-full table-compact table-zebra">
        <thead>
        <tr>
          <th>Email</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in users">
          <th>{{user.email}}</th>
          <td>
            <div class="flex justify-end">
              <button class="btn btn-ghost btn-xs" @click="$store.commit('showModal', {'name': 'admin-notify-user', data: user})">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              <button class="btn btn-ghost btn-xs" @click="$store.commit('showModal', {'name': 'admin-password-changer', data: user})">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "userListPanel",

  mounted() {
    this.loadUsers(1)
  },

  data() {
    return {
      users: {},
      page: 1
    }
  },

  computed: {
    accounts: function () {
      return this.$store.state.accounts;
    },
  },

  methods: {
    changePageG(page){
      this.page = page;
      this.loadUsers(this.page);
    },

    changePage(delta){
      if (this.page + delta === 0)
        return

      this.page += delta;
      this.loadUsers(this.page);
    },

    loadUsers(page){
      const session = this.$cookies.get("auth_session");

      fetch(this.$axios.defaults.baseURL + "api/admin/getUsers?token=" + session + "&count=25" + "&offset=" + ((page - 1) * 25))
        .then(response => response.json())
        .then(result => {
          this.users = result
        })
    }
  },
}
</script>

<style scoped>

</style>
