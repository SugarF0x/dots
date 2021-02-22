import { MutationTree, GetterTree, ActionTree } from 'vuex'
import { Entry } from '~/assets/consts'

// TODO: move queried state here as well so that one could modify it by clicking Logo (logo = take home = clear query)

export const state = () => ({
  entries: {
    lastFive: [] as Entry[], // maximum of 5
    searchResults: [] as Entry[],
    total: 0
  },
  isLoading: false
})

export type RootState = ReturnType<typeof state>
export interface CombinedStates extends RootState {
  // combined states go here
}

export const getters: GetterTree<RootState, RootState> = {
  // getters go here
}

// noinspection JSUnusedGlobalSymbols
export const mutations: MutationTree<RootState> = {
  SET_TOTAL_ENTRIES(state, payload: number) {
    state.entries.total = payload
  },
  SET_LAST_FIVE_ENTRIES(state, payload: Entry[]) {
    state.entries.lastFive = payload
  },
  SET_SEARCH_RESULTS(state, payload: Entry[]) {
    state.entries.searchResults = payload
  },
  SET_LOADING_STATE(state, payload: boolean) {
    state.isLoading = payload
  },
  ADD_NEW_ENTRY(state, payload: Entry) {
    state.entries.searchResults.unshift(payload)
    state.entries.lastFive.pop()
    state.entries.lastFive.unshift(payload)
    state.entries.total++
  }
}

// noinspection JSUnusedGlobalSymbols
export const actions: ActionTree<RootState, RootState> = {
  async getLastFive({ commit }) {
    commit('SET_LOADING_STATE', true)
    const response = await this.$axios.$get('/db/getLastFive') as { result: number, message: Entry[] }
    commit('SET_LOADING_STATE', false)

    if (response.result) {
      const sortedList = response.message.sort((a, b) => {
        return new Date(b.date).valueOf() - new Date(a.date).valueOf()
      })
      commit('SET_LAST_FIVE_ENTRIES', sortedList)
    }
  },
  async search({ commit }, payload) {
    commit('SET_LOADING_STATE', true)
    const response = await this.$axios.$get('/db/search', { params: { name: payload } }) as { result: number, message: Entry[] }
    commit('SET_LOADING_STATE', false)

    if (response.result) {
      const sortedList = response.message.sort((a, b) => {
        return new Date(b.date).valueOf() - new Date(a.date).valueOf()
      })
      commit('SET_SEARCH_RESULTS', sortedList)
    }
  },
  async getTotalEntries({ commit }) {
    const response = await this.$axios.$get('/db/getCount') as { result: number, message: number }

    if (response.result) {
      commit('SET_TOTAL_ENTRIES', response.message)
    }
  }
}
