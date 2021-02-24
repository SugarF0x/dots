<template lang="pug">
  v-app#app
    v-main#main
      v-img#dots-img.d-block.mx-auto.mt-5(
        src="~/assets/img/logo.png"
        aspect-ratio="2.286"
        max-width="560"
        @click="goHome"
      )
        v-chip#splash.headline(
          v-if="count"
          color="#121c4c"
        ) {{ count }}
      nuxt#nuxt
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Layout-Default',
  computed: {
    count() { return this.$store.state.entries.total }
  },
  methods: {
    goHome() {
      if (this.$route.path !== '/' || Object.keys(this.$route.query).length) {
        this.$router.push('/')
        this.$store.commit('DUMP_QUERY')
        this.$store.commit('DUMP_SEARCH_RESULTS')
      }
    }
  },
  mounted() {
    this.$store.dispatch('getTotalEntries')
  }
})
</script>

<style lang="sass" scoped>
#app
  background-image: url("~assets/img/background.jpg")
  background-repeat: no-repeat
  background-position: center
  background-attachment: fixed
  background-size: cover

#dots-img
  position: relative
  cursor: pointer
#splash
  position: absolute
  top: 3rem
  right: 1rem
  animation: splash 3s ease-in-out infinite

@keyframes splash
  0%
    transform: scale(1) rotate(10deg)
  50%
    transform: scale(1.2) rotate(10deg)
  100%
    transform: scale(1) rotate(10deg)
</style>
