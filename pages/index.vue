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
      :key="entry.name + entry.date + entry.comment.length"
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
      input: this.$route.query.search as string || ''
    }
  },
  computed: {
    entries(): Entry[] { return this.$store.state.entries.searchResults },
    lastFive(): Entry[] { return this.$store.state.entries.lastFive },
    isLoading(): boolean { return this.$store.state.isLoading }
  },
  methods: {
    handleInput() {
      if (this.queried !== this.input) {
        this.queried = this.input
        if (this.input.length >= 1) this.$store.dispatch('search', this.queried)
        if (this.input.length === 0) this.entries = []
        this.$router.replace({ query: { search: this.queried } })
      }
    },
    handleNewEntry(entry: Entry) {
      this.$store.commit('ADD_NEW_ENTRY', entry)
    }
  },
  mounted() {
    if (this.queried.length) this.$store.dispatch('search', this.queried)
    this.$store.dispatch('getLastFive')
  }
})
</script>

<style lang="sass" scoped>

</style>
