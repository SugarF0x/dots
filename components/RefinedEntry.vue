<template lang="pug">
  v-card.pa-5.mb-5.entry.rounded-xl(
    elevation="12"
  )
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
        div.text-center.mt-2 {{ data.date.toLocaleDateString() }}
      v-col.mt-3.comment.rounded-lg(cols="12")
        div(v-if="!edit").mt-2 {{ data.comment }}
        v-textarea.pt-0.mt-0(
          v-else
          v-model="data.comment"
          :hide-details="true"
        )
      v-btn.mt-3(
        color="primary"
        block
        :disabled="!canSubmit"
        @click="submit"
      ) Отправить
    v-overlay(
      v-if="isLoading"
      absolute
    )
      v-progress-circular(
        indeterminate
        size="100"
      )

    //v-row(
    //  v-else
    //  no-gutters
    //)
    //  v-col.bar.flex-grow-0.mr-5
    //    HeroIcon(:hero="data ? data.hero : null")
    //    Rating(:rating="data ? data.rating : 0")
    //  v-col.right
    //    div.headline.mb-5.d-flex
    //      div.title.flex-grow-1 {{ data.name }}
    //      div.text-center.ml-5.flex-grow-0.my-auto {{ new Date(data.date).toLocaleDateString() }}
    //    div.comment {{ data.comment }}
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Entry, HERO_NAMES } from "~/assets/consts"

type Sides = 'left' | 'right'

export default Vue.extend({
  name: "RefinedEntry",
  props: {
    edit: { // Determines whether one can edit it's fields and submit a new Entry
      type: Boolean,
      default: false
    },
    side: { // Determines which sides the Avatar and text will stick to
      type: String as PropType<Sides>,
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
    isEntryFound: { // Whether an existing Entry has been found on Bulk Search
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      data: this.entry,
      isLoading: false
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
      console.log(this.data) // TODO: enable this on release
      // const resetEntry = () => {
      //   this.isLoading = false
      //   Object.assign(this.data, this.entry)
      // }
      //
      // this.isLoading = true
      //
      // let response = await this.$axios.post('/db/addEntry', this.data)
      //   .then((response) => {
      //     this.$emit('created', Object.assign({}, this.data, { date: new Date() }))
      //     resetEntry()
      //   })
      //   .catch((error) => {
      //     console.error(error)
      //   })
    }
  }
})
</script>

<style lang="sass" scoped>
.avatar
  min-width: 125px
</style>
