<template>
<section v-if="extensions">
  <b-container class="my-5">
    <b-row class="mb-5 text-center">
      <b-col cols="12">
        <h2>STX DAO Extensions</h2>
        <p>View of the DAO extensions</p>
      </b-col>
    </b-row>
    <b-row class="my-2 text-left">
      <b-col cols="12">
        <b-table striped hover :items="values()" :fields="fields()" class="">
          <template #cell(Extension)="data">
            <b-link class="text-info" variant="warning" v-on:click="openExtension(data)" v-html="data.value"></b-link>
          </template>
          <template #cell(Enabled)="data">
            {{data.value}}
          </template>
          <!--
          <template #cell(Actions)="data">
            <b-link class="mr-2 text-info" variant="warning" v-on:click="openExtension(data)">open</b-link>
          </template>
          -->
        </b-table>
      </b-col>
    </b-row>
  </b-container>
</section>
<section v-else-if="!loaded && !extensions">
  <b-container class="my-5">No extensions found..</b-container>
</section>
<section v-else>
  <b-container class="my-5">Querying blockchain for extensions..</b-container>
</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'Extensions',
  components: {
  },
  data () {
    return {
      loaded: false
    }
  },
  mounted () {
    this.stxAddress = this.profile.stxAddress
    this.loaded = true
  },
  methods: {
    openExtension (data) {
      if (data) return
      const extension = this.extensions[data.index]
      this.$router.push('/stxdao/extensions/' + extension.contract_id)
    },
    fields () {
      return [
        {
          key: 'Extension',
          sortable: true
        },
        {
          key: 'Enabled',
          sortable: true
        }
      ]
    },
    values () {
      if (!this.extensions) return []
      let mapped = []
      mapped = this.extensions.map(function (extension) {
        return {
          Extension: extension.contractName,
          Enabled: extension.enabled
        }
      })
      return mapped
    }
  },
  computed: {
    extensions () {
      const extensions = this.$store.getters[APP_CONSTANTS.KEY_EXTENSIONS]
      return extensions
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    }
  }
}
</script>
<style lang="scss">
</style>
