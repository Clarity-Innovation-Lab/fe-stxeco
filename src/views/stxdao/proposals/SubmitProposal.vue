<template>
  <section>
    <b-container
      v-if="proposal"
      class="my-5"
    >
      <h4>Submit Proposal: <span class="text-warning">{{ proposal.title }}</span></h4>
      <p>
        <b-link to="/stxdao/proposals">
          <b-icon icon="chevron-double-left" />back
        </b-link>
      </p>
      <p>
        Please check:
        <ol>
          <li>
            The proposal contract is deployed and implements proposal trait
            <ul>
              <li>
                <b-link
                  :href="proposalContractUrl()"
                  target="_blank"
                >
                  {{ proposal.contractId }}
                </b-link>
              </li>
            </ul>
          </li>
          <li>The proposal contract is safe to run and will not fail to execute if passed by the community.</li>
          <li>The meta data below accurately describes the proposal.</li>
        </ol>
      </p>
      <div>
        <label for="status-name">Earliest voting can start is at block {{ stacksTipHeight + minStartHeight }} ~ {{ Math.floor((minStartHeight) / 144) }} days and the latest is at block {{ stacksTipHeight + maxStartHeight }} ~ {{ Math.floor((maxStartHeight) / 144) }} days.</label>
        <div class="w-100 d-flex justify-content-between">
          <div class="sl-2 text-warning">
            <span
              v-b-tooltip.hover="{ variant: 'light' }"
              :title="startHeightMessage"
            >earliest</span>
          </div>
          <div class="sr-2 text-warning">
            <span
              v-b-tooltip.hover="{ variant: 'light' }"
              :title="startHeightMessage"
            >latest</span>
          </div>
        </div>
        <div class="w-100">
          <vue-slider
            v-model="startHeight"
            :data="percentages"
            :max="maxStartHeight"
            @change="changeToken"
          />
        </div>
        <div class="py-3 w-100">
          <label for="status-name">Voting starts at block {{ stacksTipHeight + minStartHeight + startHeight }} ~ {{ Math.floor((minStartHeight + startHeight) / 144) / 2 }} days.</label>
        </div>
      </div>
      <p>
        <b-button
          v-if="canSubmitProposal()"
          class="mr-2 text-info"
          @click="submitProposal()"
        >
          Submit Proposal
        </b-button>
      </p>
    </b-container>
    <b-container v-else>
      Proposal not found?
    </b-container>
  </section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'

export default {
  name: 'SubmitProposal',
  components: {
    VueSlider
  },
  data () {
    return {
      startHeight: 1
    }
  },
  computed: {
    percentages () {
      const options = []
      for (let i = 0; i < this.maxStartHeight; i += 144) {
        options.push({ text: i, value: i })
      }
      return options
    },
    parameters () {
      const parameters = this.$store.getters[APP_CONSTANTS.KEY_GOV_PARAMETERS]
      return parameters || []
    },
    startHeightMessage () {
      return 'Earliest voting can start is at block ' + (this.stacksTipHeight + this.minStartHeight) + ' ~ ' + Math.floor((this.minStartHeight) / 144) + ' days and the latest is at block ' + (this.stacksTipHeight + this.maxStartHeight) + ' ~ ' + Math.floor((this.maxStartHeight) / 144) + ' days.'
    },
    minStartHeight () {
      const param = this.parameters.find((o) => o.name === 'minimum-proposal-start-delay')
      if (!param) return 0
      return param.value + 1
    },
    maxStartHeight () {
      const param = this.parameters.find((o) => o.name === 'maximum-proposal-start-delay')
      if (!param) return 100
      return param.value
    },
    stacksTipHeight () {
      return this.$store.getters[APP_CONSTANTS.KEY_PROPOSAL_STACKS_TIP_HEIGHT]
    },
    proposal () {
      const proposal = this.$store.getters[APP_CONSTANTS.KEY_PROPOSAL](this.$route.params.proposalId)
      return proposal
    }
  },
  mounted () {
  },
  methods: {
    changeToken: function (choice) {
      this.startHeight = choice
    },
    proposalContractUrl: function () {
      return process.env.VUE_APP_STACKS_EXPLORER + '/txid/' + this.proposal.proposalContract.tx_id + '?chain=' + process.env.VUE_APP_NETWORK
    },
    proposalTraitUrl: function () {
      return process.env.VUE_APP_STACKS_EXPLORER + '/txid/' + process.env.VUE_APP_DAO_DEPLOY_ADDRESS + '.proposal-trait?chain=' + process.env.VUE_APP_NETWORK
    },
    canSubmitProposal () {
      const proposal = this.proposal
      const canPropose = this.$store.getters[APP_CONSTANTS.KEY_GOV_CAN_PROPOSE]
      if (proposal.status === 'deployed' && canPropose) {
        return true
      } else if (proposal.status === 'submitted' && canPropose && !proposal.proposalData) {
        return true
      }
      return false
    },
    submitProposal () {
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
<style scoped>
.sl-2 {
  position: relative;
  left: -20px
}
.sr-2 {
  position: relative;
  right: -20px
}
</style>
