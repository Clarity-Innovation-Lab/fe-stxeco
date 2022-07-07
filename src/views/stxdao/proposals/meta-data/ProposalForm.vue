<template>
  <div v-if="proposal">
    <div
      class="mb-1"
      role="group"
    >
      <div class="mb-4">
        <b-button
          class="mr-3"
          :disabled="!isValid"
          @click.prevent="save()"
        >
          Save Proposal
        </b-button>
        <b-button
          v-if="canDelete()"
          class="mr-3"
          variant="danger"
          @click="$emit('startDeleteProposal')"
        >
          delete draft
        </b-button>
      </div>
      <div
        v-if="errors && errors.length > 0 && showErrors"
        class="mb-4 text-danger p-3"
      >
        <div
          v-for="(error, index) in errors"
          :key="index"
          class="mr-1"
        >
          {{ error }}
        </div>
      </div>
      <b-form-input
        id="proposal-title"
        v-model="proposal.title"
        :state="proposalTitleState"
        aria-describedby="proposal-title-help proposal-title-feedback"
        placeholder="Title of Proposal"
        trim
      />
      <b-form-invalid-feedback id="proposal-title-feedback">
        Enter at least 3 letters
      </b-form-invalid-feedback>
    </div>
    <div
      class="mb-1"
      role="group"
    >
      <label for="proposal-proposer">Proposer : {{ proposal.proposer }}</label>
    </div>
    <div
      class="mb-1"
      role="group"
    >
      <label>Status : {{ proposal.status }}</label>
    </div>
    <div
      class="mb-1"
      role="group"
    >
      <label for="proposal-proposer">Created : {{ created }}</label>
    </div>
    <div>
      <div class="text-left">
        <b-form-checkbox
          v-model="proposal.onChain"
          size="sm"
          name="check-button"
          switch
          class=""
          @change="toggleChainMode"
        >
          <p
            v-if="proposal.onChain"
            class="pointer"
          >
            <b>On Chain</b> <b-link
              v-b-tooltip.hover="{ variant: 'light' }"
              router-tag="span"
              :title="'On-chain proposal - an action undeertaken by a smart contract already deployed on the chain'"
              class="ml-2"
              variant="outline-success"
            >
              <b-icon icon="question-circle" />
            </b-link>
          </p>
          <p
            v-else
            class="pointer"
          >
            <b>Advisory</b> <b-link
              v-b-tooltip.hover="{ variant: 'light' }"
              router-tag="span"
              :title="'Off-chain or advisory proposal - that can be voted on in discord'"
              class="ml-2"
              variant="outline-success"
            >
              <b-icon icon="question-circle" />
            </b-link>
          </p>
        </b-form-checkbox>
      </div>

      <div
        class="mb-3"
        role="group"
      >
        <label for="proposal-githubIssue">Github Issue URL :</label>
        <b-form-input
          id="proposal-githubIssue"
          v-model="proposal.githubIssue"
          aria-describedby="proposal-githubIssue-help proposal-githubIssue-feedback"
          placeholder="Enter URL of github issue"
          trim
        />
        <b-form-invalid-feedback id="proposal-githubIssue-feedback">
          Enter the URL of github issue
        </b-form-invalid-feedback>
      </div>

      <div
        class="mb-3"
        role="group"
      >
        <label for="proposal-githubIssue">Github Pull Request :</label>
        <b-form-input
          id="proposal-githubPullRequest"
          v-model="proposal.githubPullRequest"
          aria-describedby="proposal-githubPullRequest-help proposal-githubPullRequest-feedback"
          placeholder="Enter URL of github pull request"
          trim
        />
        <b-form-invalid-feedback id="proposal-githubPullRequest-feedback">
          Enter the URL of github pull request
        </b-form-invalid-feedback>
      </div>

      <div
        v-if="proposal.onChain"
        class="mb-3"
        role="group"
      >
        <label for="proposal-proposer">contract id :</label>
        <b-form-input
          id="proposal-proposer"
          v-model="proposal.contractId"
          :state="proposalContractIdState"
          aria-describedby="proposal-contractId-help proposal-contractId-feedback"
          placeholder="Enter contract id of on-chain proposal"
          trim
        />
        <b-form-invalid-feedback id="proposal-contractId-feedback">
          Enter the contractId of the proposal
        </b-form-invalid-feedback>
      </div>

      <b-row v-if="proposal.status === 'draft'">
        <b-col
          md="6"
          sm="12"
        >
          <div
            class="mb-4"
            role="group"
          >
            <label for="proposal-description">Description (<a
              href="https://www.markdownguide.org/cheat-sheet/"
              target="_blank"
            >markdown <b-icon icon="arrow-up-right-square" /></a>) : <!-- <span class="pointer" v-if="proposal.description && proposal.description.length > 0" @click="preview = !preview">toggle preview</span> --></label>
            <b-form-textarea
              ref="description"
              v-model="proposal.description"
              placeholder="Detailed description - provide enough context for others to be able to vote. Use markdown to structure text."
              rows="30"
              style="padding: 20px 20px;"
            />
          </div>
        </b-col>
        <b-col
          :md="(proposal.status === 'draft') ? 6 : 12"
          sm="12"
        >
          <label for="proposal-description">Preview :</label>
          <div
            v-if="proposal.description && preview"
            class="preview"
          >
            <vue-markdown :source="proposal.description" />
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import VueMarkdown from 'vue-markdown'
import { DateTime } from 'luxon'

export default {
  name: 'ProposalForm',
  components: {
    VueMarkdown
  },
  props: ['templateProposal'],
  data: function () {
    return {
      proposal: null,
      formToShow: 'update',
      loaded: false,
      preview: true,
      errors: [],
      formSubmitted: false,
      showErrors: false
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
    toggleChainMode: function (tog) {
      if (!tog) {
        this.proposal.onChain = false
      } else {
        this.proposal.onChain = true
      }
    },
    save: function () {
      this.formToShow = 'update'
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
      if (!this.proposal) return errors
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
