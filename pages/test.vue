<template lang="pug">
  v-container
    RefinedEntry(
      :entry=`{
        date: new Date(),
        name: 'The Stuped of ass shit gay',
        hero: null,
        rating: 1,
        comment: 'piss'
      }`
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
