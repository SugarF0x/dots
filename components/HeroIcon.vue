<template lang="pug">
  v-img.icon(
    :src='require(`~/assets/img/heroes/${heroName}.png`)'
    aspect-ratio='1'
    max-width="125"
    max-height="125"
  )
</template>

<script lang="ts">
import Vue from 'vue'
import { HERO_NAMES } from "~/assets/consts"

export default Vue.extend({
  name: "HeroIcon",
  props: {
    hero: {
      type: String,
      default: 'random'
    }
  },
  computed: {
    heroName(): typeof HERO_NAMES[number] {
      if (this.hero == null) return 'random'

      let hero = this.hero.toLowerCase() as typeof HERO_NAMES[number]
      if (HERO_NAMES.includes(hero)) {
        return hero
      } else {
        console.error(new Error(`No hero ${hero} found - replacing with Random`))
        return 'random'
      }
    }
  }
})
</script>

<style lang="sass" scoped>
.icon
  position: relative
  border-radius: 50%
  background-color: #141f52
.icon:after
  content: ''
  width: 100%
  height: 100%
  border-radius: 50%
  position: absolute
  top: 0
  border: 2px solid rgba(51,153,255,.4)
</style>
