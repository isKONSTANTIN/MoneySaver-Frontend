<template>
  <div class="panel flex justify-between">
    <div>
      {{this.name}}
    </div>
    <div>
      {{this.kind}}
    </div>
    <div>
      {{this.limit}}
    </div>
  </div>
</template>

<script>
export default {
  name: "listedTag",

  props: {
    tag: Object
  },

  data() {
    return {
      id: this.tag.id,
      name: this.tag.name,
      kind: this.tag.kind,
      limit: this.tag.limit,
    }
  },
}
</script>

<style scoped>

</style>
