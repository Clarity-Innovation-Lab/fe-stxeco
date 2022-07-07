<template>
  <div v-if="proposal">
    <b-container class="my-5">
      <div class="d-flex justify-content-around">
        <div class="text-center">
          <h2>Votes for:<br>{{ votesFor }}</h2>
        </div>
        <div class="text-center">
          <h2>Votes against:<br>{{ votesAgainst }}</h2>
        </div>
      </div>
    </b-container>
    <b-container class="my-5" />
  </div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'ProposalVoting',
  components: {
  },
  props: ['proposal'],
  data: function () {
    return {
    }
  },
  computed: {
    votesFor () {
      const propData = this.proposal.proposalData
      return (propData) ? propData.votesFor : 0
    },
    votesAgainst () {
      const propData = this.proposal.proposalData
      return (propData) ? propData.votesAgainst : 0
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
