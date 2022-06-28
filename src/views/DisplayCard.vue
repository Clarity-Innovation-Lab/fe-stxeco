<template>
<b-card-group>
  <b-card header-tag="header" footer-tag="footer" class="home-card"
    overlay
    :style="cardBgStyle"
    :img-src="cardBg"
    img-alt="Photo by Mitchell Luo on Unsplash"
    text-variant="white"
  >
    <b-card-text v-if="profile.loggedIn" class="mt-5">
      <div>
        <h2 class="mb-3">Connected</h2>
        <p>Claim a Unique Bitcoin Username</p>
        <p>&nbsp;</p>
      </div>
    </b-card-text>
    <b-card-text v-else class="mt-5">
      <div style="min-height: 30vh" class="text-center">
        <h2 class="mb-3">Not Connected</h2>
        <div><p>Download the Hiro web wallet to connect to the Stacks Blockchain</p></div>
        <div><p><a class="text-info pointer mx-4" :href="webWalletLink" target="_blank">Hiro Web Wallet <b-icon class="ml-3" icon="arrow-up-right-square-fill"/></a></p></div>
      </div>
      <div class="text-center" v-if="redirectUrl">
        <div><a :href="redirectUrl">Back whence thy came!</a></div>
      </div>
    </b-card-text>
    <template #footer>
      <div class="text-center" v-if="profile.loggedIn">
        <b-button variant="light"><a href="https://btc.us/">Claim BTC Address</a></b-button>
      </div>
      <div class="text-center" v-else-if="webWalletNeeded">
        <b-button variant="light"><a class="text-white pointer mx-4" :href="webWalletLink" target="_blank">Stacks Web Wallet <b-icon class="ml-3" icon="arrow-up-right-square-fill"/></a></b-button>
      </div>
      <div class="text-center" v-else>
        <b-button variant="light" @click.prevent="startLogin()">Connect Wallet</b-button>
      </div>
    </template>
  </b-card>
</b-card-group>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'Homepage',
  components: {
  },
  data () {
    return {
      cardBg: require('@/assets/img/ecosys.jpg'),
      loaded: false,
      redirectUrl: null
    }
  },
  mounted () {
    this.loaded = true
  },
  methods: {
    startLogin () {
      // this.$emit('updateEventCode', { eventCode: 'connect-login' })
      const myProfile = this.$store.getters['daoAuthStore/getMyProfile']
      if (myProfile.loggedIn) {
        this.$emit('connect-login', myProfile)
      } else {
        this.$store.dispatch('daoAuthStore/startLogin').catch(() => {
          // https://www.hiro.so/wallet/install-web
          this.$store.commit(APP_CONSTANTS.SET_WEB_WALLET_NEEDED)
        })
      }
    }
  },
  computed: {
    cardBgStyle () {
      return {
        height: '500px',
        'margin-top': '0px',
        'background-repeat': 'repeat-y',
        'background-size': '355px',
        'background-position': 'center 70%'
      }
    },
    configuration () {
      return this.$store.getters[APP_CONSTANTS.KEY_DAO_CONFIGURATION]
    },
    getBalance () {
      return (this.profile && this.profile.accountInfo) ? this.profile.accountInfo.balance : 0
    },
    webWalletLink () {
      if (this.$browserDetect.isFirefox) {
        return this.$store.getters[APP_CONSTANTS.KEY_WEB_WALLET_LINK_FIREFOX]
      }
      return this.$store.getters[APP_CONSTANTS.KEY_WEB_WALLET_LINK_CHROME]
    },
    webWalletNeeded () {
      const webWalletNeeded = this.$store.getters[APP_CONSTANTS.KEY_WEB_WALLET_NEEDED]
      return webWalletNeeded
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    }
  }
}
</script>
<style lang="scss">
</style>
