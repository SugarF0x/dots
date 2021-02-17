<template lang="pug">
  v-card.pa-5.mb-5.entry(
    elevation="12"
  )
    v-row(
      v-if="size === 'small'"
      no-gutters
    )
      v-col(cols="4").mr-5
        HeroIcon(:hero="data ? data.hero : null")
      v-spacer
      v-col(cols="7")
        div.headline.title.text-center {{ data.name }}
        Rating(:rating="data ? data.rating : 0")
        div.text-center.mt-2 {{ new Date(data.date).toLocaleDateString() }}
      v-col(cols="12")
        div.comment.mt-2 {{ data.comment }}

    v-row(
      v-else
      no-gutters
    )
      v-col.left.flex-grow-0.mr-5
        HeroIcon(:hero="data ? data.hero : null")
        Rating(:rating="data ? data.rating : 0")
      v-col.right
        div.headline.mb-5.d-flex
          div.title.flex-grow-1 {{ data.name }}
          div.text-center.ml-5.flex-grow-0.my-auto {{ new Date(data.date).toLocaleDateString() }}
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
  },
  computed: {
    size() {
      // @ts-ignore - types are not yet supported by vuetify
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 'small'
        default:
          return 'large'
      }
    }
  }
})
</script>

<style lang="sass" scoped>
.left
  min-width: 125px
</style>
