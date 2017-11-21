<template>
  <div id="app">
    <navigation></navigation>
    <nuxt/>
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
      setLayoutype: 'setLayoutType'
    }),
    setWidth () {
      let width = window.innerWidth
      this.setLayoutWidth(width)
      let type = ''
      if (width < 1200) {
        type = 'tablet'
      } else if (width < 1366) {
        type = 'small-desktop'
      } else if (width < 1800) {
        type = 'desktop'
      } else {
        type = 'big-desktop'
      }
      this.setLayoutype(type)
    },
    setLayout () {
      this.setWidth()
    }
  },
  mounted () {
    this.setLayout()
    window.addEventListener('resize', debounce(this.setLayout, 200))
  }
}
</script>
