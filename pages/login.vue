<template lang="pug">
  v-container
    v-row(justify="center")
      v-col(
        cols="12"
        sm="8"
        md="7"
        lg="5"
      )
        v-card.entry(v-if="!$auth.loggedIn")
          v-card-title.text-center.justify-center Получение доступа на дополнение списка
          v-card-text
            v-text-field(
              type="password"
              v-model="input"
              placeholder="пароль"
              @keypress.enter="signIn"
              :error="errorMessage.length > 0"
              :error-messages="errorMessage"
            )
          v-card-actions
            v-btn(
              block
              color="primary"
              @click="signIn"
            ) войти
        v-card.entry(v-else-if="!isSuccess")
          v-card-title.text-center.justify-center Вход уже произведён
          v-card-actions
            v-btn(
              block
              color="primary"
              @click="$auth.logout('local')"
            ) Выйти
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
      this.$auth.loginWith('local', { data: { password: this.input } })
        .then(() => this.isSuccess = true)
        .catch((e) => {
          if (e.toString().split(' ').includes('400')) { this.errorMessage = 'Неверный пароль' }
          else { this.errorMessage = 'Что-то пошло не так' }
        })
    }
  }
})
</script>

<style lang="sass" scoped>

</style>
