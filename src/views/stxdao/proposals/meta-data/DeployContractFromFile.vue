<template>
  <div>
    <b-form>
      <div>
        <div v-if="!uploadable">
          <MediaUpload
            class="text-center"
            :hide-link-paste="hideLinkPaste"
            :my-upload-id="'coverImage'"
            :dims="dims"
            :content-model="contentModel"
            :media-files="mediaFilesImage()"
            :limit="1"
            :size-limit="3"
            :media-types="'code/clar'"
            @updateMedia="updateMedia($event)"
          />
        </div>
        <div v-else>
          <div
            class="mb-3"
            role="group"
          >
            <label for="contractId"><span class="text-danger">*</span> contract id</label>
            <b-form-input
              id="contractId"
              v-model="fileName"
              placeholder="contract id"
              trim
              required
            />
          </div>
          <div>
            <div class="mb-3">
              <b-textarea
                ref="contractCode"
                :value="decodedString"
                class="text-small py-4 my-3 source-code"
                rows="10"
                placeholder="Contract Code"
              />
            </div>
            <div class="mt-3 d-flex justify-content-start">
              <b-button
                class="mr-3"
                @click="deployContract()"
              >
                Deploy
              </b-button>
              <b-button
                variant="outline-dark"
                class="text-dark "
                @click="cancelUpload()"
              >
                Cancel
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </b-form>
    <pre
      v-if="result"
      class="source-code my-4"
      v-html="result"
    />
    <b-modal
      id="modal-err"
      title="Contract Not Deployed"
    >
      <div class="row">
        <div class="col-12 my-1">
          <div class="mb-3">
            Error: {{ result }}
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import MediaUpload from './MediaUpload'

const REGISTRY_CONTRACT_ADDRESS = process.env.VUE_APP_REGISTRY_CONTRACT_ADDRESS

export default {
  name: 'DeployContractFromFile',
  components: {
    MediaUpload
  },
  data () {
    return {
      fileName: null,
      hideLinkPaste: true,
      feeAmount: 3000,
      project: {
        contractId: REGISTRY_CONTRACT_ADDRESS + '.'
      },
      contractId: null,
      txData: null,
      nonce: 0,
      loading: true,
      parentalError: null,
      result: null,
      dims: { width: 'auto', height: 300 },
      contentModel: {
        title: 'Browse computer for proposal <br/>Note: it must implement <b>proposal-trait</b>',
        errorMessage: 'A file is required.',
        popoverBody: 'Your clarity  file.',
        buttonName: 'Choose Clarity File'
      },
      uploadable: false,
      files: []
    }
  },
  computed: {
    mediaFiles1 () {
      let files = []
      if (this.files.length > 0) {
        files = this.files
      }
      return files
    },
    decodedString () {
      if (this.files.length === 0) {
        return
      }
      const sub = 'data:application/octet-stream;base64,'
      const octets = this.files[0].dataUrl.substring(sub.length)
      const decodedString = atob(octets)
      return decodedString
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    }
  },
  watch: {
  },
  mounted () {
    this.contractId = this.project.contractId
    this.loading = false
  },
  methods: {
    buildCache: function () {
      this.$store.dispatch('rpayManageCacheStore/buildCache').then((result) => {
        this.$notify({ type: 'success', title: 'Indexing', text: result })
      }).catch((err) => {
        this.$notify({ type: 'error', title: 'Indexing', text: err })
      })
    },
    mediaFilesImage () {
      if (!this.avatar) return
      const files = []
      return files
    },
    stripFileName (file) {
      // let file = ''
      // if (this.files.length > 0) {
      //  file = this.files[0].name
      // }
      if (file.endsWith('.clar')) {
        file = file.substring(0, file.length - 5)
      }
      return this.profile.stxAddress + '.' + file
    },
    updateMedia (data) {
      if (data.media && data.media.dataUrl) {
        this.files = [data.media]
        this.fileName = this.stripFileName(data.media.name)
        this.uploadable = true
      }
    },
    plainFile () {
      if (this.files.length === 0) {
        return
      }
      const sub = 'data:application/octet-stream;base64,'
      const octets = this.files[0].dataUrl.substring(sub.length)
      const decodedString = atob(octets)
      return decodedString
    },
    cancelUpload () {
      this.files = []
    },
    deployContract: function () {
      if (!this.validate(this.plainFile())) {
        return
      }
      const deployData = {
        senderAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        senderKey: '753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601',
        codeBody: this.plainFile(),
        contractId: this.fileName
      }
      this.$store.dispatch('daoStacksStore/deployProjectContract', deployData).then((result) => {
        this.$notify({ type: 'success', title: 'Contract Deploy', text: 'Sent the transaction.' })
        this.$emit('proposal-contract', { opcode: 'deployed', result: result })
      }).catch((error) => {
        this.result = error
        this.$bvModal.show('modal-err')
      })
    },
    validate: function (file) {
      let result = true
      if (!file) {
        this.$notify({ type: 'error', title: 'Contract Error', text: 'Load the contract source code to continue.' })
        result = false
      }
      return result
    }
  }
}
</script>
<style scoped>
.create-container {
  width: 200px;
  height: 200px;
  margin: auto auto;
}
.my-input {
  background: #fff 0% 0% no-repeat padding-box;
  border-radius: 0px;
  border: none;
  padding: 50px 20px;
  color: #000;
}

</style>
