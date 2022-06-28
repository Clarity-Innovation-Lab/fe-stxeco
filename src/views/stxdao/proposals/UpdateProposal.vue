<template>
<b-container class="">
  <b-row class="my-4">
    <b-col align-self="start">
      <h2><span>Update Proposal</span></h2>
    </b-col>
  </b-row>
  <b-row class="mb-4">
    <b-col align-self="start">
      <ProposalForm :proposal="proposal" @startDeleteProposal="startDeleteProposal"/>
    </b-col>
  </b-row>
  <b-modal size="lg" id="delete-modal" centered>
    <p>Can't be undone..</p>
    <template #modal-header class="text-center"><div class="w-100"><h4>Delete proposal</h4></div></template>
    <template #modal-footer class="text-center">
      <div class="w-100">
        <b-button variant="danger" class="mr-3" @click="deleteProposal">yes - delete this draft</b-button>
        <b-button variant="light" @click="cancel">not right now</b-button>
      </div>
    </template>
  </b-modal>
</b-container>
</template>

<script>
import ProposalForm from './meta-data/ProposalForm'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'UpdateProposal',
  components: {
    ProposalForm
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    startDeleteProposal () {
      this.$bvModal.show('delete-modal')
    },
    cancel () {
      this.$bvModal.hide('delete-modal')
    },
    deleteProposal () {
      this.$bvModal.hide('delete-modal')
      this.$store.dispatch('daoProposalStore/deleteProposal', this.proposal).then(() => {
        this.$router.push('/stxdao/proposals')
      })
    }
  },
  computed: {
    proposal () {
      const proposal = this.$store.getters[APP_CONSTANTS.KEY_PROPOSAL](this.$route.params.proposalId)
      return proposal
    }
  }
}
</script>
<style lang="scss" >
</style>
