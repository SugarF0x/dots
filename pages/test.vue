<template lang="pug">
  v-container
    v-row
      v-col(cols="12" sm="6")
        RefinedEntry(
          :entry=`{
            date: new Date(),
            name: 'А я слева',
            hero: 'ana',
            rating: 5,
            comment: 'круто'
          }`
          edit
        )
      v-col(cols="12" sm="6")
        RefinedEntry(
          :entry=`{
            date: new Date(),
            name: 'Я справа',
            hero: 'alexstraza',
            rating: 5,
            comment: 'заебись'
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
