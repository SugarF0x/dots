<template lang="pug">
  v-container
    v-row(justify="center")
      v-col(
        cols="12"
        sm="7"
        md="5"
        lg="4"
      )
        v-card.text-center.entry
          v-card-title.justify-center {{ isSuccessful ? 'Вход успешно совершён' : 'Ошибка' }}
          v-card-text.headline {{ isSuccessful ? username : 'Что-то пошло не так' }}
          v-card-actions
            v-btn(
              block
              color="primary"
              @click="$router.push('/')"
            ) На главную
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: "callback",
  data() {
    return {
      query: this.$route.query as any
    }
  },
  computed: {
    isSuccessful(): boolean { return this.query.access_token && this.query.refresh_token },
    username() { return this.$auth.user?.username }
  },
  async mounted() {
    if (this.isSuccessful) {
      await this.$axios.$get('/auth/discord/callback', { params: this.query })
        .then(response => {
          this.$auth.setUser(response.user)
          this.$auth.setUserToken(response.jwt, this.query.refresh_token)
        })
    }
  }
})
</script>

<style lang="sass" scoped>

</style>
