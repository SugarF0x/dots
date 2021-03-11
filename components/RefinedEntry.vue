<template lang="pug">
  v-card.pa-5.mb-5.entry.rounded-xl(
    elevation="12"
  )
    // Mobile mode
    v-row(
      v-if="size === 'small'"
      no-gutters
    )
      v-col(cols="4").d-flex.justify-center.align-center
        HeroIcon.avatar(
          v-once
          :edit="edit"
          :hero="data.hero"
          @selected="selectHero"
        )
      v-spacer
      v-col(cols="7")
        div.headline.title.text-center.rounded-pill.px-5
          div(v-if="!edit") {{ data.name }}
          v-text-field.mx-5.pt-0.mt-2.my-2.headline(
            v-else
            v-model="data.name"
            :hide-details="true"
          )
        Rating(
          v-once
          :rating="data.rating"
          :edit="edit"
          @selected="selectRating"
        )
        div.text-center.mt-2(v-if="!edit") {{ data.date.toLocaleDateString() }}
      v-col.mt-3.comment.rounded-lg(cols="12")
        div(v-if="!edit") {{ data.comment }}
        v-textarea.pt-0.mt-0(
          v-else
          v-model="data.comment"
          :hide-details="true"
          rows="3"
        )
      v-btn.mt-3(
        v-if="edit"
        color="primary"
        block
        :disabled="!canSubmit"
        @click="submit"
      ) Отправить

    // Desktop mode
    v-row(
      v-else
      no-gutters
    )
      v-col.flex-grow-0.mr-5
        HeroIcon.avatar(
          v-once
          :edit="edit"
          :hero="data.hero"
          @selected="selectHero"
        )
        Rating(
          v-once
          :rating="data.rating"
          :edit="edit"
          @selected="selectRating"
        )
        v-btn.mt-3(
          v-if="edit"
          color="primary"
          block
          :disabled="!canSubmit"
          @click="submit"
        ) Отправить
      v-col.d-flex.flex-column
        div.headline.mb-5.d-flex
          div.headline.title.rounded-pill.px-5.flex-grow-1
            div(v-if="!edit") {{ data.name }}
            v-text-field.mx-5.pt-0.mt-2.my-2.headline(
              v-else
              v-model="data.name"
              :hide-details="true"
            )
          div.text-center.ml-5.flex-grow-0.my-auto(v-if="!edit") {{ new Date(data.date).toLocaleDateString() }}
        div.comment.rounded-lg
          div(v-if="!edit") {{ data.comment }}
          v-textarea.pt-0.mt-0(
            v-else
            v-model="data.comment"
            :hide-details="true"
            rows="4"
          )

    // Loading overlay
    v-overlay(
      v-if="isLoading"
      absolute
    )
      v-progress-circular(
        indeterminate
        size="100"
      )

    // Match found star
    v-btn.star(
      v-if="match"
      icon
      @click="$vuetify.goTo(match)"
    )
      v-icon(
        color="yellow"
        x-large
      ) mdi-star
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Entry, HERO_NAMES } from "~/assets/consts"

export default Vue.extend({
  name: "RefinedEntry",
  props: {
    edit: { // Determines whether one can edit it's fields and submit a new Entry
      type: Boolean,
      default: false
    },
    side: { // Determines which sides the Avatar and text will stick to
      type: String as PropType<'left' | 'right'>,
      default: 'left'
    },
    entry: { // Initial Entry data
      type: Object as PropType<Entry>,
      default: (): Entry => {
        return {
          date: new Date(),
          name: '',
          hero: 'random',
          rating: 0,
          comment: ''
        }
      }
    },
    match: { // Match element if one is found
      type: HTMLElement
    }
  },
  data() {
    return {
      data: this.entry,
      isLoading: false,
      isSubmitted: false
    }
  },
  computed: {
    size() {
      // @ts-ignore - types are not yet supported by vuetify
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 'small'
        default:
          return 'large'
      }
    },
    canSubmit(): boolean { return this.data.comment.length > 0 && this.data.name.length > 0 }
  },
  methods: {
    selectRating(n: number) {
      this.data.rating = n
    },
    selectHero(h: typeof HERO_NAMES[number]) {
      this.data.hero = h
    },
    async submit() {
      this.isLoading = true

      await this.$axios.post('/db/addEntry', this.data)
        .then(() => {
          this.$store.commit('ADD_NEW_ENTRY', Object.assign({}, this.data, { date: new Date() }))
          this.isSubmitted = true
        })
        .catch((error) => {
          console.error(error)
        })

      this.isLoading = false
    }
  }
})
</script>

<style lang="sass" scoped>
.avatar
  min-width: 125px
.star
  position: absolute
  top: -0.5rem
  right: -0.5rem
</style>
