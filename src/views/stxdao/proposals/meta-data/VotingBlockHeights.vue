<template>
<div v-if="proposalData">
  <b-row class="preview">
    <b-col>
      <b-row>
        <b-col md="4" sm="12">
          <RadialProgressBar :msg="'Voting Ends'" :diameter="200" :completed="500" :total="100"/>
        </b-col>
        <b-col md="8" sm="12"><div>Block {{stacksTipHeight}}</div></b-col>
        <b-col md="4" sm="12">Voting starts at</b-col>
        <b-col md="8" sm="12"><div>Block {{proposalData['start-block-height'].value}}</div></b-col>
        <b-col md="4" sm="12">Voting ends at</b-col>
        <b-col md="8" sm="12"><div>Block {{proposalEnds}}</div></b-col>
        <b-col md="4" sm="12"></b-col>
        <b-col cols="12" class="mt-4 text-small text-center"></b-col>
      </b-row>
    </b-col>
    <b-col>
      <b-row>
        <b-col cols="12">Your Balance</b-col>
        <b-col md="6" sm="12">Unlocked</b-col><b-col md="6" sm="12">{{getTokenBalance}}</b-col>
        <b-col md="6" sm="12">Locked</b-col><b-col md="6" sm="12">{{getTokenBalanceLocked}}</b-col>
        <b-col md="6" sm="12">Delegated</b-col><b-col md="6" sm="12">{{getTotalDelegatedToMe}}</b-col>
      </b-row>
    </b-col>
  </b-row>
  <b-row>
    <b-col class="text-center mt-3">
      Proposed by: {{proposalData.proposer.value}}
    </b-col>
  </b-row>
  <b-row>
    <b-col class="text-center my-2">
      Total Supply: {{getTotalSupply}}
    </b-col>
  </b-row>
  <b-row>
    <b-col class="text-center mb-3">
      <b-button>{{getStatusMessage()}}</b-button>
    </b-col>
  </b-row>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import RadialProgressBar from '@/components/RadialProgressBar'

export default {
  name: 'VotingBlockHeights',
  components: {
    RadialProgressBar
  },
  props: ['proposalData'],
  data: function () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    getStatusMessage () {
      const propData = this.proposalData
      if (propData.concluded.value) {
        if (propData.passed.value) return 'Voting ended, proposal concluded, proposal passed'
        else return 'Voting ended, proposal concluded, proposal failed to pass'
      } else if (this.stacksTipHeight > propData['end-block-height'].value) return 'Voting ended'
      else if (this.stacksTipHeight < propData['start-block-height'].value) return 'Voting starts in ' + (propData['start-block-height'].value - this.stacksTipHeight) + ' blocks'
      else return 'Voting started - cast or delegate your vote!'
    }
  },
  computed: {
    progressData () {
      if (!this.proposalData) return
      const startBlock = this.proposalData['start-block-height'].value
      const started = this.stacksTipHeight > startBlock
      let progressData = {
        msg: 'Voting Ends',
        diameter: 200,
        completed: 50,
        total: 100
      }
      if (!started) {
        progressData = {
          msg: 'Voting Starts',
          diameter: 200,
          completed: this.proposalEnds,
          total: startBlock
        }
      }
      return progressData
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
      const parameters = this.$store.getters[APP_CONSTANTS.KEY_GOV_PARAMETERS]
      const param = parameters.find((o) => o.name === 'proposal-duration')
      if (!param) return 0
      return Number(this.proposalData['start-block-height'].value) + Number(param.value)
    },
    stacksTipHeight () {
      const blockchainInfo = this.$store.getters[APP_CONSTANTS.KEY_BLOCKCHAIN_INFO]
      if (!blockchainInfo) return 0
      return Number(blockchainInfo.stacks_tip_height)
    }
  }
}
</script>

<style >
</style>
