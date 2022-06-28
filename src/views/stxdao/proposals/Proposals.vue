<template>
<section v-if="loaded">
  <b-container class="my-5">
    <b-row class="mb-5 text-center">
      <b-col cols="12">
        <ProposalFilters />
      </b-col>
    </b-row>
    <b-row class="my-2 text-left">
      <b-col cols="12">
        <b-table striped hover :items="values()" :fields="fields()" class="">
          <template #cell(Proposal)="data">
            <b-link class="text-info" variant="warning" v-on:click="openProposal(data)" v-html="data.value"></b-link>
          </template>
          <template #cell(Status)="data">
            <b-link class="text-info pointer" v-b-tooltip.hover="{ variant: 'dark' }" :title="getStatusTip(data.value)">{{data.value}}</b-link>
          </template>
          <template #cell(Proposer)="data">
            <OwnerInfo :owner="data.value" />
          </template>
          <template #cell(Actions)="data">
            <b-link v-if="canEditProposal(data)" class="mr-2 text-info" variant="warning" v-on:click="editProposal(data)"><span>update</span></b-link>
            <b-link v-else-if="!isSubmitted(data)" class="mr-2 text-info" variant="warning" v-on:click="editProposal(data)"><span>open</span></b-link>
            <b-link v-if="canSubmitProposal(data)" class="mr-2 text-info" variant="warning" v-on:click="submitProposal(data)">submit</b-link>
            <b-link v-if="isSubmitted(data)" class="mr-2 text-info" variant="warning" v-on:click="openProposal(data)">{{getStatusMessage(data)}}</b-link>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-container>
</section>
<section v-else-if="!loaded && !proposals">
  <b-container class="my-5">No proposal found..</b-container>
</section>
<section v-else>
  <b-container class="my-5">Querying blockchain for proposals..</b-container>
</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import OwnerInfo from '@/components/OwnerInfo'
import ProposalFilters from './filter/ProposalFilters'
import { DateTime } from 'luxon'

export default {
  name: 'Proposals',
  components: {
    OwnerInfo,
    ProposalFilters
  },
  data () {
    return {
      proposalFlowId: process.env.VUE_APP_DAO_PROPOSAL_FLOW_ID,
      loaded: false
    }
  },
  mounted () {
    this.stxAddress = this.profile.stxAddress
    this.loaded = true
  },
  methods: {
    getStatusMessage (data) {
      const proposal = this.proposals[data.index]
      const propData = proposal.proposalData
      if (propData && propData.concluded.value) {
        if (propData.passed.value) return 'Proposal Passed'
        else return 'Proposal failed'
      } else if (this.stacksTipHeight > propData['end-block-height'].value) return 'Voting ended'
      else if (this.stacksTipHeight < propData['start-block-height'].value) return 'Starts in ' + (propData['start-block-height'].value - this.stacksTipHeight) + ' blocks.'
      else return 'Cast your vote!'
    },
    getStatusTip (status) {
      if (status === 'draft') {
        return 'Proposal in draft status and can still be edited'
      } else if (status === 'deployed') {
        return 'Proposal contract is deployed but not yet submitted to the DAO'
      } else if (status === 'submitted') {
        return 'Proposal contract has been submitted to the DAO'
      } else {
        return 'Unknown status'
      }
    },
    openProposal (data) {
      const proposal = this.proposals[data.index]
      if (proposal.contractId) {
        this.$router.push('/stxdao/proposals/' + proposal.contractId)
      } else {
        this.$router.push('/stxdao/proposals/' + proposal.id)
      }
    },
    editProposal (data) {
      const proposal = this.proposals[data.index]
      if (proposal.status === 'draft') {
        this.$router.push('/stxdao/proposals/update/' + proposal.id)
      } else if (proposal.status === 'deployed') {
        this.$router.push('/stxdao/proposals/' + proposal.contractId)
      } else {
        this.$router.push('/stxdao/proposals/' + proposal.contractId)
      }
    },
    canEditProposal (data) {
      const proposal = this.proposals[data.index]
      return (!proposal.proposalData && (proposal.status === 'draft'))
    },
    canSubmitProposal (data) {
      const canPropose = this.$store.getters[APP_CONSTANTS.KEY_GOV_CAN_PROPOSE]
      const proposal = this.proposals[data.index]
      return (!proposal.proposalData && (proposal.status === 'deployed' && canPropose))
    },
    submitProposal (data) {
      const proposal = this.proposals[data.index]
      this.$router.push('/stxdao/proposals/submit/' + proposal.contractId)
    },
    isSubmitted (data) {
      const proposal = this.proposals[data.index]
      return proposal.proposalData
    },
    canDeployProposal (data) {
      const proposal = this.proposals[data.index]
      return (proposal.status === 'draft')
    },
    fields () {
      return [
        {
          key: 'Proposal',
          sortable: true
        },
        {
          key: 'Proposer',
          sortable: true
        },
        {
          key: 'Status',
          sortable: true
        },
        {
          key: 'Date',
          sortable: true
        },
        {
          key: 'Actions'
        }
      ]
    },
    values () {
      if (!this.proposals) return []
      const $self = this
      let mapped = []
      mapped = this.proposals.map(function (proposal) {
        return {
          Proposal: proposal.title,
          Proposer: proposal.proposer,
          Status: proposal.status,
          Date: DateTime.fromMillis(proposal.created).toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
          Actions: $self.canEdit(proposal)
        }
      })
      return mapped
    },
    next () {
      return true
    },
    canEdit (proposal) {
      return this.profile.stxAddress === proposal.proposer && proposal.status === 'draft'
    }
  },
  computed: {
    canPropose () {
      return this.$store.getters[APP_CONSTANTS.KEY_GOV_CAN_PROPOSE]
    },
    proposals () {
      const proposals = this.$store.getters[APP_CONSTANTS.KEY_PROPOSALS]
      return proposals
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    },
    stacksTipHeight () {
      const blockchainInfo = this.$store.getters[APP_CONSTANTS.KEY_BLOCKCHAIN_INFO]
      if (!blockchainInfo) return 0
      return Number(blockchainInfo.stacks_tip_height)
    }
  }
}
</script>
<style lang="scss">
</style>
