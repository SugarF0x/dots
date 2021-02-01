<template lang="pug">
  v-card.pa-5.mb-5.entry(
    elevation="12"
  )
    v-row(no-gutters)
      v-col.left.flex-grow-0.mr-5
        HeroIcon(:hero="data ? data.hero : null")
        Rating(:rating="data ? data.rating : 0")
      v-col.right
        div.headline.title.mb-5 {{ data.name }}
        div.comment {{ data.comment }}
</template>

<script lang="ts">
import Vue from 'vue'
import { Entry } from "~/assets/consts"

export default Vue.extend({
  name: "Entry",
  props: {
    data: {
      type: Object as () => Entry
    }
  }
})
</script>

<style lang="sass" scoped>
.left
  min-width: 125px
</style>
