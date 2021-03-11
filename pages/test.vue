<template lang="pug">
  v-container
    RefinedEntry(
      edit
    )
</template>

<script lang="ts">
import Vue from 'vue'
import RefinedEntry from "~/components/RefinedEntry.vue"

export default Vue.extend({
  name: "test",
  components: {
    RefinedEntry
  }
})
</script>

<style lang="sass" scoped>

</style>
