<template lang="pug">
  v-container
    v-text-field
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
