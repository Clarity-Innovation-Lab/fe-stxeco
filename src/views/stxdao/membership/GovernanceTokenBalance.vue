<template>
  <div>
    <div>
      <h4>Governance Tokens</h4>
      <b-row class="mt-3">
        <b-col cols="4">
          Unlocked
        </b-col><b-col cols="8">
          <p>{{ getTokenBalance }}</p>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="4">
          Locked
        </b-col><b-col cols="8">
          <p>{{ getTokenBalanceLocked }}</p>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="4">
          Delegated
        </b-col><b-col cols="8">
          <p>{{ getTotalDelegatedToMe }}</p>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="4">
          Total Supply
        </b-col><b-col cols="8">
          <p>{{ getTotalSupply }}</p>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'GovernanceTokenBalance',
  components: {
  },
  data () {
    return {
      stxAddress: null,
      loaded: true
    }
  },
  computed: {
    getTotalDelegatedToMe () {
      return this.$store.getters[APP_CONSTANTS.KEY_GOV_TOKEN_BALANCE_DELEGATED]
    },
    getTokenBalance () {
      return this.$store.getters[APP_CONSTANTS.KEY_GOV_TOKEN_BALANCE]
    },
    getTokenBalanceLocked () {
      return this.$store.getters[APP_CONSTANTS.KEY_GOV_TOKEN_BALANCE_LOCKED]
    },
    getTotalSupply () {
      return this.$store.getters[APP_CONSTANTS.KEY_GOV_TOKEN_SUPPLY]
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    }
  },
  mounted () {
    this.stxAddress = this.profile.stxAddress
  },
  methods: {
    next () {
      return true
    }
  }
}
</script>
<style lang="scss">
</style>
