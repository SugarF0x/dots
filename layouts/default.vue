<template lang="pug">
  v-app#app(:style="{ backgroundImage: `url(${require('~/assets/img/background.jpg').src})`}")
    v-main
      v-img.d-block.mx-auto.mt-5(
        src="~/assets/img/logo.png"
        aspect-ratio="2.286"
        max-width="560"
      )
      nuxt
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Layout-Default'
})
</script>

<style lang="sass" scoped>
#app
  background-repeat: no-repeat
  background-position: center
  background-attachment: fixed
  background-size: cover
</style>
