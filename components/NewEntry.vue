<template lang="pug">
  v-card.pa-5.mb-5.entry(
    color="#121c4c"
    elevation="12"
  )
    v-row(no-gutters)
      v-col.left.flex-grow-0.mr-5
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
          :rating="form.rating"
          :readonly="false"
          @selected="selectRating"
        )
        v-spacer
        div
          v-btn.mt-3(
            color="primary"
            :disabled="!canSubmit"
            @click="submit"
          ) Отправить
      v-col.right
        v-text-field.headline.title.mb-5.mt-0(
          v-model="form.name"
          :hide-details="true"
        )
        v-textarea.comment(
          v-model="form.comment"
          :hide-details="true"
        )
    v-overlay(
      v-if="isLoading"
      absolute
    )
      v-progress-circular(
        indeterminate
        size="100"
      )
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
      isLoading: false,
      form: {
        rating: 0,
        comment: '',
        name: this.name,
        hero: 'random'
      }
    }
  },
  computed: {
    canSubmit(): boolean { return this.form.comment.length > 0 && this.form.name.length > 0 }
  },
  methods: {
    openDrawer() {
      this.drawer = true
      this.$nextTick(() => {
        // @ts-ignore, comment: this is a ref, so it is there
        this.$refs.heroSelectField.onClick(this.$refs.heroSelectField)
      })
    },
    selectHero(hero: typeof HERO_NAMES[number]) {
      if (HERO_NAMES.includes(hero)) {
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
    async submit() {
      const resetEntry = () => {
        this.isLoading = false
        this.form.rating = 0
        this.form.comment = ''
        this.form.name = this.name
        this.form.hero = 'random'
      }

      this.isLoading = true

      let response = await this.$axios.post('/db/addEntry', this.form)
        .then((response) => {
          this.$emit('created', Object.assign({}, this.form, { date: new Date() }))
          resetEntry()
        })
        .catch((error) => {
          console.error(error)
        })
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
  display: flex
  flex-flow: column
  > *
    flex-grow: 0
  > :last-of-type
    flex-grow: 1
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
