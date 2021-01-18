<template lang="pug">
  div
    HeroIcon.ma-5.d-inline-block(
      style="min-width: 125px"
      v-for="hero in HERO_NAMES"
      :key="hero"
      :hero="hero"
    )
</template>

<script lang="ts">
import Vue from 'vue'
import { HERO_NAMES } from "~/assets/consts"

export default Vue.extend({
  name: 'home',
  data() {
    return {
      HERO_NAMES
    }
  }
})
</script>

<style lang="sass" scoped>

</style>
