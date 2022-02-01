<template>
  <div class="panel">

    <div class="flex items-center h-full">
      <div class="avatar">
        <div class="p-3 mask mask-hexagon bg-neutral-focus text-neutral-content flex justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 m-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>

      <div class="font-extrabold text-lg ml-2">
        {{userMail}}
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "userPanel",

  computed: {
    userMail: function (){
      return this.$store.state.user.email;
    },
  },
}
</script>

<style scoped>

</style>
