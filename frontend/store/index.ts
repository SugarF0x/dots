import { MutationTree, GetterTree, ActionTree } from 'vuex'
import { Entry } from '~/assets/consts'
import qs from 'qs'

export const state = () => ({
  query: '',
  entries: {
    lastFive: [] as Entry[], // maximum of 5
    searchResults: [] as Entry[],
    total: 0
  },
  loadingProcessCount: 0
})

export type RootState = ReturnType<typeof state>
export interface CombinedStates extends RootState {
  // combined states go here
}

export const getters: GetterTree<RootState, RootState> = {
  isLoading: state => state.loadingProcessCount > 0,
}

// noinspection JSUnusedGlobalSymbols
export const mutations: MutationTree<RootState> = {
  SET_QUERY(state, payload: string) { state.query = payload },
  DUMP_QUERY(state) { state.query = '' },

  SET_TOTAL_ENTRIES(state, payload: number) { state.entries.total = payload },
  SET_LAST_FIVE_ENTRIES(state, payload: Entry[]) { state.entries.lastFive = payload },

  SET_SEARCH_RESULTS(state, payload: Entry[]) { state.entries.searchResults = payload },
  DUMP_SEARCH_RESULTS(state) { state.entries.searchResults = [] },

  ADD_NEW_ENTRY(state, payload: Entry) {
    state.entries.searchResults.unshift(payload)
    if (state.entries.lastFive.length >= 5) state.entries.lastFive.pop()
    state.entries.lastFive.unshift(payload)
    state.entries.total++
  },

  START_LOADING_PROCESS(state) { state.loadingProcessCount++ },
  FINISH_LOADING_PROCESS(state) { state.loadingProcessCount-- }
}

// noinspection JSUnusedGlobalSymbols
export const actions: ActionTree<RootState, RootState> = { // TODO: refactor repeating code segments (since Strapi introduction, a lot can be recycled)
  async getLastFive({ commit }) {
    commit('START_LOADING_PROCESS')
    await this.$axios.$get('/posts', { params: { _sort: 'createdAt:DESC', _limit: 5 } })
      .then(response => {
        commit('SET_LAST_FIVE_ENTRIES', response)
        commit('FINISH_LOADING_PROCESS')
      })
      .catch(e => console.error(e))
  },
  async search({ state, commit }) {
    commit('START_LOADING_PROCESS')
    await this.$axios.$get(`/posts`, { params: { name_contains: state.query, _sort: 'createdAt:DESC' } })
      .then(response => {
        commit('SET_SEARCH_RESULTS', response)
        commit('FINISH_LOADING_PROCESS')
      })
      .catch(e => console.error(e))
  },
  async bulkSearch({ commit }, payload) {

    let query = ''
    payload.forEach((name: string, index: number) => query += `${index>0?'&':''}name=${name}`)

    commit('START_LOADING_PROCESS')
    await this.$axios.$get(`/posts/bulk?${query}`)
      .then(response => {
        commit('SET_SEARCH_RESULTS', response)
        commit('FINISH_LOADING_PROCESS')
      })
      .catch(e => console.error(e))
  },
  async getTotalEntries({ commit }) {
    commit('START_LOADING_PROCESS')
    await this.$axios.$get('/posts/count')
      .then(response => {
        commit('SET_TOTAL_ENTRIES', response)
        commit('FINISH_LOADING_PROCESS')
      })
      .catch(e => console.error(e))
  },
  async getAll({ commit }) {
    commit('START_LOADING_PROCESS')
    await this.$axios.$get('/posts?_sort=createdAt:DESC&_limit=0')
      .then(response => {
        commit('SET_SEARCH_RESULTS', response)
        commit('FINISH_LOADING_PROCESS')
      })
      .catch(e => console.error(e))
  }
}
