import axios from 'axios'
import {
  uintCV,
  trueCV,
  falseCV,
  contractPrincipalCV
} from '@stacks/transactions'
import { DateTime } from 'luxon'
import { APP_CONSTANTS } from '@/app-constants'

const configuration = {
  network: process.env.VUE_APP_NETWORK,
  clarityLabApi: process.env.VUE_APP_CLARITYLAB_API,
  clarityLabStacksApi: process.env.VUE_APP_STACKS_API
}

/**
const getReadConfig = function (contractName, functionName, functionArgs) {
  return {
    contractAddress: process.env.VUE_APP_DAO_DEPLOY_ADDRESS,
    contractName: contractName,
    functionName: functionName,
    functionArgs: functionArgs
  }
}

const fetchProposalData = function (state, dispatch, commit, proposalContract) {
  return new Promise((resolve) => {
    const address = proposalContract.contract_id.split('.')[0]
    const name = proposalContract.contract_id.split('.')[1]
    const contractCV = contractPrincipalCV(address, name)
    const contractCVS = serializeCV(contractCV)
    const contractCVSH = contractCVS.toString('hex')
    const config = getReadConfig(state.proposalVotingContract, 'get-proposal-data', [contractCVSH])
    dispatch('daoStacksStore/callContractReadOnly', config, { root: true }).then((result) => {
      if (result && result.value && result.value.value) {
        const prop = state.proposals.find((p) => p.contractId === proposalContract.contract_id)
        prop.proposalData = result.value.value
        // commit('setProposalData', { contractId: proposalContract.contract_id, proposalData: result.value.value })
        commit('setProposal', prop)
        resolve(result)
      }
    })
  })
}

const initialiseProposalData = function (state, dispatch, commit) {
  return new Promise((resolve) => {
    const path = '/extended/v1/contract/by_trait?trait_abi=' + state.proposalTraitInterface
    const txOptions = {
      path: path,
      httpMethod: 'GET',
      postData: {
        arguments: [],
        sender: null
      }
    }
    dispatch('daoStacksStore/callApiDirect', txOptions, { root: true }).then((result) => {
      if (result && result.results) {
        let proposalContracts = result.results.filter((c) => c.source_code.indexOf('(impl-trait') > -1 && c.source_code.indexOf('.proposal-trait.proposal-trait') > -1)
        proposalContracts = proposalContracts.filter((c) => c.contract_id.indexOf('dev-fund') > -1 || c.contract_id.indexOf('edp009-enable-treasury') > -1)
        proposalContracts.forEach((pc) => {
          commit('setProposalContract', pc)
          setTimeout(function () {
            fetchProposalData(state, dispatch, commit, pc)
          }, 3000)
        })
        resolve(proposalContracts)
      }
    })
  })
}
**/

const daoProposalStore = {
  namespaced: true,
  state: {
    blockchainInfo: null,
    governanceTokenContract: 'ede000-governance-token',
    proposalVotingContract: 'ede001-proposal-voting',
    proposals: [],
    proposalTraitInterface: '{"maps":[],"functions":[{"args":[{"name":"sender","type":"principal"}],"name":"execute","access":"public","outputs":{"type":{"response":{"ok":"bool","error":"uint128"}}}}],"variables":[],"fungible_tokens":[],"non_fungible_tokens":[]}'
  },
  getters: {
    getBootstrapProposal: state => {
      const prop = state.proposals.find((p) => (p.contractId) && p.contractId.indexOf('edp000-bootstrap') > -1)
      return prop
    },
    getBlockchainInfo: state => {
      return state.blockchainInfo
    },
    getStacksTipHeight: state => {
      const blockchainInfo = state.blockchainInfo
      if (!blockchainInfo) return 0
      return Number(blockchainInfo.stacks_tip_height)
    },
    getProposalEndsHeight: (state, getters, rootState, rootGetters) => contractId => {
      const proposalDuration = rootGetters[APP_CONSTANTS.KEY_GOV_PROPOSAL_DURATION]
      if (!proposalDuration) return 0
      const prop = state.proposals.find((p) => p.contractId === contractId)
      return Number(prop.proposalData.startBlockHeight) + proposalDuration
    },
    getVotingInProgress: state => contractId => {
      const blockchainInfo = state.blockchainInfo
      let stacksTipHeight = 0
      if (blockchainInfo) {
        stacksTipHeight = Number(blockchainInfo.stacks_tip_height)
      }
      const prop = state.proposals.find((p) => p.contractId === contractId)
      return stacksTipHeight >= prop.proposalData.startBlockHeight && stacksTipHeight < prop.proposalData.endBlockHeight
    },
    getProposalTraitInterface: state => {
      return state.proposalTraitInterface
    },
    isValidProposal: state => proposal => {
      const p = state.proposals.find((p) => p.name === proposal.name)
      if (p) return false
      return (!proposal || !proposal.name)
    },
    getProposal: state => id => {
      let prop = state.proposals.find((p) => p.id === id)
      if (!prop) prop = state.proposals.find((p) => p.contractId === id)
      return prop
    },
    getProposals: state => {
      return state.proposals
    }
  },
  mutations: {
    setBlockchainInfo (state, blockchainInfo) {
      state.blockchainInfo = blockchainInfo
    },
    setProposalTraitInterface (state, proposalTraitInterface) {
      state.proposalTraitInterface = proposalTraitInterface
    },
    setProposalData (state, data) {
      const index = state.proposals.findIndex((o) => o.contractId === data.contractId)
      if (index > -1) {
        state.proposals[index].proposalData = data.proposalData
      }
    },
    setProposals (state, proposals) {
      state.proposals = proposals
    },
    setProposalContract (state, pc) {
      const index = state.proposals.findIndex((o) => o.contractId === pc.contract_id)
      if (index > -1) {
        const prop = state.proposals[index]
        prop.contract = pc
        prop.status = 'deployed'
        prop.contractId = pc.contract_id
        prop.proposer = pc.contract_id.split('.')[0]
      } else {
        const prop = {
          title: pc.contract_id.split('.')[1].replaceAll('-', ' ').replace('edp', 'EDP-'),
          proposer: pc.contract_id.split('.')[0],
          status: 'deployed',
          created: DateTime.now().ts,
          updated: DateTime.now().ts,
          contractId: pc.contract_id,
          contract: pc
        }
        state.proposals.push(prop)
      }
    },
    removeProposal (state, proposalId) {
      const index = state.proposals.findIndex((o) => o.id === proposalId)
      state.proposals.splice(index, 1)
    },
    setProposal (state, proposal) {
      const index = state.proposals.findIndex((o) => o.id === proposal.id)
      if (index > -1) {
        state.proposals.splice(index, 1, proposal)
      } else {
        state.proposals.splice(0, 0, proposal)
      }
    }
  },
  actions: {
    initialiseProposalMetaData ({ state, dispatch, commit }, stxAddress) {
      dispatch('fetchProposals')
    },
    initialiseProposalContractData ({ state, dispatch, commit }, stxAddress) {
      // return initialiseProposalData(state, dispatch, commit, stxAddress)
    },
    submitProposal ({ dispatch, commit }, proposal) {
      return new Promise((resolve, reject) => {
        if (proposal.status === 'draft') {
          reject(new Error('wrong status'))
          return
        }
        const contractId = proposal.contractId
        const startHeight = uintCV(proposal.startHeight)
        // const governanceContractCV = rootGetters['daoExtensionStore/getGoveranceContractCV']
        const governanceCV = contractPrincipalCV(contractId.split('.')[0], 'ede000-governance-token')
        const proposalCV = contractPrincipalCV(contractId.split('.')[0], contractId.split('.')[1])
        const callData = {
          postConditions: [],
          contractAddress: process.env.VUE_APP_DAO_DEPLOY_ADDRESS,
          contractName: 'ede002-proposal-submission',
          // senderAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
          // senderKey: '753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601',
          functionName: 'propose',
          functionArgs: [proposalCV, startHeight, governanceCV]
        }
        const methos = 'daoStacksStore/callContractBlockstack'
        // if (process.env.VUE_APP_NETWORK === 'local') {
        // methos = 'daoStacksStore/callContractWithPrivateKey'
        // }
        dispatch(methos, callData, { root: true }).then((result) => {
          proposal.status = 'submitted'
          proposal.submitTx = result.txId
          commit('setProposal', proposal)
          dispatch('saveProposal', proposal)
          resolve(result)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    constructDao ({ state, dispatch }) {
      return new Promise((resolve, reject) => {
        const bootstrap = state.proposals.find((p) => (p.contractId) && p.contractId.indexOf('edp000-bootstrap') > -1)
        const contractId = bootstrap.contractId
        const callData = {
          postConditions: [],
          contractAddress: contractId.split('.')[0],
          contractName: 'executor-dao',
          // senderAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
          // senderKey: '753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601',
          functionName: 'construct',
          functionArgs: [contractPrincipalCV(contractId.split('.')[0], contractId.split('.')[1])]
        }
        const methos = 'daoStacksStore/callContractBlockstack'
        if (process.env.VUE_APP_NETWORK === 'local') {
          // methos = 'daoStacksStore/callContractWithPrivateKey'
        }
        dispatch(methos, callData, { root: true }).then((result) => {
          resolve(result)
        }).catch(() => {
          resolve()
        })
      })
    },
    fetchBlockchainInfo ({ dispatch, commit }) {
      return new Promise((resolve, reject) => {
        const path = '/v2/info'
        const txOptions = { path: path, httpMethod: 'GET', postData: { arguments: [], sender: null } }
        dispatch('daoStacksStore/callApiDirect', txOptions, { root: true }).then((result) => {
          commit('setBlockchainInfo', result)
        })
      })
    },
    saveProposal ({ commit }, proposal) {
      return new Promise((resolve, reject) => {
        axios.post(configuration.clarityLabApi + '/mesh/v2/proposals', proposal).then(response => {
          commit('setProposal', response.data)
          resolve(response.data)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    deleteProposal ({ commit }, proposal) {
      return new Promise((resolve, reject) => {
        if (proposal.status !== 'draft') {
          reject(new Error('wrong status'))
          return
        }
        axios.delete(configuration.clarityLabApi + '/mesh/v2/proposals/' + proposal.id).then(response => {
          commit('removeProposal', proposal.id)
          resolve(response.data)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    fetchProposalFromChain ({ dispatch }, contractId) {
      return new Promise((resolve, reject) => {
        axios.get(configuration.clarityLabApi + '/mesh/v2/process-proposal-data/' + contractId).then(response => {
          dispatch('fetchProposal', contractId).then((props) => {
            resolve(props)
          })
        }).catch((error) => {
          reject(error)
        })
      })
    },
    fetchProposal ({ commit }, contractId) {
      return new Promise((resolve, reject) => {
        axios.get(configuration.clarityLabApi + '/mesh/v2/proposal/' + contractId).then(response => {
          commit('setProposal', response.data)
          resolve(response.data)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    fetchProposals ({ commit }) {
      return new Promise((resolve, reject) => {
        axios.get(configuration.clarityLabApi + '/mesh/v2/proposals').then(response => {
          commit('setProposals', response.data)
          resolve(response.data)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    castVote ({ dispatch }, vote) {
      return new Promise((resolve, reject) => {
        let forCV = trueCV()
        if (!vote.vfor) {
          forCV = falseCV()
        }
        const amountCV = uintCV(vote.amount)
        const governanceCV = contractPrincipalCV(process.env.VUE_APP_DAO_DEPLOY_ADDRESS, 'ede000-governance-token')
        const proposalCV = contractPrincipalCV(vote.proposalContractId.split('.')[0], vote.proposalContractId.split('.')[1])
        const callData = {
          postConditions: [],
          contractAddress: process.env.VUE_APP_DAO_DEPLOY_ADDRESS,
          contractName: 'ede002-proposal-voting',
          functionName: 'vote',
          functionArgs: [amountCV, forCV, proposalCV, governanceCV]
        }
        const methos = 'daoStacksStore/callContractBlockstack'
        // if (process.env.VUE_APP_NETWORK === 'local') {
        // methos = 'daoStacksStore/callContractWithPrivateKey'
        // }
        dispatch(methos, callData, { root: true }).then((result) => {
          resolve(result)
        }).catch((error) => {
          reject(error)
        })
      })
    }
  }
}
export default daoProposalStore
