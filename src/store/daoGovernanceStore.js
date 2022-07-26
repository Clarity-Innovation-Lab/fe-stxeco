import {
  uintCV,
  serializeCV,
  stringAsciiCV,
  standardPrincipalCV
} from '@stacks/transactions'

const getReadConfig = function (contractName, functionName, functionArgs) {
  return {
    contractAddress: process.env.VUE_APP_DAO_DEPLOY_ADDRESS,
    contractName: contractName,
    functionName: functionName,
    functionArgs: functionArgs
  }
}

const fetchTotalSupply = function (state, dispatch, commit) {
  return new Promise((resolve) => {
    const config = getReadConfig(state.governanceTokenContract, 'get-total-supply', [])
    dispatch('daoStacksStore/callContractReadOnly', config, { root: true }).then((result) => {
      commit('setTotalSupply', Number(result.value.value))
      resolve(result)
    })
  })
}

const fetchBalance = function (state, dispatch, commit, stxAddress, functionName, setter) {
  return new Promise((resolve) => {
    const who = serializeCV(standardPrincipalCV(stxAddress)).toString('hex')
    const config = getReadConfig(state.governanceTokenContract, functionName, [who])
    dispatch('daoStacksStore/callContractReadOnly', config, { root: true }).then((result) => {
      commit(setter, Number(result.value.value))
      resolve(result)
    })
  })
}

const fetchParameter = function (state, dispatch, commit, parameter) {
  return new Promise((resolve) => {
    const param = stringAsciiCV(parameter)
    const buffer = serializeCV(param).toString('hex')
    const config = getReadConfig(state.proposalSubmissionContract, 'get-parameter', [buffer])
    dispatch('daoStacksStore/callContractReadOnly', config, { root: true }).then((result) => {
      commit('setParameter', { name: parameter, value: Number(result.value.value) })
      resolve(result)
    })
  })
}

const initialiseUserBalance = function (state, dispatch, commit, stxAddress) {
  return new Promise((resolve) => {
    fetchBalance(state, dispatch, commit, stxAddress, 'edg-get-total-delegated', 'setTotalDelegatedToMe')
    fetchBalance(state, dispatch, commit, stxAddress, 'edg-get-locked', 'setTokenBalanceLocked')
    fetchBalance(state, dispatch, commit, stxAddress, 'edg-get-balance', 'setTokenBalance')
    fetchTotalSupply(state, dispatch, commit)
    const who = serializeCV(standardPrincipalCV(stxAddress)).toString('hex')
    const propFactor = state.parameters.find((o) => o.name === 'propose-factor')
    if (!propFactor) return
    const factor = serializeCV(uintCV(propFactor.value)).toString('hex')
    const config = getReadConfig(state.governanceTokenContract, 'edg-has-percentage-balance', [who, factor])
    dispatch('daoStacksStore/callContractReadOnly', config, { root: true }).then((result) => {
      commit('setCanPropose', result.value.value)
      resolve(result)
    })
  })
}

const daoGovernanceStore = {
  namespaced: true,
  state: {
    parameters: [],
    governanceTokenContract: 'ede000-governance-token',
    proposalSubmissionContract: 'ede002-threshold-proposal-submission',
    tokenBalance: 0,
    tokenBalanceLocked: 0,
    totalDelegatedToMe: 0,
    totalSupply: null,
    canPropose: false
  },
  getters: {
    getTotalDelegatedToMe: state => {
      return state.totalDelegatedToMe
    },
    getTokenBalance: state => {
      return state.tokenBalance
    },
    getTokenBalanceSpendable: state => {
      return state.tokenBalance - state.tokenBalanceLocked
    },
    getTokenBalanceLocked: state => {
      return state.tokenBalanceLocked
    },
    getTotalSupply: state => {
      return state.totalSupply
    },
    getProposeFactor: state => {
      const proposeFactor = state.parameters.find((o) => o.name === 'propose-factor')
      if (!proposeFactor) return false
      return Number(proposeFactor.value)
    },
    getProposalDuration: state => {
      const proposeFactor = state.parameters.find((o) => o.name === 'proposal-duration')
      if (!proposeFactor) return 0
      return Number(proposeFactor.value)
    },
    getParameters: state => {
      return state.parameters
    },
    getCanPropose: state => {
      const proposeFactor = state.parameters.find((o) => o.name === 'propose-factor')
      if (!proposeFactor) return false
      return (state.tokenBalance + state.tokenBalanceLocked) * (proposeFactor.value) >= state.tokenBalance * 1000
    }
  },
  mutations: {
    setTotalDelegatedToMe (state, totalDelegatedToMe) {
      state.totalDelegatedToMe = totalDelegatedToMe
    },
    setTotalSupply (state, totalSupply) {
      state.totalSupply = totalSupply
    },
    setTokenBalance (state, tokenBalance) {
      state.tokenBalance = tokenBalance
    },
    setTokenBalanceLocked (state, tokenBalanceLocked) {
      state.tokenBalanceLocked = tokenBalanceLocked
    },
    setParameter (state, parameter) {
      const index = state.parameters.findIndex((o) => o.name === parameter.name)
      if (index > -1) {
        state.parameters.splice(index, 1, parameter)
      } else {
        state.parameters.splice(0, 0, parameter)
      }
    },
    setCanPropose (state, canPropose) {
      state.canPropose = canPropose
    }
  },
  actions: {
    initialiseGovernanceData ({ state, dispatch, commit }, stxAddress) {
      fetchParameter(state, dispatch, commit, 'minimum-proposal-start-delay')
      fetchParameter(state, dispatch, commit, 'maximum-proposal-start-delay')
      fetchParameter(state, dispatch, commit, 'proposal-duration')
      fetchParameter(state, dispatch, commit, 'propose-factor').then(() => {
        if (stxAddress) return initialiseUserBalance(state, dispatch, commit, stxAddress)
        else return null
      })
    }
  }
}
export default daoGovernanceStore
