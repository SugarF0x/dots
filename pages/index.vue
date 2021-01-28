<template lang="pug">
  v-container
    v-text-field(
      v-model="input"
      :loading="isLoading"
      v-on:change="handleInput"
    )
</template>

<script lang="ts">
import Vue from 'vue'
import { HERO_NAMES } from "~/assets/consts"

interface Entry {
  date: Date
  name: string
  hero: typeof HERO_NAMES[number]
  rating: number
  comment: string
}

export default Vue.extend({
  name: 'home',
  data() {
    return {
      HERO_NAMES,
      input: '',
      isLoading: false,
      entries: [] as Entry[]
    }
  },
  methods: {
    handleInput() {
      if (this.input.length >= 1) this.search()
    },
    search() {
      this.isLoading = true

      let dummyData = require('~/assets/dummy.json') as Entry[]
      let response = dummyData.filter(entry => entry.name.includes(this.input))

      setTimeout(() => {
        this.isLoading = false
        this.entries = response
      }, 2500)
    }
  }
})
</script>

<style lang="sass" scoped>

</style>
