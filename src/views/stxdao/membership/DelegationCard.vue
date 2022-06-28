<template>
<b-card-group>
  <b-card header-tag="header" footer-tag="footer" class="home-card bg-dark">
    <b-card-text>
      <div class="">
        <h4>Choose a delegate</h4>
        <p>You can transfer any percentage of your governance token to a delegate
          (a.k.a proxy) to vote for proposals on your behalf.
          You can also rescind (take back) your proxied votes at any time - and
          even withdraw them from a live proposal.</p>
      </div>
    </b-card-text>
    <template #header>
      <h4>Delegation</h4>
    </template>
    <template #footer>
      <div class="d-flex justify-content-around">
        <b-button variant="outline-dark" to="/stxdao/membership/delegate">Delegate Votes</b-button>
        <b-button variant="outline-dark" to="/stxdao/membership/delegate">Rescind Votes</b-button>
      </div>
    </template>
  </b-card>
</b-card-group>
</template>

<script>
export default {
  name: 'DelegationCard',
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
  }
}
</script>
<style lang="scss">
</style>
