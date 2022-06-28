<template>
<section v-if="contracts">
  <b-container class="my-5">
    <b-row class="mb-5 text-center">
      <b-col cols="12">
        <h2>STX DAO Contracts</h2>
      </b-col>
    </b-row>
    <b-row class="my-2 text-left" v-for="(proposal, index) in proposals" :key="index">
      <b-col cols="3">Contract</b-col>
      <b-col cols="9">{{proposal.contractId.split('.')[1]}}</b-col>
    </b-row>
  </b-container>
</section>
<section v-else>No Proposals in the system</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'ProposalContracts',
  components: {
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    showABI (contractId) {
      return contractId.indexOf('edp005-dao-change-sample-config') > -1
    }
  },
  computed: {
    proposalInterface () {
      const contracts = this.$store.getters[APP_CONSTANTS.KEY_PROPOSAL_TRAIT_INTERFACE]
      return contracts
    },
    proposals () {
      const proposals = this.$store.getters[APP_CONSTANTS.KEY_PROPOSALS]
      return proposals
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
