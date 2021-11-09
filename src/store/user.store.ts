import {
  MutationTree
} from 'vuex'
import createStore from './base.store'

interface UserStoreState {
  count: number
}

const state: UserStoreState = {
  count: 2
}

const mutations: MutationTree<UserStoreState> = {
  increment: (state) => {
    state.count++
  },
  decrement: (state) => {
    state.count--
  }
}

const userStore = createStore(state, mutations)

export default userStore