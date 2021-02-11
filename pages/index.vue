<template lang="pug">
  v-container
    v-text-field(
      v-model="input"
      :loading="isLoading"
      v-on:change="handleInput"
      placeholder="Введите имя дебила"
    )
    NewEntry(
      v-if="$auth.loggedIn && queried.length"
      :key="queried"
      :name="queried"
      @created="handleNewEntry"
    )
    Entry(
      v-for="entry in entries"
      :key="entry.name + entry.comment.length"
      :data="entry"
      :name="entry.name"
    )
    div(v-if="!entries.length && !queried.length")
      div.headline.text-center.mb-5 Последние пять дебилов
      Entry(
        v-for="entry in lastFive"
        :key="'last' + entry.name + entry.comment.length"
        :data="entry"
        :name="entry.name"
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
      queried: this.$route.query.search as string || '',
      input: this.$route.query.search as string || '',
      isLoading: false,
      entries: [] as Entry[],
      lastFive: [] as Entry[]
    }
  },
  methods: {
    handleInput() {
      if (this.queried !== this.input) {
        this.queried = this.input
        if (this.input.length >= 1) this.search()
        if (this.input.length === 0) this.entries = []
        this.$router.replace({ query: { search: this.queried } })
      }
    },
    handleNewEntry(entry: Entry) {
      this.entries.push(entry)
      this.lastFive.pop()
      this.lastFive.unshift(entry)
    },
    async search() {
      this.isLoading = true

      const response = await this.$axios.$get('/db/search', { params: { name: this.queried } }) as Entry[]

      this.isLoading = false
      this.entries = response.sort((a,b) => {
        return a.date.valueOf() - b.date.valueOf()
      })
    },
    async getLastFive() {
      this.isLoading = true

      const response = await this.$axios.$get('/db/getLastFive') as Entry[]

      this.isLoading = false
      this.lastFive = response.sort((a,b) => {
        return a.date.valueOf() - b.date.valueOf()
      })
    }
  },
  mounted() {
    if (this.queried.length) this.search()
    this.getLastFive()
  }
})
</script>

<style lang="sass" scoped>

</style>
