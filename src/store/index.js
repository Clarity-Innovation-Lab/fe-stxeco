import Vue from 'vue'
import Vuex from 'vuex'
// import daoStore from './daoStore'
import daoAuthStore from './daoAuthStore'
import daoRatesStore from './daoRatesStore'
import daoStacksStore from './daoStacksStore'
import daoProposalStore from './daoProposalStore'
import daoGovernanceStore from './daoGovernanceStore'
import daoExtensionStore from './daoExtensionStore'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    // daoStore,
    daoAuthStore,
    daoRatesStore,
    daoStacksStore,
    daoProposalStore,
    daoGovernanceStore,
    daoExtensionStore
  },
  state: {
    chromeLink: 'https://chrome.google.com/webstore/detail/stacks-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj',
    firefoxLink: 'https://addons.mozilla.org/en-US/firefox/addon/stacks-wallet/',
    webWalletNeeded: false,
    configuration: {}
  },
  getters: {
    getWebWalletNeeded: state => {
      return state.webWalletNeeded
    },
    getPixelBackground: state => {
      if (!state.content.homepage) return
      return state.content.homepage.pixelbackground.url
    },
    getWebWalletLinkChrome: state => {
      return state.chromeLink
    },
    getWebWalletLinkFirefox: state => {
      return state.firefoxLink
    },
    getclarityLabStacksApiConfiguration: state => {
      return state.configuration
    }
  },
  mutations: {
    setWebWalletNeeded (state) {
      state.webWalletNeeded = true
    }
  },
  actions: {
    initDaoApplication ({ dispatch }) {
      return new Promise((resolve) => {
        dispatch('daoRatesStore/initialiseRates').then(() => {
          dispatch('daoAuthStore/fetchMyAccount').then((profile) => {
            dispatch('daoProposalStore/initialiseProposalMetaData', profile.stxAddress).then((results) => {
              dispatch('daoGovernanceStore/initialiseGovernanceData', profile.stxAddress)
              dispatch('daoExtensionStore/initialiseExtensionContractData')
              dispatch('daoProposalStore/initialiseProposalContractData')
              this.tick = setInterval(() => {
                dispatch('daoProposalStore/fetchBlockchainInfo')
              }, 30000)
              dispatch('daoProposalStore/fetchBlockchainInfo')
              if (profile.loggedIn) {
                dispatch('daoAuthStore/fetchAccountInfo', { stxAddress: profile.stxAddress, force: true })
                resolve(profile)
              } else {
                resolve(profile)
              }
            })
          })
        })
      })
    }
  }
})
