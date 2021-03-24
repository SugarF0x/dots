<template lang="pug">
  div.pt-3
    div(v-if="!edit").text-center
      v-icon(
        :style="{ color }"
        v-for="n in 5"
        :key="'rate-'+n"
      ) {{ getStar(n) }}
    div(v-else).text-center
      v-btn(
        v-for="n in 5"
        :key="'rate-'+n"
        icon
        small
        max-width="25"
        @click="selectRating(n)"
      )
        v-icon(:style="{ color }") {{ getStar(n) }}
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
    edit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedRating: this.rating
    }
  },
  computed: {
    color(): string {
      const colors = [
        'red', '#740001', '#9C0009',
        '#b87333', 'silver', 'gold'
      ]

      // These colors are based off of HotS Ranks
      // const colors = [
      //   '#C17C62', '#B2B8CE', '#FAC627',
      //   '#C1A0FF', '#01BDEE', '#D2FCFF'
      // ]

      return colors[this.selectedRating]
    }
  },
  watch: {
    rating(n) { this.selectedRating = n }
  },
  methods: {
    getStar(n: number) {
      if (this.selectedRating >= n) {
        return 'mdi-star'
      } else if (this.selectedRating - n > 0) {
        return 'mdi-star-half-full'
      } else {
        return 'mdi-star-outline'
      }
    },
    selectRating(n: number) {
      if (this.selectedRating === n) {
        this.selectedRating = 0
      } else {
        this.selectedRating = n
      }
      this.$emit('selected', this.selectedRating)
    }
  }
})
</script>
