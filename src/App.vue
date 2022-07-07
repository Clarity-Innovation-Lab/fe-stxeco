<template>
<div id="app" :style="'z-index: -40; min-height: 90vh; background-size: contain; background-image: url(' + getPixelBackground + ')'">
  <div class="wrapper" v-if="loaded">
    <div class="bg-danger py-3 text-center under-construction">UNDER CONSTRUCTION - <a href="https://discord.com/channels/621759717756370964/971037457661444156" target="_blank">contributions welcome via discord!</a></div>
    <RouterView name="header" class="bg-dark"/>
    <RouterView name="daoheader" class="bg-warning text-white"/>
    <RouterView id="page" class="mt-5"/>
    <div class="push"></div>
  </div>
  <footer class="footer">
    <RouterView class="" name="footer" />
  </footer>
  <notifications :duration="4000" classes="r-notifs" position="bottom left" width="70%"/>
</div>
</template>
<script>
import { APP_CONSTANTS } from '@/app-constants'
export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      loaded: true
    }
  },
  beforeCreate () {
    this.$store.dispatch('initDaoApplication').then(() => {
      this.loaded = true
    })
  },
  mounted () {
  },
  methods: {
  },
  computed: {
    getPixelBackground () {
      return this.$store.getters[APP_CONSTANTS.KEY_PIXEL_BACKGROUND]
    }
  }
}
</script>

<style lang="scss">
</style>
