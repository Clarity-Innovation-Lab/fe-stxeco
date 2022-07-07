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
          <b-tabs
            card
            justified
          >
            <b-tab>
              <template #title>
                <span class="text-bold">Deploy Proposal</span>
              </template>
              <DeployProposalForm :template-proposal="proposal" />
            </b-tab>
            <b-tab
              v-if="step2"
              active
            >
              <template #title>
                <span>Update Proposal</span>
              </template>
              <ProposalForm :template-proposal="proposal" />
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
  computed: {
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    }
  },
  mounted () {
    this.proposal.proposer = this.profile.stxAddress
  },
  methods: {
  }
}
</script>
<style lang="scss" >
</style>
