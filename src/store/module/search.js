const searchHistory = {
  namespaced: true,

  state: {
    displaySearchHistory: false,
    historyList: []
  },

  getters: {

  },

  mutations: {
    setDisplaySearchHistory (state, payload) {
      state.displaySearchHistory = payload
    },
    setHistoryList (state, payload) {
      if (payload instanceof Array) state.historyList = payload
    }
  },

  actions: {
    commitDisplaySearchHistory ({ state, commit }, payload) {
      if (state.displaySearchHistory !== payload) commit('setDisplaySearchHistory', payload)
    },
    refreshHistoryList ({ commit }, unifySearchItem) {
      let historyList = JSON.parse(localStorage.getItem('historyList')) || []
      if (!(historyList instanceof Array)) historyList = []
      console.log(unifySearchItem(historyList))
      commit('setHistoryList', unifySearchItem(historyList))
    },
    saveHistoryList ({ dispatch }, { item, unifySearchItem }) {
      let historyList = JSON.parse(localStorage.getItem('historyList')) || []
      if (!(historyList instanceof Array)) historyList = []
      let duplicatedIndex = -1

      if (item instanceof Object) {
        historyList.some((element, index) => {
          if (element.dataType === item.dataType) {
            if (item.dataType === 'query') {
              if (element.name === item.name) {
                duplicatedIndex = index
                return true
              }
            } else if (element.id === item.id) {
              duplicatedIndex = index
              return true
            }
          }
        })
      } else if (typeof item === "number") {
        duplicatedIndex = item
      }

      if (duplicatedIndex > -1) historyList.splice(duplicatedIndex, 1)
      if (item instanceof Object) historyList.unshift(item)
      if (historyList.length > 20) historyList.splice(20)

      localStorage.setItem('historyList', JSON.stringify(historyList))

      dispatch('refreshHistoryList', unifySearchItem)
    }
  }
}

export default searchHistory
