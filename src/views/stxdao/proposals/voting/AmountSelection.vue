<template>
  <b-card-group>
    <b-card
      class="p-3"
      style="width: 100%;"
      bg-variant="white"
      header-tag="header"
      footer-tag="footer"
    >
      <b-card-text class="text-right">
        <div class="mb-4 pb-4">
          <img
            width="10%"
            :src="iconSG"
          >
        </div>
      </b-card-text>
      <b-card-text class="">
        <h2 class="eag-header pointer mb-4">
          Lock ECO Tokens
        </h2>
        <h4 class="eag-header pointer mb-4">
          Voting <span class="text-warning">{{ getVote() }}</span> -> {{ title }}
        </h4>
      </b-card-text>
      <b-card-text class="">
        <label for="status-name">Select the number of tokens to vote with - these tokens will be locked until after the vote finishes</label>
        <div class="w-100">
          <vue-slider
            v-model="amount"
            :data="percentages()"
            :data-label="'data'"
            :max="availableBalance"
            @change="changeToken"
          />
        </div>
        <div class="w-100 d-flex justify-content-between">
          <div class="text-secondary">
            <span
              v-b-tooltip.hover="{ variant: 'light' }"
              :title="unlockedMessage"
            >0</span>
          </div>
          <div class="text-secondary">
            <span
              v-b-tooltip.hover="{ variant: 'light' }"
              :title="unlockedMessage"
            >{{ availableBalance }}</span>
          </div>
        </div>
      </b-card-text>
      <b-card-text>
        <div class="p-0 offset-8 col-4 text-right mb-5">
          <b-button
            class="w-100"
            variant="outline-dark"
            @click="next"
          >
            Locking {{ amount }} ECO ->
          </b-button>
        </div>
      </b-card-text>
    </b-card>
  </b-card-group>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'

export default {
  name: 'AmountSelection',
  components: {
    VueSlider
  },
  props: ['title', 'vfor'],
  data () {
    return {
      amount: 0,
      iconSG: require('@/assets/img/EAG - WEB UX assets - png/EAG - stacks grey.png')
    }
  },
  computed: {
    availableBalance () {
      return this.tokenBalance - this.tokenBalanceLocked
    },
    tokenBalance () {
      return this.$store.getters[APP_CONSTANTS.KEY_GOV_TOKEN_BALANCE]
    },
    tokenBalanceLocked () {
      return this.$store.getters[APP_CONSTANTS.KEY_GOV_TOKEN_BALANCE_LOCKED]
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    }
  },
  mounted () {
  },
  methods: {
    getVote () {
      return (this.vfor) ? 'for' : 'against'
    },
    unlockedMessage () {
      return 'Lock up to available balance of ECO tokens.'
    },
    next () {
      if (this.amount > 0) {
        this.$emit('update', { opcode: 'vote', amount: this.amount })
      } else {
        this.$notify({ type: 'warning', title: 'Select Amount', text: 'Please select the amount of tokens to lock on this vote?' })
      }
    },
    changeToken: function (choice) {
      this.amount = choice
    },
    percentages () {
      const options = []
      for (let i = 0; i <= (this.availableBalance); i += 50) {
        options.push({ text: i, value: i })
      }
      return options
    }
  }
}
</script>
<style lang="scss">
</style>
