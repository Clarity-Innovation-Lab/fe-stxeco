<template>
<b-container fluid class="py-0 my-0">
  <b-navbar variant="" class="py-0 my-0 text-small">
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar class="mx-auto my-0 py-0 text-white">
        <b-nav-item to="/stxdao/extensions" class="my-0 py-0 mr-3 pr-3 border-right">Extensions</b-nav-item>
        <b-nav-item to="/stxdao/proposals" class="my-0 py-0 mr-3 pr-3 border-right">Proposals</b-nav-item>
        <b-nav-item to="/stxdao/membership" class="my-0 py-0">Membership</b-nav-item>
      </b-navbar>
    </b-collapse>
  </b-navbar>
</b-container>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'SecondNavbar',
  props: {
    transparent: Boolean,
    colorOnScroll: Number
  },
  components: {
  },
  data () {
    return {
      iconSN: require('@/assets/img/EAG - WEB UX assets - png/EAG - stacks neon.png'),
      iconGrey: require('@/assets/img/EAG - WEB UX assets - png/EAG - stacks grey.png'),
      toggler: require('@/assets/img/logo.png')
    }
  },
  methods: {
    balance () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return (profile && profile.wallet) ? profile.wallet.balance : 0
    },
    stxAddress () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      if (profile.wallet && profile.wallet.keyInfo.address) {
        return profile.wallet.keyInfo.address.substring(0, 5) + '...' + profile.wallet.keyInfo.address.substring(profile.wallet.keyInfo.address.length - 5)
      }
      return 'n/a'
    },
    startLogout () {
      // this.$emit('updateEventCode', { eventCode: 'connect-logout' })
      this.$store.dispatch('daoAuthStore/startLogout').catch((err) => {
        console.log(err)
        this.$store.commit(APP_CONSTANTS.SET_WEB_WALLET_NEEDED)
      })
    },
    startLogin () {
      // this.$emit('updateEventCode', { eventCode: 'connect-login' })
      const myProfile = this.$store.getters['daoAuthStore/getMyProfile']
      if (myProfile.loggedIn) {
        // this.$emit('connect-login', myProfile)
        this.$store.dispatch('daoAuthStore/startLogout').then(() => {
          this.$store.dispatch('daoAuthStore/startLogin').catch(() => {
            // https://www.hiro.so/wallet/install-web
            this.$store.commit(APP_CONSTANTS.SET_WEB_WALLET_NEEDED)
          })
        })
      } else {
        this.$store.dispatch('daoAuthStore/startLogin').catch(() => {
          // https://www.hiro.so/wallet/install-web
          this.$store.commit(APP_CONSTANTS.SET_WEB_WALLET_NEEDED)
        })
      }
    },
    changeProvider (provider) {
      if (provider) {
        this.$store.commit(APP_CONSTANTS.COMMIT_PROVIDER, provider)
      }
    },
    isActive (route) {
      return (this.$route.name === route) ? 'active' : 'text-light'
    },
    changeNetworkId (networkId) {
      if (networkId && networkId === 'testnet') {
        this.$store.commit(APP_CONSTANTS.COMMIT_NETWORK_ID, networkId)
      } else {
        this.$notify({ type: 'warning', title: 'Networks', text: 'Stacks 2.0 is not yet live!' })
      }
    }
  },
  computed: {
    getTotalDelegatedToMe () {
      return this.$store.getters[APP_CONSTANTS.KEY_GOV_TOKEN_BALANCE_DELEGATED]
    },
    getTokenBalance () {
      return this.$store.getters[APP_CONSTANTS.KEY_GOV_TOKEN_BALANCE]
    },
    getTokenBalanceLocked () {
      return this.$store.getters[APP_CONSTANTS.KEY_GOV_TOKEN_BALANCE_LOCKED]
    },
    isHomePage () {
      return this.$route.name === 'home'
    },
    stxRate () {
      const stxRate = this.$store.getters[APP_CONSTANTS.KEY_STX_RATE]
      return stxRate
    },
    // playMode () {
    // const playMode = this.$store.getters[APP_CONSTANTS.KEY_PLAY_MODE]
    // return playMode
    // },
    provider () {
      const provider = this.$store.getters[APP_CONSTANTS.KEY_PROVIDER]
      return provider
    },
    networkId () {
      const networkId = this.$store.getters[APP_CONSTANTS.KEY_NETWORK_ID]
      return networkId
    },
    username () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile.name || profile.stxAddress
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    },
    accountInfo () {
      const accountInfo = this.$store.getters[APP_CONSTANTS.KEY_ACCOUNT_INFO]
      return accountInfo
    },
    bnsName () {
      const bnsNames = this.$store.getters[APP_CONSTANTS.KEY_BNS_NAMES]
      if (bnsNames && bnsNames.length > 0) return bnsNames[0]
      return this.profile.stxAddress
    }
  }
}
</script>

<style lang="scss">
.play-mode {
  border-top: 0pt solid yellow;
  border-bottom: 1pt solid yellow;
}
.dropdown-item:hover {
  color: #ccc !important;
}
.dropdown-item {
  text-align: left;
  font-weight: 300;
}
.header {
  text-transform: capitalize;
}
.nav-text {
  position: relative;
  top: -6px;
  display: inline-block;
}
.nav-text > a {
  text-align: left;
}
.navbar-text {
  font-weight: 300;
}
</style>
