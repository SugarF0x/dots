<template lang="pug">
  v-card.pa-5.mb-5(
    color="#121c4c"
    elevation="12"
  )
    v-row(no-gutters)
      v-col.left.flex-grow-0.mr-5.fill-height
        HeroIcon(:hero="form.hero")
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
                @blur="cancelSelect"
              )
        Rating(
          :readonly="false"
          @selected="selectRating"
        )
        v-spacer
        v-btn.mt-3(
          color="primary"
          :disabled="!canSubmit"
          @click="submit"
        ) Отправить
      v-col
        v-text-field.headline(v-model="form.name")
        v-textarea(v-model="form.comment")
</template>

<script lang="ts">
import Vue from 'vue'
import { HERO_NAMES } from '~/assets/consts'

// TODO: replace auto-complete options with russian counterparts that are to be processed into their english origin before passing to HeroIcon

export default Vue.extend({
  name: "NewEntry",
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      HERO_NAMES,
      drawer: false,
      form: {
        rating: 0,
        comment: '',
        name: this.name,
        hero: 'random'
      }
    }
  },
  computed: {
    canSubmit() { return this.form.comment.length > 0 && this.name.length > 0 }
  },
  methods: {
    openDrawer() {
      this.drawer = true
      this.$nextTick(() => {
        this.$refs.heroSelectField.onClick(this.$refs.heroSelectField)
      })
    },
    selectHero(hero: string) {
      if (HERO_NAMES.includes(hero.toLowerCase())) {
        this.drawer = false
        this.form.hero = hero
      } else if (hero.length === 0) {
        this.drawer = false
      }
    },
    cancelSelect() {
      this.drawer = false
    },
    selectRating(n: number) {
      this.form.rating = n
    },
    submit() {
      console.log(JSON.parse(JSON.stringify(this.form)))
    }
  }
})
</script>

<style lang="sass" scoped>
.absolute
  position: absolute
  left: 0
  top: 0
.left
  min-width: 125px
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
