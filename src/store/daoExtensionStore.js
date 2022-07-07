import {
  contractPrincipalCV,
  serializeCV
} from '@stacks/transactions'
import axios from 'axios'

const configuration = {
  network: process.env.VUE_APP_NETWORK,
  clarityLabApi: process.env.VUE_APP_CLARITYLAB_API,
  clarityLabStacksApi: process.env.VUE_APP_STACKS_API
}

const daoExtensionStore = {
  namespaced: true,
  state: {
    constructed: false,
    executor: 'executor-dao',
    extensions: [],
    extensionTraitInterface: '{"maps":[],"functions":[{"args":[{"name":"sender","type":"principal"},{"name":"memo","type":"buff 34"}],"name":"callback","access":"public","outputs":{"type":{"response":{"ok":"bool","error":"uint128"}}}}],"variables":[],"fungible_tokens":[],"non_fungible_tokens":[]}'
  },
  getters: {
    getGoveranceContractCV: state => {
      const contractCV = serializeCV(contractPrincipalCV(process.env.VUE_APP_DAO_DEPLOY_ADDRESS, state.extensions[0].contractName)).toString('hex')
      return contractCV
    },
    getExtensionTraitInterface: state => {
      return state.extensionTraitInterface
    },
    isConstructed: state => {
      return state.constructed
    },
    getExtensions: state => {
      return state.extensions
    }
  },
  mutations: {
    setExtensions (state, extensions) {
      state.extensions = extensions
    },
    setExtension (state, extension) {
      const index = state.extensions.findIndex((o) => o.contractId === extension.contractId)
      if (index > -1) {
        state.extensions[index].contract = extension
      } else {
        state.extensions.push(extension)
      }
    }
  },
  actions: {
    fetchExtensions ({ commit }) {
      return new Promise((resolve, reject) => {
        axios.get(configuration.clarityLabApi + '/mesh/v2/extensions').then(response => {
          commit('setExtensions', response.data)
          resolve(response.data)
        }).catch((error) => {
          reject(error)
        })
      })
    }
  }
}
export default daoExtensionStore
