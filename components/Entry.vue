<template lang="pug">
  v-card.pa-5.mb-5(
    color="#121c4c"
    elevation="12"
  )
    v-row(no-gutters)
      v-col.left.flex-grow-0.mr-5
        HeroIcon(:hero="data.hero")
        Rating(:rating="data.rating")
      v-col
        div.headline {{ data.name }}
        div {{ data.comment }}
</template>

<script lang="ts">
import Vue from 'vue'
import { Entry } from "~/assets/consts"

export default Vue.extend({
  name: "Entry",
  props: {
    data: {
      type: Object as () => Entry,
      required: true
    }
  }
})
</script>

<style lang="sass" scoped>
.left
  min-width: 125px
</style>
