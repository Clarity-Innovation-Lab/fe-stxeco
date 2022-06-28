<template>
<section id="homepage" class="my-5 text-center" v-if="loaded">
  <b-container class="text-center">
    <b-row>
      <b-col md="6" sm="6" class="my-2">
        <StxEcoDisplayCard :bgImage="bgImage2" :title="'Ecosystem DAO'" :subtitle="'A Contributors DAO on Stacks'" :path="'/stxdao/membership'" label="Memebrship" />
      </b-col>
      <b-col md="6" sm="6" class="my-2">
        <StxEcoDisplayCard :bgImage="bgImage1" :title="'Make a Change'" :subtitle="'Submit a proposal'" :path="'/stxdao/proposals'" label="Proposals" />
      </b-col>
      <b-col md="6" sm="6" class="my-2">
        <StxEcoDisplayCard :bgImage="bgImage3" :title="'Cast Your Vote'" :subtitle="'Express your view'" :path="'/stxdao/voting'" label="Vote" />
      </b-col>
      <b-col md="6" sm="6" class="my-2">
        <StxEcoDisplayCard :bgImage="bgImage4" :title="'Representation'" :subtitle="'Find a representative'" :path="'/stxdao/delegation'" label="Delegation" />
      </b-col>
    </b-row>
    <b-row>
      <b-col md="6" sm="6" class="my-2">
        <LauncherDisplayCard />
      </b-col>
      <b-col md="6" sm="6" class="my-2" v-if="showConnect">
        <ConnectCard />
      </b-col>
    </b-row>
  </b-container>
</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import LauncherDisplayCard from './launcher/DisplayCard'
import StxEcoDisplayCard from './stxdao/DisplayCard'
import ConnectCard from '@/views/DisplayCard'

export default {
  name: 'Homepage',
  components: {
    LauncherDisplayCard,
    StxEcoDisplayCard,
    ConnectCard
  },
  data () {
    return {
      loaded: false,
      redirectUrl: null,
      bgImage1: require('@/assets/img/thinker.jpg'),
      bgImage2: require('@/assets/img/membership.jpg'),
      bgImage3: require('@/assets/img/vote.jpg'),
      bgImage4: require('@/assets/img/seats.jpg')
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
    showConnect () {
      return false
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
