import axios from 'axios'

const configuration = {
  network: process.env.VUE_APP_NETWORK,
  clarityLabApi: process.env.VUE_APP_CLARITYLAB_API,
  clarityLabStacksApi: process.env.VUE_APP_STACKS_API
}

const daoSIPStore = {
  namespaced: true,
  state: {
    readmes: [],
    issues: [],
    pullRequests: []
  },
  getters: {
    getIssue: state => id => {
      const issue = state.issues.find((p) => p.id === id)
      return issue
    },
    getIssues: state => {
      return state.issues
    },
    getPullRequests: state => {
      return state.pullRequests
    },
    getReadme: state => pathname => {
      return state.readmes.find((o) => o.pathname === pathname)
    }
  },
  mutations: {
    setReadme (state, page) {
      const index = state.readmes.findIndex((o) => o.pathname === page.pathname)
      if (index > -1) {
        state.readmes.splice(index, 1, page)
      } else {
        state.readmes.splice(0, 0, page)
      }
    },
    setIssues (state, issues) {
      state.issues = issues
    },
    setPullRequests (state, pullRequests) {
      state.pullRequests = pullRequests
    }
  },
  actions: {
    fetchSIPContent ({ state, commit }, pathname) {
      return new Promise((resolve, reject) => {
        if (state.readmes.find((o) => o.pathname === pathname)) {
          resolve(state.readmes.find((o) => o.pathname === pathname))
          return
        }
        let url = configuration.clarityLabApi + '/mesh/v2/gh-spis-readme'
        if (pathname && pathname !== 'readme') {
          url += '?pathname=sips' + pathname
        }
        axios.get(url).then(response => {
          commit('setReadme', { pathname: pathname, content: response.data })
          resolve({ pathname: pathname, content: response.data })
        }).catch((error) => {
          reject(error)
        })
      })
    },
    fetchIssues ({ commit }) {
      return new Promise((resolve, reject) => {
        axios.get(configuration.clarityLabApi + '/mesh/v2/gh-issues').then(response => {
          commit('setIssues', response.data)
          resolve(response.data)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    fetchPullRequests ({ commit }) {
      return new Promise((resolve, reject) => {
        axios.get(configuration.clarityLabApi + '/mesh/v2/gh-pull-requests').then(response => {
          commit('setPullRequests', response.data)
          resolve(response.data)
        }).catch((error) => {
          reject(error)
        })
      })
    }
  }
}
export default daoSIPStore
