<template lang="pug">
  v-container
    v-row
      v-col(cols="12" sm="6")
        RefinedEntry(
          :entry=`{
            name: 'Меня запомнят',
            comment: 'это как?'
          }`
          edit
          remember
        )
      v-col(cols="12" sm="6")
        RefinedEntry(
          :entry=`{
            name: 'А меня сбросят',
            hero: 'alexstraza',
            comment: 'лошара'
          }`
          side="right"
          edit
        )
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: "test"
})
</script>

<style lang="sass" scoped>

</style>
