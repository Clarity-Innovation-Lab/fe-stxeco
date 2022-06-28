import {
  callReadOnlyFunction,
  bufferCV,
  cvToJSON,
  uintCV,
  intCV,
  serializeCV,
  PostConditionMode,
  deserializeCV,
  makeContractCall,
  makeContractDeploy,
  broadcastTransaction
} from '@stacks/transactions'
import { openSTXTransfer, openContractDeploy, openContractCall } from '@stacks/connect'
import {
  StacksTestnet,
  StacksMainnet,
  StacksMocknet
} from '@stacks/network'
import axios from 'axios'
import BigNum from 'bn.js'

// const network = new StacksTestnet()
const precision = 1000000
const contractDeployFee = 100000
const testnet = new StacksTestnet()
const mainnet = new StacksMainnet()
const mocknet = new StacksMocknet()
// const mocknet = new StacksMocknet({ url: 'http://localhost:20443' })

const configuration = {
  network: process.env.VUE_APP_NETWORK,
  clarityLabApi: process.env.VUE_APP_CLARITYLAB_API,
  stacksApi: process.env.VUE_APP_STACKS_API
}

const daoStacksStore = {
  namespaced: true,
  state: {
    provider: 'connect',
    result: null,
    contracts: [],
    appName: 'executor stx dao',
    appLogo: '/img/logo.png'
  },
  getters: {
  },
  mutations: {
    setResult (state, result) {
      state.result = result
    }
  },
  actions: {
    cleanup ({ state }) {
      return new Promise((resolve, reject) => {
        resolve(null)
      })
    },
    callContractWithPrivateKey ({ commit, state, dispatch, rootGetters }, data) {
      return new Promise((resolve, reject) => {
        let network = mocknet
        if (configuration.network === 'mainnet') network = mainnet
        if (configuration.network === 'testnet') network = testnet
        dispatch('daoAuthStore/fetchNoncesFor', data.senderAddress, { root: true }).then((nonces) => {
          const txOptions = {
            contractAddress: data.contractAddress,
            contractName: data.contractName,
            functionName: data.functionName,
            functionArgs: (data.functionArgs) ? data.functionArgs : [],
            fee: new BigNum(10000),
            senderKey: data.senderKey,
            nonce: new BigNum(nonces.possible_next_nonce),
            network: network,
            postConditionMode: (data.postConditionMode) ? data.postConditionMode : PostConditionMode.Deny,
            postConditions: (data.postConditions) ? data.postConditions : []
          }
          makeContractCall(txOptions).then((transaction) => {
            const txdata = new Uint8Array(transaction.serialize())
            const headers = {
              'Content-Type': 'application/octet-stream'
            }
            axios.post(configuration.clarityLabApi + '/mesh' + '/v2/broadcast', txdata, { headers: headers }).then(response => {
              const result = {
                txId: response.data,
                network: 15,
                assetHash: data.assetHash,
                contractAddress: data.contractAddress,
                contractName: data.contractName,
                functionName: data.functionName,
                functionArgs: data.functionArgs
              }
              resolve(result)
            }).catch((error) => {
              resolve(commit, error)
            })
            if (configuration.network !== 'local') {
              broadcastTransaction(transaction, network).then((result) => {
                result.contractAddress = data.contractAddress
                result.contractName = data.contractName
                result.functionName = data.functionName
                resolve(result)
              }).catch((error) => {
                reject(error)
              })
            }
          })
        })
      })
    },
    callContractBlockstack ({ dispatch, commit, state }, data) {
      return new Promise((resolve, reject) => {
        let network = mocknet
        if (configuration.network === 'mainnet') network = mainnet
        if (configuration.network === 'testnet') network = testnet
        const txBroadcastUrl = network.getBroadcastApiUrl()
        console.log(txBroadcastUrl)
        const txOptions = {
          contractAddress: data.contractAddress,
          contractName: data.contractName,
          functionName: data.functionName,
          functionArgs: (data.functionArgs) ? data.functionArgs : [],
          postConditions: (data.postConditions) ? data.postConditions : [],
          postConditionMode: (data.postConditionMode) ? data.postConditionMode : PostConditionMode.Deny,
          network: network,
          appDetails: {
            name: state.appName,
            icon: state.appLogo
          },
          onFinish: (response) => {
            const result = {
              txId: (response.txId && response.txId.txid) ? response.txId.txid : response.txId,
              txRaw: response.txRaw,
              stacksTransaction: response.stacksTransaction,
              network: 15,
              assetHash: data.assetHash,
              contractAddress: data.contractAddress,
              contractName: data.contractName,
              functionName: data.functionName,
              functionArgs: data.functionArgs
            }
            resolve(result)
          }
        }
        openContractCall(txOptions).catch((error) => {
          reject(error)
        })
      })
    },
    callContractBlockstackReadOnly ({ state }, data) {
      return new Promise((resolve, reject) => {
        callReadOnlyFunction({
          contractAddress: data.contractAddress,
          contractName: data.contractName,
          functionName: data.functionName,
          functionArgs: (data.functionArgs) ? data.functionArgs : [],
          senderAddress: state.macsWallet.keyInfo.address
        }).then((result) => {
          resolve(result)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    callContractReadOnly ({ rootGetters }, data) {
      return new Promise((resolve, reject) => {
        const path = '/v2/contracts/call-read/' + data.contractAddress + '/' + data.contractName + '/' + data.functionName
        const txOptions = {
          path: path,
          httpMethod: 'POST',
          postData: {
            arguments: (data.functionArgs) ? data.functionArgs : [],
            sender: data.contractAddress
          }
        }
        const headers = {
          'Content-Type': 'application/json'
        }
        axios.post(configuration.clarityLabApi + '/mesh' + '/v2/accounts', txOptions).then(response => {
          // data.result = utils.jsonFromTxResult(response.data.result)
          const result = cvToJSON(deserializeCV(response.data.result))
          resolve(result)
        }).catch(() => {
          const profile = rootGetters['daoAuthStore/getMyProfile']
          const txOptions = {
            sender: profile.stxAddress, // data.contractAddress
            arguments: (data.functionArgs) ? data.functionArgs : []
          }
          axios.post(configuration.stacksApi + path, txOptions, { headers: headers }).then(response => {
            // data.result = utils.jsonFromTxResult(response.data.result)
            const result = cvToJSON(deserializeCV(response.data.result))
            resolve(result)
          }).catch((error) => {
            reject(error)
          })
        })
      })
    },
    lookupTokenContractData: function ({ dispatch }, data) {
      return new Promise(function (resolve) {
        const functionArgs = []
        const config = {
          contractAddress: data.contractAddress,
          contractName: data.contractName,
          functionName: 'get-contract-data',
          functionArgs: functionArgs
        }
        dispatch('callContractReadOnly', config).then((result) => {
          resolve(result)
        }).catch((e) => {
          resolve(null)
        })
      })
    },
    lookupAppmapContractData: function ({ dispatch }, data) {
      return new Promise(function (resolve) {
        const functionArgs = []
        const config = {
          contractAddress: data.contractAddress,
          contractName: data.contractName,
          functionName: 'get-contract-data',
          functionArgs: functionArgs
        }
        dispatch('callContractReadOnly', config).then((result) => {
          resolve(result)
        }).catch((e) => {
          resolve(null)
        })
      })
    },
    lookupApplicationByIndex: function ({ dispatch }, data) {
      return new Promise(function (resolve) {
        const functionArgs = [`0x${serializeCV(intCV(data.appCounter)).toString('hex')}`]
        const config = {
          contractAddress: data.contractAddress,
          contractName: data.contractName,
          functionName: 'get-app',
          functionArgs: functionArgs
        }
        dispatch('callContractReadOnly', config).then((result) => {
          resolve(result)
        }).catch((e) => {
          resolve(null)
        })
      })
    },
    lookupToken: function ({ dispatch, commit }, data) {
      return new Promise(function (resolve) {
        const functionArgs = [`0x${serializeCV(uintCV(data.nftIndex)).toString('hex')}`]
        const config = {
          contractAddress: data.contractAddress,
          contractName: data.contractName,
          functionName: 'get-token-by-index',
          functionArgs: functionArgs
        }
        dispatch('callContractReadOnly', config).then((resp) => {
          if (resp.result && (resp.result.nftIndex === 0 || resp.result.nftIndex > 0)) {
            const result = resp.result
            result.network = 15
            result.opcode = 'stx-contract-read'
            resolve(result)
            window.eventBus.$emit('daoEvent', result)
          } else {
            resolve(null)
          }
        }).catch((e) => {
          resolve(null)
        })
      })
    },
    lookupTokenByIndex: function ({ dispatch }, data) {
      return new Promise((resolve, reject) => {
        data.a1 = intCV(data.nftIndex)
        data.a2 = serializeCV(data.a1)
        data.a3 = (data.a2).toString('hex')
        data.functionArgs = [`0x${serializeCV(intCV(data.nftIndex)).toString('hex')}`]
        data.functionName = 'get-token-by-index'
        dispatch('lookupToken', data).then((result) => {
          resolve(result)
        })
      })
    },
    lookupTokenByHash ({ dispatch }, data) {
      return new Promise((resolve, reject) => {
        const buffer = `0x${serializeCV(bufferCV(Buffer.from(data.assetHash, 'hex'))).toString('hex')}` // Buffer.from(hash.toString(CryptoJS.enc.Hex), 'hex')
        data.functionArgs = [buffer]
        data.functionName = 'get-token-by-hash'
        dispatch('lookupToken', data).then((result) => {
          resolve(result)
        })
      })
    },
    lookupContractInterface ({ commit }, contractId) {
      return new Promise((resolve, reject) => {
        const contractAddress = contractId.split('.')[0]
        const contractName = contractId.split('.')[1]
        const txOptions = {
          path: '/v2/contracts/interface/' + contractAddress + '/' + contractName + '?proof=0',
          httpMethod: 'GET'
        }
        axios.post(configuration.clarityLabApi + '/mesh' + '/v2/accounts', txOptions).then(response => {
          resolve({ contractId: contractId, interface: response.data })
          // commit('addValue', response)
        }).catch(() => {
          axios.get(configuration.stacksApi + '/v2/contracts/interface/' + contractAddress + '/' + contractName + '?proof=0').then(response => {
            resolve({ contractId: contractId, interface: response.data })
          }).catch((error) => {
            reject(error)
          })
        })
      })
    },
    deployContractWithPrivateKey ({ commit, state, dispatch, rootGetters }, data) {
      return new Promise((resolve, reject) => {
        const network = mocknet
        dispatch('daoAuthStore/fetchNoncesFor', data.senderAddress, { root: true }).then((nonces) => {
          const txOptions = {
            codeBody: data.codeBody,
            contractName: data.contractId.split('.')[1],
            appDetails: {
              name: state.appName,
              icon: state.appLogo
            },
            fee: new BigNum(10000),
            senderKey: data.senderKey,
            nonce: new BigNum(nonces.possible_next_nonce),
            network: network
          }
          makeContractDeploy(txOptions).then((transaction) => {
            const txdata = new Uint8Array(transaction.serialize())
            const headers = {
              'Content-Type': 'application/octet-stream'
            }
            axios.post(configuration.clarityLabApi + '/mesh' + '/v2/broadcast', txdata, { headers: headers }).then(response => {
              const result = {
                txId: response.data,
                network: 15,
                assetHash: data.assetHash,
                contractAddress: data.contractAddress,
                contractName: data.contractName,
                functionName: data.functionName,
                functionArgs: data.functionArgs
              }
              resolve(result)
            }).catch((error) => {
              resolve(commit, error)
            })
            if (configuration.network !== 'local') {
              broadcastTransaction(transaction, network).then((result) => {
                result.contractAddress = data.contractAddress
                result.contractName = data.contractName
                result.functionName = data.functionName
                resolve(result)
              }).catch((error) => {
                reject(error)
              })
            }
          })
        })
      })
    },
    deployContractConnect ({ state }, datum) {
      return new Promise((resolve, reject) => {
        let network = mainnet
        if (configuration.network === 'testnet') network = testnet
        const txOptions = {
          codeBody: datum.codeBody,
          contractName: datum.contractId.split('.')[1],
          appDetails: {
            name: state.appName,
            icon: state.appLogo
          },
          network: network,
          finished: (response) => {
            const result = {
              txId: response.txId,
              txRaw: response.txRaw,
              network: 15
            }
            resolve(result)
          }
        }
        openContractDeploy(txOptions).catch((error) => {
          reject(error)
        })
      })
    },
    makeTransferBlockstack ({ state }, data) {
      return new Promise((resolve, reject) => {
        const amount = Math.round(data.amountStx * precision)
        // amount = parseInt(amount, 16)
        const amountBN = new BigNum(amount)
        openSTXTransfer({
          recipient: data.recipient,
          // network: network,
          amount: amountBN,
          network: (configuration.network === 'mainnet') ? mainnet : testnet,
          memo: 'Payment for credits',
          appDetails: {
            name: state.appName,
            icon: state.appLogo
          },
          finished: result => {
            resolve({ result: result })
          }
        }).catch((err) => {
          reject(err)
        })
      })
    },
    deployProjectContract ({ dispatch }, datum) {
      return new Promise((resolve, reject) => {
        if (!datum.fee) datum.fee = contractDeployFee
        let methos = 'deployContractConnect'
        if (configuration.network === 'local') methos = 'deployContractWithPrivateKey'
        dispatch(methos, datum).then((result) => {
          resolve(result)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    callApiDirect ({ dispatch }, txOptions) {
      return new Promise((resolve, reject) => {
        const url = (txOptions.path.indexOf('extended/v1') === -1) ? process.env.VUE_APP_STACKS_API : process.env.VUE_APP_STACKS_API_EXTENDED
        if (txOptions.httpMethod === 'GET') {
          axios.get(url + txOptions.path).then(response => {
            const result = response.data
            resolve(result)
          }).catch((error) => {
            reject(error)
          })
        } else {
          axios.post(url + txOptions.path, txOptions).then(response => {
            const result = response.data
            resolve(result)
          }).catch((error) => {
            reject(error)
          })
        }
      })
    }
    /**
    callApi ({ rootGetters }, txOptions) {
      return new Promise((resolve, reject) => {
        let url = configuration.stacksApi
        if (txOptions.httpPort) url = url.replace('3999', txOptions.httpPort)
        axios.post(configuration.clarityLabApi + '/mesh' + '/v2/accounts', txOptions).then(response => {
          // data.result = utils.jsonFromTxResult(response.data.result)
          const result = cvToJSON(deserializeCV(response.data.result))
          resolve(result)
        }).catch(() => {
          if (txOptions.httpMethod === 'GET') {
            axios.get(url + txOptions.path).then(response => {
              // data.result = utils.jsonFromTxResult(response.data.result)
              const result = response.data
              resolve(result)
            }).catch((error) => {
              reject(error)
            })
          } else {
            axios.post(url + txOptions.path, txOptions).then(response => {
              // data.result = utils.jsonFromTxResult(response.data.result)
              const result = response.data
              resolve(result)
            }).catch((error) => {
              reject(error)
            })
          }
        })
      })
    }
    **/
  }
}
export default daoStacksStore
