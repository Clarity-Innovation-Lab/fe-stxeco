<template>
  <b-container v-if="proposal">
    <b-row class="mb-4 border">
      <b-col
        cols="12"
        class="text-small text-primary"
      >
        <b-card>
          <div class="">
            <b-link
              :class="(showNoop) ? 'text-underline' : 'text-secondary'"
              @click="showUpload = false; showNoop = true"
            >
              <b-icon icon="chevron-right" />Community Vote - the vote is for off-chain action
            </b-link>
          </div>
          <div class="mt-2">
            <b-link
              :class="(showUpload) ? 'text-underline' : 'text-secondary'"
              @click="showUpload = true; showNoop = false"
            >
              <b-icon icon="chevron-right" />Full DAO Proposal - the proposal performs on-chain actions
            </b-link>
          </div>
        </b-card>
      </b-col>
      <b-col
        v-if="showNoop"
        cols="12"
      >
        <b-card>
          Deploy a standard vote only proposal.
          <pre
            class="text-xsmall py-4 my-3 source-code"
            v-html="contractSource"
          />
          <div class="mt-3 d-flex justify-content-start">
            <b-button
              class="mr-3"
              @click="deployContract()"
            >
              Deploy
            </b-button>
          </div>
        </b-card>
      </b-col>
      <b-col
        v-if="showUpload"
        cols="12"
      >
        <b-card>
          <DeployContractFromFile />
        </b-card>
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
  props: ['templateProposal'],
  data: function () {
    return {
      proposal: null,
      showUpload: false,
      showNoop: false,
      loaded: false,
      preview: true,
      errors: [],
      formSubmitted: false,
      showErrors: false,
      contractSource: `
;; Title: EDP010 Noop
;; Author: Mike Cohen
;; Synopsis:
;; This proposal signals the outcome of a vote.
;; Description:
;; This proposal is intended for votes in the community which have no on-chain
;; impacts. For example the community can use this proposal to signal support
;; or otherwise for some action to be taken.

(impl-trait .proposal-trait.proposal-trait)


(define-public (execute (sender principal))
  (ok true)
)
`
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
  },
  mounted () {
    this.proposal = this.templateProposal
  },
  mounted () {
    this.loaded = true
  },
  methods: {
    deployContract: function () {
      const deployData = {
        codeBody: this.contractSource,
        contractId: this.profile.stxAddress + '.noop-proposal'
      }
      this.$store.dispatch('daoStacksStore/deployProjectContract', deployData).then((result) => {
        this.$notify({ type: 'success', title: 'Contract Deployed', text: 'Transaction sent.' })
        this.$emit('proposal-contract', { opcode: 'deployed', result: result })
      }).catch((error) => {
        this.result = error
        this.$notify({ type: 'error', title: 'Error Deploying', text: error })
      })
    },
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
      this.$store.dispatch('daoProposalStore/saveProposal', this.proposal).then(() => {
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
  }
}
</script>

<style >
</style>
