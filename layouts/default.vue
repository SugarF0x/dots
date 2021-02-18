<template lang="pug">
  v-app#app
    v-main
      v-img.d-block.mx-auto.mt-5(
        src="~/assets/img/logo.png"
        aspect-ratio="2.286"
        max-width="560"
        @click="$router.push('/')"
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
  background-image: url("~assets/img/background.jpg")
  background-repeat: no-repeat
  background-position: center
  background-attachment: fixed
  background-size: cover
</style>
