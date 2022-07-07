<template>
  <section v-if="extensions">
    <b-container class="my-5">
      <b-row class="my-2 text-left text-small">
        <b-col
          sm="12"
          md="6"
        >
          <div>
            <b-link
              v-b-tooltip.hover="{ variant: 'dark' }"
              class="pointer pr-3 mr-3 border-right"
              :title="'Active and deployed DAO extension contracts'"
            >
              Extensions
            </b-link>
          </div>
        </b-col>
        <b-col
          sm="12"
          md="6"
          class="text-right"
        >
          <div>
            <!-- Type: <span class="pointer mr-3 pr-3" v-b-tooltip.hover="{ variant: 'dark' }" :title="'GitHub Open Issues'">OPEN</span> -->
            <b-dropdown
              id="dropdown-1"
              size="sm"
              right
              text="Status"
              variant="outline-info"
            >
              <b-dropdown-item
                v-for="(status, index) in statusNames"
                :key="index"
                @click.prevent="changeFilter(status)"
              >
                <span class="text-small">{{ status }}</span>
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </b-col>
      </b-row>
      <b-row class="my-2 text-left">
        <b-col cols="12">
          <b-table
            striped
            hover
            :items="values()"
            :fields="fields()"
            class=""
          >
            <template #cell(Extension)="data">
              <b-link
                class="text-info"
                variant="warning"
                @click="openExtension(data)"
                v-html="data.value"
              />
            </template>
            <template #cell(Enabled)="data">
              {{ data.value }}
            </template>
            <template #cell(Actions)="data">
              <b-link
                class="mr-2 text-info"
                variant="warning"
                :href="contractUrl(data)"
                target="_blank"
              >
                <span
                  v-b-tooltip.hover="{ variant: 'dark' }"
                  :title="'View on Explorer'"
                ><b-icon icon="arrow-up-right-square" /></span>
              </b-link>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </b-container>
    <b-modal
      id="source-modal"
      size="lg"
      centered
    >
      <div v-if="extension && extension.extensionContract">
        <div>
          <h3>Extension Contract</h3>
          <h5>{{ extension.contractId.split('.')[1] }}</h5>
        </div>
        <div>
          <pre
            class="source-code my-4"
            v-html="extension.extensionContract.source_code"
          />
        </div>
      </div>
      <template
        #modal-footer
        class="text-center"
      >
        <div class="w-100" />
      </template>
    </b-modal>
  </section>
  <section v-else-if="!loaded && !extensions">
    <b-container class="my-5">
      No extensions found..
    </b-container>
  </section>
  <section v-else>
    <b-container class="my-5">
      Querying blockchain for extensions..
    </b-container>
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
      extension: null,
      statusNames: ['Active', 'All'],
      filter: 'active',
      loaded: false
    }
  },
  computed: {
    allExtensions () {
      return this.$store.getters[APP_CONSTANTS.KEY_EXTENSIONS]
    },
    extensions () {
      let extensions = this.$store.getters[APP_CONSTANTS.KEY_EXTENSIONS]
      if (this.filter === 'active') {
        extensions = extensions.filter((o) => o.extensionData?.valid)
      }
      return extensions
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    }
  },
  mounted () {
    this.stxAddress = this.profile.stxAddress
    this.loaded = true
  },
  methods: {
    openExtension (data) {
      this.extension = this.allExtensions[data.index]
      this.$bvModal.show('source-modal')
    },
    contractUrl: function (data) {
      const extension = this.allExtensions[data.index]
      return process.env.VUE_APP_STACKS_EXPLORER + '/txid/' + extension.extensionContract.tx_id + '?chain=' + process.env.VUE_APP_NETWORK
    },
    changeFilter (filter) {
      this.filter = filter.toLowerCase()
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
        },
        {
          key: 'Actions',
          sortable: false
        }
      ]
    },
    values () {
      if (!this.extensions) return []
      let mapped = []
      mapped = this.extensions.map(function (extension) {
        return {
          Extension: extension.contractId.split('.')[1],
          Enabled: extension.extensionData.valid,
          Actions: ''
        }
      })
      return mapped
    }
  }
}
</script>
<style lang="scss">
</style>
