<template>
<section>
  <b-container class="my-5" v-if="proposal">
    <h4>Proposal: <span class="text-warning">{{proposal.title}}</span></h4>
    <p><b-link to="/stxdao/proposals"><b-icon icon="chevron-double-left"/>back</b-link></p>
    <VotingBlockHeights :proposalData="proposal.proposalData" />

    <b-tabs card justified class="mt-5">
      <b-tab>
        <template #title>
          <span class="text-bold">Proposal Contract</span>
        </template>
        <div v-if="proposal && proposal.proposalContract">
          <pre class="source-code my-4" v-html="proposal.proposalContract.source_code"></pre>
        </div>
      </b-tab>
      <b-tab >
        <template #title>
          <span>Proposal Info</span>
        </template>
        <ProposalMetaDisplay :proposal="proposal"/>
      </b-tab>
    </b-tabs>
  </b-container>
  <b-container v-else>Proposal not found?</b-container>
</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import ProposalMetaDisplay from './meta-data/ProposalMetaDisplay'
import VotingBlockHeights from './meta-data/VotingBlockHeights'

export default {
  name: 'Proposal',
  components: {
    ProposalMetaDisplay,
    VotingBlockHeights
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
  },
  computed: {
    isSubmitted () {
      return this.proposal.proposalData
    },
    proposal () {
      const proposal = this.$store.getters[APP_CONSTANTS.KEY_PROPOSAL](this.$route.params.proposalId)
      return proposal
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
