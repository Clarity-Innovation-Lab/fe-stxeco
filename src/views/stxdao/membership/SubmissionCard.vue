<template>
<b-card-group>
  <b-card header-tag="header" footer-tag="footer" class="home-card bg-dark">
    <b-card-text>
      <div>
        <p>
          Proposals can be submitted by anyone with at least <span class="text-warning">{{getProposeFactor / 100000}}%</span>
          of the total supply of stx dao governance token.
        </p>
        <p class="text-warning">
          Note this figure can be changed by a proposal.
        </p>
        <h4>How to Submit a Proposal</h4>
        <p>
          <ol>
            <li>Describe the proposal</li>
            <li>Deploy the proposal contract</li>
          </ol>
        </p>
      </div>
    </b-card-text>
    <template #header>
      <h4>Proposals</h4>
    </template>
    <template #footer>
      <div class="d-flex justify-content-around">
        <b-button variant="outline-dark" to="/stxdao/proposals/create">Start Submission</b-button>
        <b-button variant="outline-dark" to="/stxdao/proposals">Browse Proposals</b-button>
      </div>
    </template>
  </b-card>
</b-card-group>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'SubmissionCard',
  components: {
  },
  data () {
    return {
      loaded: false
    }
  },
  mounted () {
    this.loaded = true
  },
  methods: {
  },
  computed: {
    getProposeFactor () {
      return this.$store.getters[APP_CONSTANTS.KEY_GOV_PROPOSE_FACTOR]
    },
    getCanPropose () {
      return this.$store.getters[APP_CONSTANTS.KEY_GOV_CAN_PROPOSE]
    }
  }
}
</script>
<style lang="scss">
</style>
