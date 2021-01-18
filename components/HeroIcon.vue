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
      type: String as () => typeof HERO_NAMES[number],
      required: true
    }
  },
  computed: {
    heroName(): typeof HERO_NAMES[number] {
      if (HERO_NAMES.includes(this.hero)) {
        return this.hero
      } else {
        console.error(new Error(`No hero ${this.hero} found - replacing with Abathur`))
        return 'abathur'
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
  border: 2px solid rgba(51,153,255,.4)
</style>
