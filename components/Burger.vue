<template>
  <div id="burger" v-bind:class="{open: isNavOpen}" v-on:click="toggle">
    <div class="burger-inner">
      <div class="burger line first"></div>
      <div class="burger line middle"></div>
      <div class="burger line last"></div>
    </div>
  </div>
</template>

<script>
import { animations } from '~/utils/utils.js'
export default {
  props: {
    isNavOpen: {
      type: Boolean
    }
  },
  data () {
    return {
      isBurgerOpen: false
    }
  },
  watch: {
    isNavOpen (value) {
      let $t = this.set$Targets(this.$el)
      this.isBurgerOpen = value
      if (this.isBurgerOpen) {
        animations.burgerOpens($t)
      } else {
        animations.burgerCloses($t)
      }
    }
  },
  methods: {
    set$Targets ($el) {
      let $targets = {
        first: $el.getElementsByClassName('first'),
        middle: $el.getElementsByClassName('middle'),
        last: $el.getElementsByClassName('last')
      }
      return $targets
    },
    toggle (event) {
      this.isBurgerOpen = !this.isBurgerOpen
      this.$emit('clicked', this.isBurgerOpen)
    }
  },
  created () {
    if (this.isNavOpen) {
      this.isBurgerOpen = true
    } else {
      this.isBurgerOpen = false
    }
  }
}
</script>

<style lang="scss">

  #burger {

    .burger-inner {
      width: 100%;
      height: 100%;
      position: absolute;

      .line {
        position: absolute;
        height: 2px;
        width: 100%;
        background-color: #ACACAC;
        transition: top .3s, color .3s;

        &.first {
          top: 0;
        }

        &.middle {
          top: 8px;
        }

        &.last {
          top: 16px;
        }
      }
    }

    &:hover {
      cursor: pointer;
    }

  }

</style>
