import { MutationTree, GetterTree, ActionTree } from 'vuex'
import { Entry } from '~/assets/consts'

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
export const actions: ActionTree<RootState, RootState> = {
  async getLastFive({ commit }) {
    commit('START_LOADING_PROCESS')
    const response = await this.$axios.$get('/db/getLastFive') as { result: number, message: Entry[] }

    if (response.result) {
      commit('SET_LAST_FIVE_ENTRIES', response.message)
    }

    commit('FINISH_LOADING_PROCESS')
  },
  async search({ state, commit }) {
    commit('START_LOADING_PROCESS')
    const response = await this.$axios.$get('/db/search', { params: { name: state.query } }) as { result: number, message: Entry[] }
    if (response.result) {
      commit('SET_SEARCH_RESULTS', response.message)
    }

    commit('FINISH_LOADING_PROCESS')
  },
  async bulkSearch({ commit }, payload) {
    commit('START_LOADING_PROCESS')
    const response = await this.$axios.$get('/db/bulkSearch', { params: { names: payload } }) as { result: number, message: Entry[] }
    if (response.result) {
      commit('SET_SEARCH_RESULTS', response.message)
    }

    commit('FINISH_LOADING_PROCESS')
  },
  async getTotalEntries({ commit }) {
    commit('START_LOADING_PROCESS')
    const response = await this.$axios.$get('/db/getCount') as { result: number, message: number }

    if (response.result) {
      commit('SET_TOTAL_ENTRIES', response.message)
    }

    commit('FINISH_LOADING_PROCESS')
  },
  async getAll({ commit }) {
    commit('START_LOADING_PROCESS')
    const response = await this.$axios.$get('/db/getAll') as { result: number, message: Entry[] }

    if (response.result) {
      commit('SET_SEARCH_RESULTS', response.message)
    }

    commit('FINISH_LOADING_PROCESS')
  }
}
