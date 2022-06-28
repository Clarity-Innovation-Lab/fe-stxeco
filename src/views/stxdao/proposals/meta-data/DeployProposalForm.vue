<template>
<b-container v-if="proposal">
  <b-row class="mb-4">
    <b-col>
      <DeployContractFromFile />
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import DeployContractFromFile from './DeployContractFromFile'
import { DateTime } from 'luxon'

export default {
  name: 'DeployProposalForm',
  components: {
    DeployContractFromFile
  },
  props: ['proposal'],
  data: function () {
    return {
      loaded: false,
      preview: true,
      errors: [],
      formSubmitted: false,
      showErrors: false
    }
  },
  mounted () {
    this.loaded = true
  },
  methods: {
    toggleChainMode: function (tog) {
      if (!tog) {
        this.proposal.onChain = false
      } else {
        this.proposal.onChain = true
      }
    },
    save: function () {
      this.errors = this.getErrors()
      this.formSubmitted = true
      this.showErrors = false
      if (this.errors.length > 0) {
        this.showErrors = true
        return
      }
      if (!this.proposal.created) this.proposal.created = DateTime.now().ts
      if (!this.proposal.updated) this.proposal.updated = DateTime.now().ts
      if (!this.proposal.status) this.proposal.status = 'draft'
      this.$store.dispatch('daoProposalStore/saveProposal', this.proposal).then((result) => {
        this.$emit('proposals', { opcode: 'proposal-saved', proposal: this.proposal })
        this.$notify({ type: 'success', title: 'Proposal Saved', text: 'Proposal save. Status: ' + this.proposal.status })
      })
    },
    getErrors () {
      const errors = []
      if (!this.proposal.title) errors.push('Title is required')
      if (!this.proposal.description) errors.push('Description is required')
      if (!this.proposal.proposer) errors.push('description is required')
      if (this.proposal.onChain && !this.proposal.contractId) errors.push('Contrct id is required for on chain proposals')
      return errors
    },
    canDelete () {
      return this.profile.stxAddress === this.proposal.proposer && this.proposal.status === 'draft'
    }
  },
  computed: {
    isValid () {
      return this.getErrors().length === 0
    },
    created: function () {
      return DateTime.now().toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    },
    proposalContractIdState () {
      if (!this.formSubmitted && this.proposal.onChain) return null
      return (this.proposal.contractId && this.proposal.contractId.length > 2)
    },
    proposalTitleState () {
      if (!this.formSubmitted && !this.proposal.title) return null
      return (this.proposal.title && this.proposal.title.length > 2)
    },
    proposalProposerState () {
      if (!this.formSubmitted && !this.proposal.proposer) return null
      return (this.proposal.proposer && this.proposal.proposer.length > 2)
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    }
  }
}
</script>

<style >
</style>
