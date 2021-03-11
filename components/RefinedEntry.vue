<template lang="pug">
  v-card.pa-5.mb-0.mb-sm-5.entry.rounded-xl(
    elevation="12"
  )
    // Mobile mode
    v-row(
      v-if="size === 'small'"
      no-gutters
    )
      v-col(cols="4").d-flex.justify-center.align-center
        HeroIcon.avatar(
          :edit="edit && !isSubmitted"
          :hero="data.hero"
          @selected="selectHero"
        )
      v-spacer
      v-col(cols="7")
        div.headline.title.text-center.rounded-pill.px-5
          div(v-if="!edit || isSubmitted") {{ data.name }}
          v-text-field.mx-5.pt-0.mt-2.my-2.headline(
            v-else
            v-model="data.name"
            hide-details
          )
        Rating(
          :rating="data.rating"
          :edit="edit && !isSubmitted"
          @selected="selectRating"
        )
        div.text-center.mt-2(v-if="!edit") {{ data.date.toLocaleDateString() }}
      v-col.mt-3.comment.rounded-lg(cols="12")
        div(v-if="!edit || isSubmitted") {{ data.comment }}
        v-textarea.pt-0.mt-0(
          v-else
          v-model="data.comment"
          hide-details
          rows="3"
        )
      v-btn.mt-3(
        v-if="edit"
        color="primary"
        block
        :disabled="!canSubmit"
        @click="submit"
      ) {{ !isSubmitted ? 'Отправить' : 'Отправлено' }}

    // Desktop mode
    v-row(
      v-else
      no-gutters
      :class="side === 'right' ? 'reverse' : ''"
    )
      v-col.flex-grow-0.bar.mr-5
        HeroIcon.avatar(
          :edit="edit && !isSubmitted"
          :hero="data.hero"
          @selected="selectHero"
        )
        Rating(
          :rating="data.rating"
          :edit="edit && !isSubmitted"
          @selected="selectRating"
        )
        v-btn.mt-3(
          v-if="edit"
          color="primary"
          block
          :disabled="!canSubmit"
          @click="submit"
        ) {{ !isSubmitted ? 'Отправить' : 'Отправлено' }}
      v-col.d-flex.flex-column
        div.headline.mb-5.d-flex.namespace
          div.headline.title.rounded-pill.px-5.flex-grow-1
            div(
              v-if="!edit || isSubmitted"
              :class="side === 'right' ? 'text-right' : ''"
            ) {{ data.name }}
            v-text-field.mx-5.mx-sm-0.pt-0.mt-2.my-2.headline(
              v-else
              v-model="data.name"
              hide-details
              :reverse="side === 'right'"
            )
          div.text-center.ml-5.flex-grow-0.my-auto.date(v-if="!edit") {{ new Date(data.date).toLocaleDateString() }}
        div.comment.rounded-lg
          div(
            v-if="!edit || isSubmitted"
            :class="side === 'right' ? 'text-right' : ''"
          ) {{ data.comment }}
          v-textarea.pt-0.mt-0(
            v-else
            v-model="data.comment"
            hide-details
            rows="4"
            :reverse="side === 'right'"
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

const DEFAULT_DATA = {
  date: new Date(),
  name: '',
  hero: 'random',
  rating: 0,
  comment: ''
} as Entry

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
        return DEFAULT_DATA
      }
    },
    match: { // Match element if one is found
      type: HTMLElement
    },
    remember: { // Remember text and disable edit on submit instead of clearing form data
      type: Boolean,
      default: false
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
    canSubmit(): boolean { return this.data.comment.length > 0 && this.data.name.length > 0 && !this.isSubmitted }
  },
  methods: {
    assignData() {
      this.data = Object.assign({}, this.data, DEFAULT_DATA, this.entry)
    },
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
          if (this.remember) this.isSubmitted = true
          else this.assignData()
        })
        .catch((error) => {
          console.error(error)
        })

      this.isLoading = false
    }
  },
  created() {
    this.assignData()
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
.reverse
  flex-flow: row-reverse
  .bar
    margin-right: 0 !important
    margin-left: 1rem
  .namespace
    flex-flow: row-reverse
    .date
      margin-left: 0 !important
      margin-right: 1rem
</style>
