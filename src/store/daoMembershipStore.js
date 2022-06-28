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

const daoMembershipStore = {
  namespaced: true,
  state: {
    governanceTokenContract: 'ede000-governance-token',
    proposalVotingContract: 'ede001-proposal-voting'
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    fetchDelegateData ({ state, dispatch, commit }, stxAddress) {
      return fetchDelegateData(state, dispatch, commit, stxAddress)
    }
  }
}
export default daoMembershipStore
