<template lang="pug">
  div(style="position: relative")
    v-img.icon(
      :src='require(`~/assets/img/heroes/${heroName}.png?preload`)'
      aspect-ratio='1'
      max-width="125"
      max-height="125"
    )
    div(v-if="edit")
      v-btn.add.absolute(
        v-if="!drawer"
        icon
        @click="openDrawer"
      ) +
      div.absolute.fill-height.d-flex.align-center.justify-center(v-else)
        v-card
          v-autocomplete(
            :items="HERO_NAMES"
            ref="heroSelectField"
            @change="selectHero"
            @blur="closeDrawer"
          )
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { HERO_NAMES } from "~/assets/consts"

export default Vue.extend({
  name: "HeroIcon",
  props: {
    hero: {
      type: String as PropType<typeof HERO_NAMES[number]>,
      default: 'random'
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      HERO_NAMES,
      drawer: false,
      selectedHero: this.hero
    }
  },
  computed: {
    heroName(): typeof HERO_NAMES[number] {
      let hero = this.selectedHero?.toLowerCase() as typeof HERO_NAMES[number]
      if (hero) {
        if (HERO_NAMES.includes(hero)) {
          return hero
        } else {
          console.error(new Error(`No hero ${hero} found - replacing with Random`))
        }
      }
      return 'random'
    }
  },
  methods: {
    openDrawer() {
      this.drawer = true
      this.$nextTick(() => {
        // @ts-ignore, comment: this is a ref, so it is there
        this.$refs.heroSelectField.onClick(this.$refs.heroSelectField)
      })
    },
    closeDrawer() {
      this.drawer = false
    },
    selectHero(hero: typeof HERO_NAMES[number]) {
      if (HERO_NAMES.includes(hero)) {
        this.selectedHero = hero
        this.$emit('selected', hero)
      }
      this.drawer = false
    },
  }
})
</script>

<style lang="sass" scoped>
.absolute
  position: absolute
  left: 0
  top: 0
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
.add
  width: 100%
  height: 100%
  font-size: 10rem
  color: #141f52 !important
  opacity: .25
  -webkit-text-stroke: 1px rgb(51,153,255)
.add:hover
  opacity: .75
  box-shadow: 0 0 15px 0 rgba(51, 153, 255, 0.75)
</style>
