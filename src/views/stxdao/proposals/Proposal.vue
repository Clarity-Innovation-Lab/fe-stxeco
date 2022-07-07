<template>
  <section>
    <b-container
      v-if="proposal"
      class="my-5"
    >
      <div class="border-bottom pb-5 mb-5 w-100 d-flex justify-content-between text-small">
        <h4>Proposal: <span class="">{{ proposal.title }}</span></h4>
        <p>
          <b-link to="/stxdao/proposals">
            <b-icon icon="chevron-double-left" />back
          </b-link>
          <span
            class="ml-4 pointer text-right"
            @click="showPropData = !showPropData"
          >show info</span>
        </p>
      </div>
      <div v-if="showPropData">
        <VotingProgress
          :proposal="proposal"
          class="text-small"
        />
      </div>
      <div>
        <BallotBox
          :proposal="proposal"
          class="text-small"
        />
      </div>

      <b-tabs
        card
        justified
        class="mt-5"
      >
        <b-tab>
          <template #title>
            <span class="text-bold">Proposal Contract</span>
          </template>
          <div v-if="proposal && proposal.proposalContract">
            <pre
              class="source-code my-4"
              v-html="proposal.proposalContract.source_code"
            />
          </div>
        </b-tab>
        <b-tab>
          <template #title>
            <span>Proposal Info</span>
          </template>
          <ProposalMetaDisplay :proposal="proposal" />
        </b-tab>
      </b-tabs>
    </b-container>
    <b-container v-else>
      Proposal not found?
    </b-container>
  </section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import ProposalMetaDisplay from './meta-data/ProposalMetaDisplay'
import VotingProgress from './voting/VotingProgress'
import BallotBox from './voting/BallotBox'

export default {
  name: 'Proposal',
  components: {
    ProposalMetaDisplay,
    VotingProgress,
    BallotBox
  },
  data () {
    return {
      showPropData: false
    }
  },
  computed: {
    isSubmitted () {
      return this.proposal.proposalData
    },
    proposal () {
      const proposal = this.$store.getters[APP_CONSTANTS.KEY_PROPOSAL](this.$route.params.proposalId)
      return proposal
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
</style>
