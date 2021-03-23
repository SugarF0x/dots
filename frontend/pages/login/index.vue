<template lang="pug">
  v-container
    v-row(justify="center")
      v-col(
        cols="12"
        sm="7"
        md="5"
        lg="4"
      )
        v-card.entry(v-if="!$auth.loggedIn")
          v-card-title.text-center.justify-center Авторизация через Discord
          v-card-text.text-center
            v-icon.icon(
              size="100"
              @click="signIn"
            ) mdi-discord
        v-card.entry(v-else)
          v-card-title.text-center.justify-center Вход уже произведён
          v-card-actions
            v-btn(
              color="primary"
              @click="$auth.logout"
            ) Выйти
            v-spacer
            v-btn(
              color="primary"
              @click="$router.push('/')"
            ) Домой
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: "login",
  data() {
    return {
      input: '',
      errorMessage: '',
      isSuccess: false
    }
  },
  methods: {
    signIn() {
      console.log('fired sign in method')

      this.$auth.loginWith('discord')
    }
  },
  async mounted() {
    console.log('User: ', this.$auth.user)
    try {
      console.log('Me: ', await this.$axios.$get('/users/me'))
    } catch (e) {
      console.error(e)
    }
  }
})
</script>

<style lang="sass" scoped>

</style>
