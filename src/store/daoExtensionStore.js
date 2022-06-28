import {
  contractPrincipalCV,
  serializeCV
} from '@stacks/transactions'

const getReadConfig = function (contractName, functionName, functionArgs) {
  return {
    contractAddress: process.env.VUE_APP_DAO_DEPLOY_ADDRESS,
    contractName: contractName,
    functionName: functionName,
    functionArgs: functionArgs
  }
}

const checkExtensionEnabled = function (state, dispatch, commit, contractName) {
  return new Promise((resolve) => {
    const contractCV = serializeCV(contractPrincipalCV(process.env.VUE_APP_DAO_DEPLOY_ADDRESS, contractName)).toString('hex')
    const config = getReadConfig(state.executor, 'is-extension', [contractCV])
    dispatch('daoStacksStore/callContractReadOnly', config, { root: true }).then((result) => {
      const extension = state.extensions.find((o) => o.contractName === contractName)
      if (result.value) commit('setConstructed', true)
      extension.enabled = result.value
      commit('setExtension', extension)
      resolve(extension)
    })
  })
}

const initialiseExtensionContractData = function (state, dispatch, commit) {
  return new Promise((resolve) => {
    state.extensions.forEach((extension) => {
      checkExtensionEnabled(state, dispatch, commit, extension.contractName)
    })
  })
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
    setExtensionTraitInterface (state, extensionTraitInterface) {
      state.extensionTraitInterface = extensionTraitInterface
    },
    setConstructed (state, constructed) {
      state.constructed = constructed
    },
    setExtensions (state, extensions) {
      state.extensions = extensions
    },
    setExtension (state, extension) {
      const index = state.extensions.findIndex((o) => o.contractName === extension.contractName)
      if (index > -1) {
        state.extensions[index].contract = extension
      } else {
        state.extensions.push(extension)
      }
    }
  },
  actions: {
    initialiseExtensionContractData ({ state, dispatch, commit }) {
      state.extensions.push({ index: 0, contractName: 'ede000-governance-token' })
      state.extensions.push({ index: 1, contractName: 'ede001-proposal-voting' })
      state.extensions.push({ index: 2, contractName: 'ede002-proposal-submission' })
      state.extensions.push({ index: 3, contractName: 'ede003-emergency-proposals' })
      state.extensions.push({ index: 4, contractName: 'ede004-emergency-execute' })
      state.extensions.push({ index: 5, contractName: 'ede005-dev-fund' })
      return initialiseExtensionContractData(state, dispatch, commit)
    }
  }
}
export default daoExtensionStore
