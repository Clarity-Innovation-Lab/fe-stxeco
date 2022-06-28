import axios from 'axios'
import utils from '@/services/utils'

const fetchContractInternal = function (url) {
  return new Promise((resolve, reject) => {
    axios.get(url).then((result) => {
      resolve(result.data)
    }).catch((error) => {
      reject(new Error('Unable index record: ' + error))
    })
  })
}
/**
const checkChainForDeployment = function (commit, dispatch, contracts) {
  contracts.forEach((c) => {
    dispatch('fetchContractFromChain', { contractName: c.name }).then((result) => {
      // c.source = source
      if (result) commit('setContract', c)
    })
  })
}
**/
const getMembersAsString = function (state) {
  let strMembers = ''
  state.bootstrapConfig.members.forEach((o) => {
    strMembers += '\n\t\t{amount: u' + o.amount + ', recipient: \'' + o.address + '}\n '
  })
  return strMembers
}
const injectTraitAddress = function (state) {
  state.contracts.forEach((o) => {
    if (o.source) {
      o.source = o.source.replace('impl-trait .proposal-trait', 'impl-trait \'' + process.env.VUE_APP_DAO_TRAIT_ADDRESS + '.proposal-trait')
      o.source = o.source.replace('impl-trait .governance-token-trait', 'impl-trait \'' + process.env.VUE_APP_DAO_TRAIT_ADDRESS + '.governance-token-trait')
      o.source = o.source.replace('impl-trait .extension-trait', 'impl-trait \'' + process.env.VUE_APP_DAO_TRAIT_ADDRESS + '.extension-trait')
      o.source = o.source.replace('impl-trait .ownable-trait', 'impl-trait \'' + process.env.VUE_APP_DAO_TRAIT_ADDRESS + '.ownable-trait')
      o.source = o.source.replace('impl-trait .sip010-ft-trait', 'impl-trait \'' + process.env.VUE_APP_DAO_TRAIT_ADDRESS + '.sip010-ft-trait')
      o.source = o.source.replace('use-trait proposal-trait .proposal-trait', 'use-trait proposal-trait \'' + process.env.VUE_APP_DAO_TRAIT_ADDRESS + '.proposal-trait')
      o.source = o.source.replace('use-trait governance-token-trait .governance-token-trait', 'use-trait governance-token-trait \'' + process.env.VUE_APP_DAO_TRAIT_ADDRESS + '.governance-token-trait')
    }
  })
}
const injectConfig = function (state) {
  injectTraitAddress(state)
  const bootstrap = state.contracts.find((o) => o.name === 'edp000-bootstrap')
  if (!bootstrap || !bootstrap.source) return
  let source = bootstrap.source.replace('{amount: u1000, recipient: \'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5}\n', '')
  source = source.replace('{amount: u1000, recipient: \'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG}\n', '')
  source = source.replace('{amount: u1000, recipient: \'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC}\n', '')
  source = source.replace('{amount: u1000, recipient: \'ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND}\n', '')
  source = source.replace('{amount: u1000, recipient: \'ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB}\n', '')
  source = source.replace('{amount: u1000, recipient: \'ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0}\n', '')
  source = source.replace('{amount: u1000, recipient: \'ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP}\n', '')
  source = source.replace('{amount: u1000, recipient: \'ST3PF13W7Z0RRM42A8VZRVFQ75SV1K26RXEP8YGKJ}\n', '')
  source = source.replace('{amount: u1000, recipient: \'STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6}\n', '')
  source = source.replace('{amount: u1000, recipient: sender}', '{amount: u1000, recipient: sender}' + '\n' + getMembersAsString(state))

  source = source.replace('set-emergency-team-member \'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', 'set-emergency-team-member \'' + state.bootstrapConfig.emergencies[0] + ' \n')
  source = source.replace('set-emergency-team-member \'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5', 'set-emergency-team-member \'' + state.bootstrapConfig.emergencies[1] + ' \n')

  source = source.replace('set-executive-team-member \'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', 'set-executive-team-member \'' + state.bootstrapConfig.executives[0] + ' \n')
  source = source.replace('set-executive-team-member \'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5', 'set-executive-team-member \'' + state.bootstrapConfig.executives[1] + ' \n')
  source = source.replace('set-executive-team-member \'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG', 'set-executive-team-member \'' + state.bootstrapConfig.executives[2] + ' \n')
  source = source.replace('set-executive-team-member \'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC', 'set-executive-team-member \'' + state.bootstrapConfig.executives[3] + ' \n')
  bootstrap.source = source
}
const contractsFetched = function (contracts) {
  contracts.forEach((c) => {
    if (typeof c.source !== 'string') return false
  })
  return true
}
const executivesValid = function (state) {
  const executives = state.bootstrapConfig.executives
  let ok = utils.isValidAddress(executives[0]) &&
              utils.isValidAddress(executives[1]) &&
              utils.isValidAddress(executives[2]) &&
              utils.isValidAddress(executives[3])
  ok = ok && state.bootstrapConfig.executives.filter((o) => o === executives[0]).length === 1
  ok = ok && state.bootstrapConfig.executives.filter((o) => o === executives[1]).length === 1
  ok = ok && state.bootstrapConfig.executives.filter((o) => o === executives[2]).length === 1
  ok = ok && state.bootstrapConfig.executives.filter((o) => o === executives[3]).length === 1
  return ok
}
const emergenciesValid = function (state) {
  const emergencies = state.bootstrapConfig.emergencies
  let ok = utils.isValidAddress(emergencies[0]) &&
              utils.isValidAddress(emergencies[1])
  ok = ok && state.bootstrapConfig.emergencies.filter((o) => o === emergencies[0]).length === 1
  ok = ok && state.bootstrapConfig.emergencies.filter((o) => o === emergencies[1]).length === 1
  return ok
}

const membersValid = function (state) {
  const members = state.bootstrapConfig.members
  let ok = members.length > 0
  members.forEach((member) => {
    ok = ok && members.filter((o) => o.address === member.address).length === 1
  })
  return ok
}

const daoStore = {
  namespaced: true,
  state: {
    githubRaw: 'https://raw.githubusercontent.com/Clarity-Innovation-Lab/executor-dao/',
    github: 'https://github.com/Clarity-Innovation-Lab/executor-dao/blob/',
    currentBranch: 'feature/delegate-voting',
    gitBranches: [
      { name: 'main' },
      { name: 'feature/delegate-voting' },
      { name: 'feat/vote-delegation' }
    ],
    bootstrapConfig: {
      members: [],
      executives: [],
      emergencies: []
    },
    contracts: [
      { type: 'core', strapline: 'One DAO to bind them all', name: 'executor-dao', githubPath: '/contracts/executor-dao.clar' },
      { type: 'extension', strapline: 'Governance token extension', name: 'ede000-governance-token', githubPath: '/contracts/extensions/ede000-governance-token.clar' },
      { type: 'extension', strapline: 'Proposal voting extension', name: 'ede001-proposal-voting', githubPath: '/contracts/extensions/ede001-proposal-voting.clar' },
      { type: 'extension', strapline: 'Proposal submission extension', name: 'ede002-proposal-submission', githubPath: '/contracts/extensions/ede002-proposal-submission.clar' },
      { type: 'extension', strapline: 'Emergency proposal extension', name: 'ede003-emergency-proposals', githubPath: '/contracts/extensions/ede003-emergency-proposals.clar' },
      { type: 'extension', strapline: 'Emergency execution extension', name: 'ede004-emergency-execute', githubPath: '/contracts/extensions/ede004-emergency-execute.clar' },
      { type: 'extension', strapline: 'Dev fund extension', name: 'ede005-dev-fund', githubPath: '/contracts/extensions/ede005-dev-fund.clar' },
      { type: 'proposal', strapline: 'Bootstrap proposal', name: 'edp000-bootstrap', githubPath: '/contracts/proposals/edp000-bootstrap.clar' },
      { type: 'proposal', strapline: 'Dev fund proposal', name: 'edp001-dev-fund', githubPath: '/contracts/proposals/edp001-dev-fund.clar' },
      { type: 'proposal', strapline: 'Emergency kill proposal', name: 'edp002-kill-emergency-execute', githubPath: '/contracts/proposals/edp002-kill-emergency-execute.clar' },
      { type: 'proposal', strapline: 'NFT Escrow proposal', name: 'edp003-manage-escrow-nft', githubPath: '/contracts/proposals/edp003-manage-escrow-nft.clar' }
    ]
  },
  getters: {
    getCurrentBranchName: state => {
      return state.currentBranch
    },
    getCurrentBranch: state => {
      const ghUrl = state.github + state.currentBranch
      return ghUrl
    },
    isAddressValid: state => {
      return executivesValid(state) && emergenciesValid(state) && membersValid(state)
    },
    isBootstrapped: state => {
      return executivesValid(state) && emergenciesValid(state) && membersValid(state)
    },
    isMembersBootstrapped: state => {
      return membersValid(state)
    },
    isExecutivesBootstrapped: state => {
      return executivesValid(state)
    },
    isEmergenciesBootstrapped: state => {
      return emergenciesValid(state)
    },
    getBootstrapConfig: state => {
      return state.bootstrapConfig
    },
    getContracts: state => {
      return state.contracts
    },
    getContract: state => name => {
      return state.contracts.find((o) => o.name === name)
    }
  },
  mutations: {
    setBootstrapConfig (state, bootstrapConfig) {
      state.bootstrapConfig = bootstrapConfig
      injectConfig(state)
      localStorage.setItem('DAO_BOOTSTRAP_INFO', JSON.stringify(bootstrapConfig))
    },
    setContracts (state, contracts) {
      state.contracts = contracts
      localStorage.setItem('DAO_CONTRACT_INFO', JSON.stringify(contracts))
    },
    setContract (state, contract) {
      const index = state.contracts.findIndex((o) => o.name === contract.name)
      state.contracts[index] = contract
      localStorage.setItem('DAO_CONTRACT_INFO', JSON.stringify(state.contracts))
    }
  },
  actions: {
    initialise ({ state, dispatch }) {
      return new Promise((resolve) => {
        if (localStorage.getItem('DAO_BOOTSTRAP_INFO')) {
          state.bootstrapConfig = JSON.parse(localStorage.getItem('DAO_BOOTSTRAP_INFO'))
        }
        dispatch('fetchContractFromGithub')
        resolve()
      })
    },
    fetchContractFromGithub ({ state, commit }) {
      return new Promise((resolve) => {
        if (localStorage.getItem('DAO_CONTRACT_INFO')) {
          state.contracts = JSON.parse(localStorage.getItem('DAO_CONTRACT_INFO'))
          if (contractsFetched(state.contracts)) {
            injectConfig(state)
            // checkChainForDeployment(commit, dispatch, state.contracts)
            resolve(state.contracts)
            return
          }
        }
        const contracts = state.contracts
        contracts.forEach((c) => {
          const ghUrl = state.githubRaw + state.currentBranch
          fetchContractInternal(ghUrl + c.githubPath).then((source) => {
            c.source = source
            if (c.name === 'edp000-bootstrap') injectConfig(state)
            commit('setContracts', contracts)
          })
        })
      })
    },
    fetchRecentTx ({ dispatch }, stxAddress) {
      return new Promise((resolve, reject) => {
        const path = '/extended/v1/tx?unanchored=false'
        const txOptions = {
          path: path,
          httpMethod: 'GET',
          postData: {
            arguments: [],
            sender: null // this.profile.stxAddress
          }
        }
        dispatch('daoStacksStore/callApiDirect', txOptions, { root: true }).then((result) => {
          let mttx = result.results.filter((o) => o.sender_address === stxAddress)
          mttx = result.results.filter((o) => o.tx_type === 'smart_contract')
          mttx = result.results.filter((o) => o.tx_status === 'success' || o.tx_status === 'pending')
          resolve(mttx)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    fetchContractFromChain ({ state, commit, dispatch, rootGetters }, data) {
      return new Promise((resolve) => {
        const profile = rootGetters['daoAuthStore/getMyProfile']
        const contract = state.contracts.find((o) => o.name === data.contractName)
        const stxAddress = data.stxAddress || profile.stxAddress
        const path = '/extended/v1/contract/' + stxAddress + '.' + data.contractName
        const txOptions = {
          path: path,
          httpMethod: 'GET',
          postData: {
            arguments: [],
            sender: null
          }
        }
        dispatch('daoStacksStore/callApiDirect', txOptions, { root: true }).then((result) => {
          if (result && result.tx_id) {
            dispatch('fetchTransaction', result.tx_id).then((result) => {
              contract.result = result
              commit('setContract', contract)
              resolve(result)
            })
          } else {
            resolve(result)
          }
        }).catch(() => {
          resolve()
        })
      })
    },
    fetchTransaction ({ dispatch }, txId) {
      return new Promise((resolve) => {
        const path = '/extended/v1/tx/' + txId
        const txOptions = {
          path: path,
          httpMethod: 'GET',
          postData: {
            arguments: [],
            sender: null
          }
        }
        dispatch('daoStacksStore/callApiDirect', txOptions, { root: true }).then((result) => {
          resolve(result)
        }).catch(() => {
          resolve()
        })
      })
    },
    deployContract ({ commit, dispatch, rootGetters }, contract) {
      return new Promise((resolve, reject) => {
        const profile = rootGetters['daoAuthStore/getMyProfile']
        const deployData = {
          codeBody: contract.source,
          contractId: profile.stxAddress + '.' + contract.name
        }
        dispatch('daoStacksStore/deployProjectContract', deployData, { root: true }).then((result) => {
          contract.transaction = result
          commit('setContract', contract)
          setTimeout(function () {
            dispatch('fetchRecentMempoolTx', { contract: contract, stxAddress: profile.stxAddress })
          }, 4000)
          resolve(contract)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    fetchRecentMempoolTx ({ commit, dispatch }, data) {
      return new Promise((resolve, reject) => {
        const path = '/extended/v1/address/' + data.stxAddress + '/mempool?unanchored=false'
        const txOptions = {
          path: path,
          httpMethod: 'GET',
          postData: {
            arguments: [],
            sender: null
          }
        }
        dispatch('daoStacksStore/callApiDirect', txOptions, { root: true }).then((result) => {
          data.contract.transaction = result
          commit('setContract', data.contract)
          resolve(result)
        }).catch((err) => {
          reject(err)
        })
      })
    }
  }
}
export default daoStore
