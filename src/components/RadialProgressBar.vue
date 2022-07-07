<template>
  <div class="hello">
    <radial-progress-bar
      :diameter="200"
      :completed-steps="100"
      :total-steps="200"
    >
      <p>Block: {{ total }}</p>
      <p>{{ msg }}: {{ completed - total }}</p>
    </radial-progress-bar>
  </div>
</template>

<script>
import RadialProgressBar from 'vue-radial-progress'

export default {
  name: 'RadialProgressBar',
  components: {
    RadialProgressBar
  },
  props: ['msg', 'diameter', 'completed', 'total']
}
</script>
<style scoped lang="scss">
</style>
