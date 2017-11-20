<template>
  <div>
    <navigation></navigation>
    <nuxt/>
  </div>
</template>

<script>
import Navigation from '~/components/Navigation'
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
      setLayoutWidth: 'setLayoutWidth'
    }),
    setLayout () {
      let width = window.innerWidth
      this.setLayoutWidth(width)
    }
  },
  mounted () {
    this.setLayout()
    window.addEventListener('resize', this.setLayout)
  }
}
</script>
