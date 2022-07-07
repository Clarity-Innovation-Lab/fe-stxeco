<template>
  <section>
    <b-container class="my-5">
      <!--
    <div class="d-flex justify-content-between">
      <div><b-link @click="pathname = 'readme'" variant="info">start</b-link></div>
      <div class="mb-5 pb-2 border-bottom text-right"><span>source: github -> <a :href="gitHubUrl()" target="_blank">{{pathname}}</a></span></div>
    </div>
    -->
      <b-row
        v-if="readme"
        class=""
      >
        <b-col @click="clicked">
          <vue-markdown :source="readme.content" />
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
// import VueMarkdown from 'vue-markdown'

export default {
  name: 'SIPProcess',
  components: {
    // VueMarkdown
  },
  data: function () {
    return {
      githubBase: 'https://github.com/stacksgov/sips/blob/main/sips',
      pathname: 'readme'
    }
  },
  computed: {
    readme () {
      const readme = this.$store.getters[APP_CONSTANTS.KEY_SIP_README](this.pathname)
      return readme
    }
  },
  mounted () {
    this.fetchNew()
  },
  methods: {
    gitHubUrl () {
      if (this.pathname === 'readme') {
        return this.githubBase
      }
      return this.githubBase + this.pathname
    },
    fetchNew () {
      this.$store.dispatch('daoSIPStore/fetchSIPContent', this.pathname)
    },
    clicked (e) {
      e.preventDefault()
      const anchor = e.target
      console.log(`${anchor.innerHTML} was clicked!`)
      this.pathname = anchor.pathname
      // if (this.pathname) this.pathname = this.pathname.replace('/stxdao/sips', '')
      // this.fetchNew()
      // window.open('https://github.com/stacksgov/sips/blob/main/' + this.pathname, '_blank')
      return false
    }
  }
}
</script>

<style >
</style>
