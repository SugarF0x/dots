<template lang="pug">
  v-card.pa-5.mb-5(
    color="#121c4c"
    elevation="12"
  )
    v-row(no-gutters)
      v-col.left.flex-grow-0.mr-5
        HeroIcon(
          :hero="data ? data.hero : null"
          :readonly="!isNew"
        )
        Rating(
          :rating="data ? data.rating : 0"
          :readonly="!isNew"
        )
        v-btn.mt-3(
          v-if="isNew"
          color="primary"
        ) Отправить
      v-col(v-if="!isNew")
        div.headline {{ data.name }}
        div {{ data.comment }}
      v-col(v-else)
        v-text-field.headline(v-model="newData.name")
        v-textarea
</template>

<script lang="ts">
import Vue from 'vue'
import { Entry } from "~/assets/consts"

export default Vue.extend({
  name: "Entry",
  props: {
    data: {
      type: Object as () => Entry
    },
    isNew: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      newData: {
        date: new Date(),
        hero: '',
        rating: 0,
        name: this.name,
        comment: ''
      }
    }
  }
})
</script>

<style lang="sass" scoped>
.left
  min-width: 125px
</style>
