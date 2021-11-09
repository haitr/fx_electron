import Vuex, {
  MutationTree,
  ActionTree,
  ActionContext,
} from 'vuex'

import {
  // createPersistedState,
  createSharedMutations 
} from "vuex-electron"

import Vue from "vue"
Vue.use(Vuex)

const createStore = <T>(state: T, mutations: MutationTree<T>) => {
  var actions: ActionTree<T, T> = 
    Object.keys(mutations).reduce((acc: ActionTree<T, T>, cur: string) => {
      acc[cur] = (store: ActionContext<T, T>) => {
        store.commit(cur)
      }
      return acc
    }, {})

  return new Vuex.Store({
    state: state,
    actions: actions,
    mutations: mutations,
    plugins: [
      // createPersistedState(), // save store's state to disk
      createSharedMutations(), // share between windows
    ],
		strict: process.env.NODE_ENV !== 'production'
  })
}

export default createStore