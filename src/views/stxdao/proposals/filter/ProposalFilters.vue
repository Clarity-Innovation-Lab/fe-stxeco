<template>
<div class="d-flex justify-content-between">
  <div>
    <b-link class="border-right text-info mr-3 pr-3" :to="'/stxdao/community'">RULES</b-link>
    <b-link class="mr-3 pr-3 text-info" to="/stxdao/proposals/create" v-if="canPropose" v-b-tooltip.hover="{ variant: 'light' }" :title="(canPropose) ? 'This account is able to propose' : 'Insufficient governance token balance to submit proposals to the DAO'">NEW PROPOSAL</b-link>
  </div>
  <div class="d-flex justify-content-end">
    <span class="text-black mr-4">Filters:</span>
    <span class="mr-4"><b-link @click="constructDao" v-if="isDaoDeployer && !isConstructed" v-b-tooltip.hover="{ variant: 'light' }" :title="'Construct a new DAO'">CONSTRUCT</b-link></span>

    <span class="pointer mr-3">
      <b-dropdown id="dropdown-1" text="Created" variant="outline-info">
        <b-dropdown-item v-for="(status, index) in dateFilterNames" :key="index"  @click.prevent="toggleSearching(status)">{{status}}</b-dropdown-item>
      </b-dropdown>
    </span>
    <span class="pointer">
      <b-dropdown id="dropdown-1" right text="Status" variant="outline-info">
        <b-dropdown-item v-for="(status, index) in statusNames" :key="index"  @click.prevent="toggleSearching(status)">{{status}}</b-dropdown-item>
      </b-dropdown>
    </span>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'ProposalFilters',
  components: {
  },
  data () {
    return {
      statusNames: ['draft', 'deployed', 'submitted', 'in progress', 'concluded'],
      dateFilterNames: ['Newest', 'Oldest'],
      query: {
        query: null,
        allCollections: 'one',
        createdBefore: null,
        createdAfter: null,
        claims: null,
        sortField: 'nftIndex',
        sortDir: 'sortDown'
      }
    }
  },
  mounted () {
  },
  methods: {
    reverseDir () {
      if (this.query.sortDir === 'sortUp') {
        this.query.sortDir = 'sortDown'
      } else {
        this.query.sortDir = 'sortUp'
      }
      this.toggleSearching()
    },
    constructDao () {
      this.$store.dispatch('daoProposalStore/constructDao').then((result) => {
        this.result = result
      })
    },
    toggleSearching () {
      this.$emit('updateResults', { opcode: 'update-results', query: this.query })
    }
  },
  computed: {
    isConstructed () {
      const enabled = this.$store.getters[APP_CONSTANTS.KEY_IS_CONSTRUCTED]
      return enabled
    },
    isDaoDeployer () {
      // const bootstrap = this.$store.getters[APP_CONSTANTS.KEY_BOOTSTRAP_PROPOSAL]
      return process.env.VUE_APP_DAO_DEPLOY_ADDRESS === this.profile.stxAddress
    },
    canPropose () {
      return this.$store.getters[APP_CONSTANTS.KEY_GOV_CAN_PROPOSE]
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    }
  }
}
</script>
<style>
.nav-item {
  list-style-type: none;
}
</style>
