<template>
<b-container class="">
  <b-row class="my-4">
    <b-col align-self="start">
      <h2><span>Something to Propose?</span></h2>
      <div>
        <ProposalForm :proposal="seedProp"/>
      </div>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import ProposalForm from './meta-data/ProposalForm'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'CreateProposal',
  components: {
    ProposalForm
  },
  data () {
    return {
      seedProp: {
        proposer: null,
        onChain: true
      }
    }
  },
  mounted () {
    this.seedProp.proposer = this.profile.stxAddress
  },
  methods: {
  },
  computed: {
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    }
  }
}
</script>
<style lang="scss" >
</style>
