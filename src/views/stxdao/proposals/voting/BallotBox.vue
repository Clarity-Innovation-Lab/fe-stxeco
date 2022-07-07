<template>
  <div v-if="proposal.proposalData && votingInProgress">
    <b-row>
      <b-col
        v-if="votingInProgress"
        cols="12"
      >
        <h4>Voting in Progress -> Block {{ stacksTipHeight }}</h4>
        <div class="progress">
          <div
            class="progress-bar progress-bar-striped"
            role="progressbar"
            :style="'width:' + votingProgressPercentage + '%'"
            :aria-valuenow="votingProgressPercentage"
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
        <div class="d-flex justify-content-between text-small">
          <div>{{ proposal.proposalData.startBlockHeight }}</div>
          <div>{{ proposalEnds }}</div>
        </div>
      </b-col>
      <b-col
        v-else
        class="text-center mb-3"
      >
        <b-button>{{ getStatusMessage() }}</b-button>
      </b-col>
    </b-row>
    <b-row v-if="canVote">
      <b-col class="my-5 text-center">
        <div class="d-flex justify-content-around">
          <div>
            <b-button
              variant="success"
              @click="openAmountDialog(true)"
            >
              FOR
            </b-button>
          </div>
          <h2>Cast your Vote</h2>
          <div>
            <b-button
              variant="info"
              @click="openAmountDialog(false)"
            >
              AGAINST
            </b-button>
          </div>
        </div>
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col class="my-5 text-center">
        <div class="d-flex justify-content-around">
          No unlocked governance tokens
        </div>
      </b-col>
    </b-row>
    <b-modal
      id="amount-modal"
      size="lg"
      centered
    >
      <AmountSelection
        :vfor="vfor"
        :title="proposal.title"
        @update="update"
      />
      <template
        #modal-footer
        class="text-center"
      >
        <div class="w-100" />
      </template>
    </b-modal>
  </div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import AmountSelection from './AmountSelection'

export default {
  name: 'BallotBox',
  components: {
    AmountSelection
  },
  props: ['proposal'],
  data: function () {
    return {
      vfor: null,
      amount: null
    }
  },
  computed: {
    proposalEnds () {
      return this.$store.getters[APP_CONSTANTS.KEY_PROPOSAL_ENDS_AT_HEIGHT](this.proposal.contractId)
    },
    canVote () {
      return this.$store.getters[APP_CONSTANTS.KEY_GOV_TOKEN_BALANCE_SPENDABLE]
    },
    votingInProgress () {
      return this.$store.getters[APP_CONSTANTS.KEY_PROPOSAL_VOTING_IN_PROGRESS]
    },
    votingProgressPercentage () {
      const current = this.stacksTipHeight - this.proposal.proposalData.startBlockHeight
      const final = this.proposal.proposalData.endBlockHeight - this.proposal.proposalData.startBlockHeight
      return (current / final) * 100
    },
    stacksTipHeight () {
      return this.$store.getters[APP_CONSTANTS.KEY_PROPOSAL_STACKS_TIP_HEIGHT]
    }
  },
  mounted () {
    if (!this.proposal.proposalData) {
      this.$store.dispatch('daoProposalStore/fetchProposalFromChain', this.proposal.contractId)
    }
  },
  methods: {
    getStatusMessage () {
      const propData = this.proposal.proposalData
      if (propData.concluded.value) {
        if (propData.passed.value) return 'Voting ended, proposal concluded, proposal passed'
        else return 'Voting ended, proposal concluded, proposal failed to pass'
      } else if (this.stacksTipHeight > propData.endBlockHeight) return 'Voting ended'
      else if (this.stacksTipHeight < propData.startBlockHeight) return 'Voting starts in ' + (propData.startBlockHeight - this.stacksTipHeight) + ' blocks'
      else return 'Voting started - cast or delegate your vote!'
    },
    openAmountDialog (vfor) {
      this.vfor = vfor
      this.$bvModal.show('amount-modal')
    },
    update (data) {
      this.$bvModal.hide('amount-modal')
      if (data.amount) this.amount = data.amount
      this.castVote()
    },
    castVote () {
      const vote = {
        proposalContractId: this.proposal.contractId,
        amount: this.amount,
        vfor: this.vfor
      }
      this.$store.dispatch('daoProposalStore/castVote', vote).then((result) => {
        this.$notify({ type: 'success', title: 'Vote Cast', text: 'Your vote has been sent to the DAO' })
        this.result = result
      })
    },
    concludeVote () {
      const proposal = this.proposal
      proposal.status = 'submitted'
      proposal.startHeight = this.startHeight + this.stacksTipHeight + this.minStartHeight
      this.$store.dispatch('daoProposalStore/submitProposal', proposal).then((result) => {
        this.$notify({ type: 'success', title: 'Proposal Submitted', text: 'Proposal has been submitted to the DAO' })
        this.result = result
      })
    }
  }
}
</script>

<style >
</style>
