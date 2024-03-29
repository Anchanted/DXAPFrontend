const button = {
  namespaced: true,

  state: {
    buttonZoom: {
      flag: false,
      data: 0
    },
    displayVirtualButton: false,
    locationActivated: false,
    gateActivated: false,
    occupationActivated: false
  },

  mutations: {
    setButtonZoom(state, payload) {
      state.buttonZoom.data = payload
      state.buttonZoom.flag = !state.buttonZoom.flag
    },
    setDisplayVirtualButton(state, payload) {
      state.displayVirtualButton = payload
    },
    setGateActivated(state, payload) {
      state.gateActivated = payload
    },
    reverseGateActivated(state, payload) {
      state.gateActivated = !state.gateActivated
    },
    setOccupationActivated(state, payload) {
      state.occupationActivated = payload
    },
    reverseOccupationActivated(state, payload) {
      state.occupationActivated = !state.occupationActivated
    },
    setLocationActivated(state, payload) {
      state.locationActivated = payload
    },
    reverseLocationActivated(state, payload) {
      state.locationActivated = !state.locationActivated
    }
  },

  actions: {

  },

  getters: {

  }
}

export default button
