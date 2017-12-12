<template>
  <div id="app">
    <navigation></navigation>
    <nuxt/>
    <div class="border"></div>
  </div>
</template>

<script>
import Navigation from '~/components/Navigation'
import debounce from 'lodash/debounce'
import { mapState, mapActions } from 'vuex'
export default {
  components: {
    'navigation': Navigation
  },
  computed: mapState([
    'layout'
  ]),
  methods: {
    ...mapActions({
      setLayoutWidth: 'setLayoutWidth',
      setLayoutype: 'setLayoutType',
      setLayoutDevice: 'setLayoutDevice',
      setLayoutIsReady: 'setLayoutIsReady'
    }),
    setWidth () {
      let width = window.innerWidth
      let type = ''
      this.setLayoutIsReady(false)
      this.setLayoutWidth(width)
      if (width < 900) {
        type = 'mobile'
        this.setLayoutDevice(true)
      } else if (width < 1200) {
        type = 'tablet'
        this.setLayoutDevice(true)
      } else if (width < 1366) {
        type = 'small-desktop'
        this.setLayoutDevice(false)
      } else if (width < 1800) {
        type = 'desktop'
        this.setLayoutDevice(false)
      } else {
        type = 'big-desktop'
        this.setLayoutDevice(false)
      }
      this.setLayoutype(type)
    },
    setLayout () {
      this.setWidth()
      this.setLayoutIsReady(true)
    }
  },
  mounted () {
    this.setLayout()
    window.addEventListener('resize', debounce(this.setLayout, 200))
  }
}
</script>

<style lang="scss">
  .border {
    position: fixed;
    z-index: 100;
    height: 100vh;
    width: 2px;
    left: 0;
    top: 0;
    background-color: #EE3524;
    z-index: 999;
  }
</style>
