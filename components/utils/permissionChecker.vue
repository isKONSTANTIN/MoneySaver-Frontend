<template>

</template>

<script>
export default {
  name: "permissionChecker",

  props: {
    constants: {},
    sc: function () {},
    ec: function () {}
  },

  mounted() {
    var sc = this.sc === undefined ? function () {} : this.sc
    var ec = this.ec === undefined ? function () {} : this.ec

    try {
      navigator.getUserMedia(this.constants, sc, ec)
    }catch (e){
      console.log(e)
    }

  }
}
</script>

<style scoped>

</style>
