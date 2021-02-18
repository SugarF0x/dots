<template lang="pug">
  v-app#app
    v-main#main
      v-img#dots-img.d-block.mx-auto.mt-5(
        src="~/assets/img/logo.png"
        aspect-ratio="2.286"
        max-width="560"
        @click="$router.push('/')"
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
  data() {
    return {
      count: 0
    }
  },
  methods: {
    async getCount(): Promise<number> {
      const response = await this.$axios.$get('/db/getCount') as { result: number, message: number }
      if (response.result) {
        return response.message
      } else {
        return 0
      }
    }
  },
  async mounted() {
    this.count = await this.getCount()
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
