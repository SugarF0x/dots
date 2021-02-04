<template lang="pug">
  div.pt-3
    div(v-if="readonly")
      v-icon(
        v-for="n in 5"
        :key="'rate-'+n"
      ) {{ getStar(n) }}
    div(v-else)
      v-btn(
        v-for="n in 5"
        :key="'rate-'+n"
        icon
        small
        max-width="25"
        @click="selectRating(n)"
        :disabled="readonly"
      )
        v-icon {{ getStar(n) }}
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: "Rating",
  props: {
    rating: {
      type: Number,
      default: 0
    },
    readonly: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      selected: this.rating
    }
  },
  watch: {
    rating(val) {
      this.selected = val
    }
  },
  methods: {
    getStar(n: number) {
      if (this.selected >= n) {
        return 'mdi-star'
      } else if (this.selected - n > 0) {
        return 'mdi-star-half-full'
      } else {
        return 'mdi-star-outline'
      }
    },
    selectRating(n: number) {
      if (this.selected === n) {
        this.selected = 0
      } else {
        this.selected = n
      }
      this.$emit('selected', this.selected)
    }
  }
})
</script>
