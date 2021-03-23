<template lang="pug">
  v-layout(
    column
    justify-center
    align-center
  )
    v-card.d-inline-flex.flex-column.text-center.pa-2
      h1.display-3 {{ error.statusCode }}
      v-card-text
        h3 {{ error.message }}
        code.text-left.mt-5.pa-2(v-if="error.config") {{ error.config }}
      v-card-actions.actions
        v-btn(
          nuxt
          to="/"
          color="blue darken-2"
        )
          v-icon(left) mdi-home
          | Домой
        v-spacer
        v-btn(
          @click="reload"
          color="blue darken-2"
          v-if="error.statusCode !== 404"
        ) Обновить
          v-icon(right) mdi-update
        v-btn(
          @click="$router.go(-1)"
          color="blue darken-2"
          v-else
        ) Назад
          v-icon(right) mdi-undo-variant
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  head() {
    return {
      title: this.error.statusCode + ' ' + this.error.message
    }
  },
  methods: {
    reload() {
      document.location.reload()
    }
  }
})
</script>

<style lang="sass" scoped>
.actions
  > *
    margin-right: .5rem

  > *:last-child
    margin-right: 0
</style>
