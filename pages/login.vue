<template lang="pug">
  v-row(justify="center")
    v-col(
      cols="12"
      sm="8"
      md="5"
      lg="4"
    )
      v-card.entry
        v-card-title.text-center.justify-center Получение доступа на дополнение списка
        v-card-text
          v-text-field(
            type="password"
            v-model="input"
            placeholder="пароль"
          )
        v-card-actions
          v-btn(
            block
            color="primary"
          ) войти
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: "login",
  data() {
    return {
      input: ''
    }
  }
})
</script>

<style lang="sass" scoped>

</style>
