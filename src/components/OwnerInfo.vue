<template>
  <div>
    <span
      ref="flashee"
      class="mr-3"
    >{{ getAddress }}</span>
    <a
      v-if="newOwner"
      v-b-tooltip.hover="{ variant: 'dark' }"
      href="#"
      class="pointer"
      :title="'Copy address'"
      @click.prevent="copyAddress('stx')"
    ><b-icon icon="file-earmark" /></a>
    <input
      id="copy-stx-address"
      v-model="newOwner"
      class="mr-3 fake-input"
      readonly
    >
  </div>
</template>
<script>

export default {
  name: 'OwnerInfo',
  components: {
  },
  props: ['owner'],
  data () {
    return {
      stxAddress: null,
      newOwner: null
    }
  },
  computed: {
    getAddress: function () {
      if (this.bnsName) {
        return this.bnsName
      }
      return this.splitAddress(this.newOwner)
    }
  },
  mounted () {
    this.newOwner = this.owner
    this.stxAddress = this.owner
    this.$store.dispatch('daoAuthStore/fetchBnsNames', [this.newOwner]).then((bnsNames) => {
      if (bnsNames && bnsNames.length > 0) {
        this.bnsName = bnsNames[0].bnsEntry
      }
    })
  },
  methods: {
    copyAddress (value) {
      const copyText = document.querySelector('#copy-' + value + '-address')
      copyText.select()
      document.execCommand('copy')
      this.doFlash()
      this.$notify({ type: 'success', title: 'Copied Address', text: 'Copied to clipboard: ' + copyText.value })
    },
    splitAddress (address) {
      if (!address) return 'unclaimed'
      if (this.$route.name === 'nft-preview' || this.$route.name === 'asset-by-index') return address
      return address.substring(0, 5) + '..' + address.substring(address.length - 5)
    },
    doFlash () {
      const flasher = this.$refs.flashee
      flasher.classList.add('flasher')
      setTimeout(function () {
        flasher.classList.remove('flasher')
      }, 1000)
    }
  }
}
</script>
<style scoped>
.flasher {
  border-bottom: 2pt solid #FFCE00;
}

</style>
