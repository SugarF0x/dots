<template lang="pug">
  v-container
    v-text-field(
      v-model="input"
      :loading="isLoading"
      v-on:change="handleInput"
      placeholder="Введите имя дебила"
      append-icon="mdi-image"
      @click:append="$router.push('/screenshot')"
    )
    NewEntry(
      v-if="$auth.loggedIn && query.length"
      :key="query"
      :name="query"
      @created="handleNewEntry"
    )
    Entry(
      v-for="entry in entries"
      :key="entry.name + entry.date + entry.comment.length"
      :data="entry"
      :name="entry.name"
    )
    div(v-if="!entries.length && !query.length")
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
      input: this.$route.query.search as string || ''
    }
  },
  computed: {
    entries(): Entry[] { return this.$store.state.entries.searchResults },
    lastFive(): Entry[] { return this.$store.state.entries.lastFive },
    isLoading(): boolean { return this.$store.getters.isLoading },
    query(): string { return this.$store.state.query }
  },
  methods: {
    handleInput() {
      if (this.query !== this.input) {
        this.$store.commit('SET_QUERY', this.input)
        if (this.input.length >= 1) this.$store.dispatch('search')
        if (this.input.length === 0) this.$store.commit('DUMP_SEARCH_RESULTS')
        this.$router.push({ query: { search: this.query } })
      }
    },
    handleNewEntry(entry: Entry) {
      this.$store.commit('ADD_NEW_ENTRY', entry)
    }
  },
  mounted() {
    if (this.input.length) {
      this.$store.commit('SET_QUERY', this.input)
      this.$store.dispatch('search')
    }
    this.$store.dispatch('getLastFive')
  }
})
</script>

<style lang="sass" scoped>

</style>
