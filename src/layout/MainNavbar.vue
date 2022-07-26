<template>
  <b-container fluid>
    <b-navbar
      toggleable="md"
      variant="transparent"
      class=""
    >
      <b-navbar-brand href="#">
        <div class="tagline">
          <b-link to="/">
            <img
              class="mr-30"
              width="30px"
              :src="iconGrey"
            > e<span class="tagline1">DAO</span>
          </b-link>
        </div>
      </b-navbar-brand>

      <!-- <ExchangeRates class="ml-auto nav-text d-block d-md-none"/> -->

      <b-navbar-toggle
        class=""
        target="nav-collapse"
      >
        <template #default="{ expanded }">
          <b-icon
            v-if="expanded"
            width="20px"
            height="30px"
            icon="chevron-contract"
          />
          <img
            v-else
            width="20px"
            :src="toggler"
          >
        </template>
      </b-navbar-toggle>

      <b-collapse
        id="nav-collapse"
        is-nav
      >
        <b-navbar class="ml-auto">
          <b-nav-item
            to="/stxdao/sip-landing"
            class="nav-text"
          >
            SIP
          </b-nav-item>
          <b-nav-item
            to="/stxdao/proposals"
            class="nav-text"
          >
            DAO
          </b-nav-item>
          <!-- <exchange-rates class="pl-0 nav-text"/> -->
          <b-nav-item-dropdown
            v-if="profile.loggedIn"
            class="nav-text"
            right
            caret
          >
            <template #button-content>
              <img width="40px"
                :src="walletGrey"
                class="pointer icon"
              >
            </template>
            <b-dropdown-item>{{ bnsName }}</b-dropdown-item>
            <b-dropdown-divider />
            <b-dropdown-item
              v-if="profile.accountInfo"
              class="text-right text-small"
            >
              <span>Balance: {{ accountInfo.balance }} STX</span>
            </b-dropdown-item>
            <b-dropdown-item to="/stxdao/sip-landing">
              <span>SIPs</span>
            </b-dropdown-item>
            <b-dropdown-item to="/stxdao/proposals">
              <span>Proposals</span>
            </b-dropdown-item>
            <b-dropdown-item>
              <span @click="startLogin()">Switch Account</span>
            </b-dropdown-item>
            <b-dropdown-item>
              <span @click="startLogout()">Logout</span>
            </b-dropdown-item>
            <b-dropdown-divider />
          <!--
          <b-dropdown-item>
            <h6>Governance Token</h6>
            <b-row><b-col cols="4">Unlocked</b-col><b-col cols="8">{{getTokenBalance}}</b-col></b-row>
            <b-row><b-col cols="4">Locked</b-col><b-col cols="8">{{getTokenBalanceLocked}}</b-col></b-row>
            <b-row><b-col cols="4">Delegated</b-col><b-col cols="8">{{getTotalDelegatedToMe}}</b-col></b-row>
          </b-dropdown-item>
        -->
          </b-nav-item-dropdown>
          <b-nav-item
            v-else
            class="nav-text"
          >
            <span @click="startLogin()">Connect Wallet</span>
          </b-nav-item>
        </b-navbar>
      </b-collapse>
    </b-navbar>
  </b-container>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'MainNavbar',
  components: {
  },
  props: {
    transparent: Boolean,
    colorOnScroll: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      walletGrey: require('@/assets/img/EAG - WEB UX assets - png/EAG - wallet grey.png'),
      iconSN: require('@/assets/img/EAG - WEB UX assets - png/EAG - stacks neon.png'),
      iconGrey: require('@/assets/img/EAG - WEB UX assets - png/EAG - stacks grey.png'),
      toggler: require('@/assets/img/logo.png')
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
  }
}
</script>

<style>
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
