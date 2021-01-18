<template lang="pug">
  v-app(:style="{ background: `url(${require('~/assets/img/background.jpg').src}) no-repeat center`, backgroundSize: 'cover' }")
    v-main
      nuxt
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Layout-Default'
})
</script>

<style lang="sass" scoped>

</style>
