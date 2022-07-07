import axios from 'axios'
// import SockJS from 'sockjs-client'
// import Stomp from '@stomp/stompjs'

// let socket = null
// let stompClient = null
const currencyList = function (currency) {
  return currency === 'CNY' ||
          currency === 'GBP' ||
          currency === 'JPY' ||
          currency === 'EUR' ||
          currency === 'USD'
}

const appDetails = {
  name: 'StacksMate and the User Owned Internet',
  icon: origin + '/img/logo/logo.png'
}
const configuration = {
  appDetails: appDetails,
  network: process.env.VUE_APP_NETWORK
}
/**
const connectApiNews = function (commit) {
  if (!socket) socket = new SockJS(process.env.VUE_APP_CLARITYLAB_API + '/mesh/api-news')
  if (!stompClient) stompClient = Stomp.over(socket)
  stompClient.debug = () => {}
  socket.onclose = function () {
    stompClient.disconnect()
  }
  stompClient.connect({}, function () {
    stompClient.subscribe('/queue/rates-news', function (response) {
      const rates = JSON.parse(response.body)
      commit('setTickerRates', rates.tickerRates)
    })
  },
  function () {
  })
}
**/

const daoRatesStore = {
  namespaced: true,
  state: {
    timer: null,
    tickerRates: null,
    configuration: configuration,
    settledInvoice: null,
    invoice: null,
    headers: null,
    displayCard: 100,
    beneficiary: null,
    paymentOption: null,
    paymentOptions: []
  },
  getters: {
    getStxAmountFormatted: () => amountStx => {
      if (!amountStx) {
        return 0
      }
      return (Math.round(amountStx * 10000) / 10000)
    },
    getTickerRates: state => {
      if (!state.tickerRates) return []
      const currencies = state.tickerRates.filter((o) => currencyList(o.currency))
      return currencies
    },
    getUnfilteredTickerRates: state => {
      if (!state.tickerRates) return []
      return state.tickerRates
    }
  },
  mutations: {
    setTickerRates (state, tickerRates) {
      state.tickerRates = tickerRates
    }
  },
  actions: {
    initialiseRates ({ commit }) {
      return new Promise((resolve) => {
        try {
          axios.get(process.env.VUE_APP_CLARITYLAB_API + '/mesh/v1/rates/ticker').then(response => {
            // connectApiNews(commit)
            commit('setTickerRates', response.data)
            resolve(response.data)
          })
        } catch (err) {
          resolve()
        }
      })
    }
  }
}
export default daoRatesStore
