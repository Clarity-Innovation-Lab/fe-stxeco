<template>
  <div class="mx-0 text-small mb-5">
    <b-container fluid>
      <b-row align-h="start" class="mb-4">
        <b-col cols="12" class="text-center">
          For the <b-icon icon="heart-fill" class="text-danger"/> of crypto!
        </b-col>
      </b-row>
    </b-container>
    <b-container fluid align-h="center" class="m-5">
      <b-row align-h="start" class="footer-top pb-5">
        <b-col md="4" sm="12" class="">
          <h1>Clarity Lab</h1>
        </b-col>
        <b-col md="2" sm="6" class="footer-top--content">
          <div class="column-header ">Code</div>
          <div>
            <a :href="'https://github.com/Clarity-Innovation-Lab'" target="_blank">Clarity Lab</a>
          </div>
          <div>
            <a :href="'https://github.com/Clarity-Innovation-Lab/executor-dao/issues'" target="_blank">DAO Issues</a>
          </div>
        </b-col>
        <b-col md="2" sm="6"  class="footer-top--content">
          <div class="column-header ">Videos</div>
          <div>
            <a target="_blank" href="https://www.youtube.com/watch?v=fbq6L3PrKWE">Stacks</a>
          </div>
          <div>
            <a target="_blank" href="https://www.youtube.com/watch?v=OAVwd6SNJVU&t=717s">Clarity</a>
          </div>
        </b-col>
        <b-col md="2" sm="6"  class="footer-top--content">
          <div class="column-header ">Contact</div>
          <div><a href="https://discord.com/channels/621759717756370964/971037457661444156" target="_blank">Discord</a></div>
          <div><a href="mailto:mike@claritylab.dev" target="_blank">Enquiries</a></div>
        </b-col>
        <b-col md="2" sm="6"  class="footer-top--content">
          <div class="column-header ">Partners</div>
          <div><a class="" href="https://stacks.org/" target="_blank">Foundation</a></div>
          <div><a class="" :href="webWalletLink" target="_blank">Hiro Wallet</a></div>
        </b-col>
      </b-row>
        <!--
      <div class="d-none d-sm-flex justify-content-between footer-bottom">
        <div class="footer-bottom--left">
          {{ content.left_bottom_corner[0].text }}
        </div>

        <div class="footer-bottom--right">
          <b-link to="/information/info-terms">Term of use</b-link>
          <b-link to="/information/info-privacy-policy">Privacy policy</b-link>
        </div>
      </div>

      <div class="d-block d-sm-none text-center footer-bottom">
        <div class="footer-bottom--left mb-1">
          <b-link to="/information/info-terms">Term of use</b-link>
          <b-link to="/information/info-privacy-policy">Privacy policy</b-link>
        </div>

        <div class="footer-bottom--right">
          {{ content.left_bottom_corner[0].text }}
        </div>
      </div>
        -->

    </b-container>
  </div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'MainFooter',
  data () {
    return {
      webWalletNeeded: false
    }
  },
  methods: {
    startLogout () {
      this.$store.dispatch('daoAuthStore/startLogout').then(() => {
        // localStorage.clear()
        // sessionStorage.clear()
        if (this.$route.name !== 'splash') {
          this.$router.push('/')
        }
      })
    },
    startLogin () {
      this.$store.dispatch('daoAuthStore/startLogin').catch((err) => {
        console.log(err)
        // https://www.hiro.so/wallet/install-web
        this.webWalletNeeded = true
      })
    }
  },
  computed: {
    webWalletLink () {
      if (this.$browserDetect.isFirefox) {
        return this.$store.getters[APP_CONSTANTS.KEY_WEB_WALLET_LINK_FIREFOX]
      }
      return this.$store.getters[APP_CONSTANTS.KEY_WEB_WALLET_LINK_CHROME]
    },
    loggedIn () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile.loggedIn
    },
    getBreakLine () {
      return this.$store.getters[APP_CONSTANTS.KEY_BREAK_LINE]
    }
  }
}
</script>

<style lang="scss">
.footer-break-line {
  height: 10px;
}

/* FOOTER GENERAL STYLE */
.footer-container {
  padding: 90px 24px 24px;
  color: #ffffff;
}
.footer-container a, .footer-container a:hover {
  color: #ffffff;
}

/* FOOTER TOP ROW STYLE */
.footer-top--content {
  text-align: top;
}
.footer-top--content div:not(:last-child) {
  margin-bottom: 15px;
}
/* Column headers */
.column-header {
  font-weight: 700;
  margin-bottom: 25px;
}
/* Social icons */
.social-links {
  margin-top: 0px;
}
.social-links a:not(:last-child){
  margin-right: 30px;
}
/* Logo */
.footer-logo {
  text-align: left;
}
.footer-logo img {
  margin-left: 0;
  margin-bottom: 50px;
}

/* FOOTER BOTTOM ROW STYLE */
.footer-bottom {
  margin-top: 50px;
}
.footer-bottom a:first-child {
  margin-right: 27px;
}

/* MOBILE STYLE */
@media only screen and (min-width: 992px) {
  .footer-logo {
    text-align: left;
  }
  .footer-logo img {
    margin-left: 40px;
    margin-bottom: 0;
  }
  .footer-top--content {
    text-align: left;
  }
}

@media only screen and (max-width: 700px) {
  .social-links {
    display: flex;
    flex-flow: column;
    margin-top: 0;
  }
  .social-links a:not(:last-child){
    margin-right: 0;
    margin-bottom: 15px;
  }
}
</style>
