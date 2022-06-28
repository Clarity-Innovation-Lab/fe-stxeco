<template>
<section class="my-5" v-if="loaded">
  <b-container class="my-5 border-bottom">
    <b-row class="my-2">
      <b-col cols="12">
        <h2>Delegation</h2>
        <!-- <p>Ping us on <a href="https://discord.com/channels/621759717756370964/971037457661444156" target="_blank">Discord</a> to get involved!</p> -->
      </b-col>
    </b-row>
    <GovernanceTokenBalance />
  </b-container>
  <b-container class="my-2">
    <b-row >
      <b-col cols="6">
        <DelegationCard/>
      </b-col>
      <b-col cols="6">
        <SubmissionCard/>
      </b-col>
    </b-row>
  </b-container>
</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import GovernanceTokenBalance from '@/views/stxdao/membership/GovernanceTokenBalance'
import SubmissionCard from './SubmissionCard'
import DelegationCard from './DelegationCard'

export default {
  name: 'Delegation',
  components: {
    GovernanceTokenBalance,
    SubmissionCard,
    DelegationCard
  },
  data () {
    return {
      stxAddress: null,
      loaded: true
    }
  },
  mounted () {
    this.stxAddress = this.profile.stxAddress
    this.$store.dispatch('daoMembershipStore/fetchDelegateData')
  },
  methods: {
    next () {
      return true
    }
  },
  computed: {
    getProposeFactor () {
      return this.$store.getters[APP_CONSTANTS.KEY_GOV_PROPOSE_FACTOR]
    },
    getCanPropose () {
      return this.$store.getters[APP_CONSTANTS.KEY_GOV_CAN_PROPOSE]
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
