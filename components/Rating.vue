<template lang="pug">
  div.pt-3
    v-icon(
      v-for="n in 5"
      :key="'rate-'+n"
    ) {{ getStar(n) }}
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: "Rating",
  props: {
    rating: {
      type: Number,
      required: true
    }
  },
  methods: {
    getStar(n: number) {
      if (this.rating >= n) {
        return 'mdi-star'
      } else if (this.rating - n > 0) {
        return 'mdi-star-half-full'
      } else {
        return 'mdi-star-outline'
      }
    }
  }
})
</script>

<style lang="sass" scoped>

</style>
