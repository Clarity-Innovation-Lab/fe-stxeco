<template>
<b-container class="">
  <b-row class="my-4">
    <b-col align-self="start">
      <h2><span>Something to Propose?</span></h2>
      <ol>
        <li>Deploy a proposal contract</li>
        <li>Enter supporting information</li>
      </ol>
      <div>
        <b-tabs card justified>
          <b-tab>
            <template #title>
              <span class="text-bold">Deploy Proposal</span>
            </template>
            <DeployProposalForm :proposal="proposal"/>
          </b-tab>
          <b-tab active v-if="step2">
            <template #title>
              <span>Update Proposal</span>
            </template>
            <ProposalForm :proposal="proposal"/>
          </b-tab>
        </b-tabs>
      </div>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import DeployProposalForm from './meta-data/DeployProposalForm'
import ProposalForm from './meta-data/ProposalForm'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'CreateProposal',
  components: {
    ProposalForm,
    DeployProposalForm
  },
  data () {
    return {
      step1: true,
      step2: false,
      proposal: {
        proposer: null,
        onChain: true
      }
    }
  },
  mounted () {
    this.proposal.proposer = this.profile.stxAddress
  },
  methods: {
  },
  computed: {
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    }
  }
}
</script>
<style lang="scss" >
</style>
