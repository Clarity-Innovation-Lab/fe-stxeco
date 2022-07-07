<template>
  <b-card-group>
    <b-card
      header-tag="header"
      footer-tag="footer"
      class="home-card"
      overlay
      :style="cardBgStyle"
      :img-src="cardBg"
      img-alt="Photo by Patrick on Unsplash"
      text-variant="white"
    >
      <b-card-text class="mt-5">
        <div>
          <h1 class="mb-3">
            Executor DAO
          </h1>
          <h4 class="mb-2">
            Looking to launch your own DAO?
          </h4>
        </div>
      </b-card-text>
      <template #footer>
        <div class="text-center">
          <b-button
            variant="outline-dark"
            :href="launcherUrl"
          >
            Open Launch Pad
          </b-button>
        </div>
      </template>
    </b-card>
  </b-card-group>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'DisplayCard',
  components: {
  },
  data () {
    return {
      cardBg: require('@/assets/img/swissarmy.jpg')
    }
  },
  computed: {
    cardBgStyle () {
      return {
        'margin-top': '0px',
        'background-repeat': 'repeat-y',
        'background-size': '355px',
        'background-position': 'center 70%'
      }
    },
    launcherUrl () {
      return process.env.VUE_APP_LAUNCHER_URL
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.text2 {
  text-transform: capitalize;
}

</style>
