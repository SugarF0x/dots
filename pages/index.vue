<template lang="pug">
  v-container
    v-text-field(
      v-model="input"
      :loading="isLoading"
      v-on:change="handleInput"
    )
    Entry(
      v-for="entry in entries"
      :key="entry.name + entry.comment.length"
      :data="entry"
    )
</template>

<script lang="ts">
import Vue from 'vue'
import { HERO_NAMES, Entry } from "~/assets/consts"

export default Vue.extend({
  name: 'home',
  data() {
    return {
      HERO_NAMES,
      queried: '',
      input: '',
      isLoading: false,
      entries: [] as Entry[]
    }
  },
  methods: {
    handleInput() {
      if (this.queried !== this.input) {
        this.queried = this.input
        if (this.input.length >= 1) this.search()
      }
    },
    search() {
      this.isLoading = true

      let dummyData = require('~/assets/dummy.json') as Entry[]
      let response = dummyData.filter(entry => entry.name.includes(this.input))

      setTimeout(() => {
        this.isLoading = false
        this.entries = response
      }, 500)
    }
  }
})
</script>

<style lang="sass" scoped>

</style>
