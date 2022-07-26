<template>
  <b-card-group>
    <b-card
      header-tag="header"
      footer-tag="footer"
      class="home-card"
      :class="(textColor) ? textColor : ''"
      overlay
      :style="cardBgStyle"
      :img-src="bgImage"
      img-alt="Photo by Mitchell Luo on Unsplash"
      text-variant="white"
    >
      <b-card-text class="mt-5">
        <div>
          <h1 class="mb-3">
            {{ title }}
          </h1>
          <h3 class="mb-2">
            <b-link
              :class="(textColor) ? textColor : 'text-white'"
              to="/"
            >
              {{ subtitle }}
            </b-link>
          </h3>
        </div>
      </b-card-text>
      <template #footer>
        <div class="d-flex justify-content-around">
          <b-button
            variant="outline-dark"
            :to="path"
          >
            {{ label }}
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
  props: ['title', 'subtitle', 'path', 'label', 'bgImage', 'textColor'],
  data () {
    return {
    }
  },
  computed: {
    cardBgStyle () {
      return {
        height: '500px',
        'margin-top': '0px',
        'background-repeat': 'repeat-y',
        'background-size': '355px',
        'background-position': 'center 70%'
      }
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    }
  },
  mounted () {
  },
  methods: {
    startLogin () {
      // this.$emit('updateEventCode', { eventCode: 'connect-login' })
      const myProfile = this.$store.getters['daoAuthStore/getMyProfile']
      if (myProfile.loggedIn) {
        this.$emit('connect-login', myProfile)
      } else {
        this.$store.dispatch('daoAuthStore/startLogin').catch(() => {
          // https://www.hiro.so/wallet/install-web
          this.$store.commit(APP_CONSTANTS.SET_WEB_WALLET_NEEDED)
        })
      }
    }
  }
}
</script>
<style scoped>
</style>
