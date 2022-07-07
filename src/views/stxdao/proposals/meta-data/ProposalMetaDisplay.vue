<template>
  <div v-if="proposal">
    <b-row class="">
      <b-col
        md="2"
        sm="12"
      >
        Github Issue
      </b-col>
      <b-col
        md="8"
        sm="12"
      >
        <div v-if="proposal.githubIssue">
          <b-link
            :href="proposal.githubIssue"
            target="_blank"
          >
            View issue on github
          </b-link>
        </div>
        <div v-else>
          no issue found
        </div>
      </b-col>
    </b-row>
    <b-row class="">
      <b-col
        md="2"
        sm="12"
      >
        Github Pull Request
      </b-col>
      <b-col
        md="8"
        sm="12"
      >
        <div v-if="proposal.githubPullRequest">
          <b-link
            :href="proposal.githubPullRequest"
            target="_blank"
          >
            View pull request on github
          </b-link>
        </div>
        <div v-else>
          no pr found
        </div>
      </b-col>
    </b-row>
    <b-row class="">
      <b-col
        md="2"
        sm="12"
      >
        Additional Info
      </b-col>
      <b-col
        md="8"
        sm="12"
      >
        <vue-markdown
          v-if="proposal.description"
          :source="proposal.description"
        />
        <div v-else>
          n/a
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
// import VueMarkdown from 'vue-markdown'
import { DateTime } from 'luxon'

export default {
  name: 'ProposalMetaDisplay',
  components: {
    // VueMarkdown
  },
  props: ['proposal'],
  data: function () {
    return {
    }
  },
  computed: {
    proposalEnds () {
      return this.$store.getters[APP_CONSTANTS.KEY_PROPOSAL_ENDS_AT_HEIGHT](this.proposal.contractId)
    },
    stacksTipHeight () {
      const blockchainInfo = this.$store.getters[APP_CONSTANTS.KEY_BLOCKCHAIN_INFO]
      if (!blockchainInfo) return 0
      return Number(blockchainInfo.stacks_tip_height)
    },
    created: function () {
      return DateTime.now().toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
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
