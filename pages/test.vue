<template lang="pug">
  v-container
    v-row
      v-col(cols="12" sm="6")
        RefinedEntry(
          :entry=`{
            date: new Date(),
            name: 'Меня запомнят',
            hero: 'ana',
            rating: 5,
            comment: 'это как?'
          }`
          edit
          remember
        )
      v-col(cols="12" sm="6")
        RefinedEntry(
          :entry=`{
            date: new Date(),
            name: 'А меня сбросят',
            hero: 'alexstraza',
            rating: 1,
            comment: 'лошара'
          }`
          side="right"
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
