<template>
  <b-nav-item-dropdown
    v-if="exchangeRate"
    class="no-focus-outline"
    style="list-style: none;"
    no-caret
  >
    <template #button-content>
      <div class="">
        <img
          :src="iconSG"
          class="icon"
        >
        <span class="mx-3">{{ amountTrunc }}</span>
        <span v-html="exchangeRate.currency" />
      </div>
    </template>
    <b-dropdown-item
      v-for="(rate, idx) in tickerRates"
      :key="idx"
      style="list-style: none;"
      class="no-focus-outline pl-0 m-0"
      @click.prevent="changeFiatCurrency(rate.currency)"
    >
      <div class="d-flex justify-content-between mb-0">
        <div style="min-width: 60px;">
          {{ rate.currency }}
        </div> <div style="min-width: 80px;">
          {{ truncateAmount(rate.stxPrice) }} STX
        </div>
      </div>
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'ExchangeRates',
  components: {
  },
  data () {
    return {
      iconSG: require('@/assets/img/EAG - WEB UX assets - png/EAG - stacks grey.png'),
      defCur: 'EUR'
    }
  },
  computed: {
    amountTrunc () {
      const exchangeRate = this.exchangeRate
      // const tunced = Math.round(exchangeRate.amountStx * 10000)
      return (exchangeRate.stxPrice) ? (exchangeRate.stxPrice).toFixed(4) : 0
    },
    exchangeRate () {
      const tickerRates = this.$store.getters[APP_CONSTANTS.KEY_TICKER_RATES]
      if (tickerRates.length > 0) {
        return tickerRates.find((o) => o.currency === this.defCur)
      }
      return null
    },
    tickerRates () {
      const rates = this.$store.getters[APP_CONSTANTS.KEY_TICKER_RATES]
      return rates
    }
  },
  methods: {
    fiatSymbol () {
      const exchangeRate = this.$store.getters[APP_CONSTANTS.KEY_EXCHANGE_RATE]
      if (exchangeRate.fiatCurrency === 'EUR') {
        return '&euro;'
      } else if (exchangeRate.fiatCurrency === 'GBP') {
        return '&pound;'
      } else if (exchangeRate.fiatCurrency === 'JPY') {
        return '&yen;'
      } else {
        return '&dollar;'
      }
    },
    changeFiatCurrency (fiatCurrency) {
      if (fiatCurrency) {
        this.defCur = fiatCurrency
        this.$store.commit(APP_CONSTANTS.SET_FIAT_CURRENCY, fiatCurrency)
      } else {
        this.$notify({ type: 'warning', title: 'Exchange Rates', text: 'Rate not available!' })
      }
    },
    truncateAmount (amount) {
      return amount.toFixed(4)
    }
  }
}
</script>

<style>
</style>
