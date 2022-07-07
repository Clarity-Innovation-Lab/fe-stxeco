<template>
  <div
    v-if="proposal"
    class="preview mb-5"
  >
    <b-row>
      <b-col>
        <b-row>
          <b-col cols="4">
            <div>Now at</div>
          </b-col>
          <b-col cols="8">
            <div>{{ stacksTipHeight }}</div>
          </b-col>
          <b-col cols="4">
            <div>Voting starts:</div>
          </b-col>
          <b-col cols="8">
            <div>{{ proposal.proposalData.startBlockHeight }}</div>
          </b-col>
          <b-col cols="4">
            <div>Voting ends:</div>
          </b-col>
          <b-col cols="8">
            <div>{{ proposalEnds }}</div>
          </b-col>
        </b-row>
      </b-col>
      <b-col>
        <b-row>
          <b-col cols="12">
            Your Balance
          </b-col>
          <b-col
            md="6"
            sm="12"
          >
            Unlocked
          </b-col><b-col
            md="6"
            sm="12"
          >
            {{ getTokenBalance }}
          </b-col>
          <b-col
            md="6"
            sm="12"
          >
            Locked
          </b-col><b-col
            md="6"
            sm="12"
          >
            {{ getTokenBalanceLocked }}
          </b-col>
          <b-col
            md="6"
            sm="12"
          >
            Delegated
          </b-col><b-col
            md="6"
            sm="12"
          >
            {{ getTotalDelegatedToMe }}
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="text-center mt-3">
        Proposed by: {{ proposal.proposalData.proposer }}
      </b-col>
    </b-row>
    <b-row>
      <b-col class="text-center my-2">
        Total Supply: {{ getTotalSupply }}
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'VotingProgress',
  components: {
  },
  props: ['proposal'],
  data: function () {
    return {
    }
  },
  computed: {
    votingInProgress () {
      return this.$store.getters[APP_CONSTANTS.KEY_PROPOSAL_VOTING_IN_PROGRESS]
    },
    getTotalDelegatedToMe () {
      return this.$store.getters[APP_CONSTANTS.KEY_GOV_TOKEN_BALANCE_DELEGATED]
    },
    getTokenBalance () {
      return this.$store.getters[APP_CONSTANTS.KEY_GOV_TOKEN_BALANCE]
    },
    getTokenBalanceLocked () {
      return this.$store.getters[APP_CONSTANTS.KEY_GOV_TOKEN_BALANCE_LOCKED]
    },
    getTotalSupply () {
      return this.$store.getters[APP_CONSTANTS.KEY_GOV_TOKEN_SUPPLY]
    },
    proposalEnds () {
      return this.$store.getters[APP_CONSTANTS.KEY_PROPOSAL_ENDS_AT_HEIGHT](this.proposal.contractId)
    },
    stacksTipHeight () {
      return this.$store.getters[APP_CONSTANTS.KEY_PROPOSAL_STACKS_TIP_HEIGHT]
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style >
</style>
