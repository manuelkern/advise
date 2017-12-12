<template>
  <div class="section contact">

    <p class="title">{{ title }}</p>

    <div class="controls">
      <div class="inner">

        <div v-html="section[0].body" class="address"></div>

      </div>
    </div>

    <googlemaps-map
      class="vue-map-container"
      :center="{lat: section[0].location.lat, lng: section[0].location.lng}"
      :zoom="16"
      :options="{styles}">

      <googlemaps-marker :position="section[0].location" />

    </googlemaps-map>

  </div>
</template>

<script>
import { gmStyles } from '~/utils/utils.js'
export default {
  props: {
    section: {
      type: Array
    },
    title: {
      type: String
    }
  },
  data () {
    return {
      styles: gmStyles
    }
  }
}
</script>

<style lang="scss">
@import '~assets/css/vars.scss';
.contact {

  .title {
    display: none;
    @include for-tablet-landscape-up {
      display: block;
      margin: 0;
      top: 0;
      left: 0;
      font-family: 'Marklight';
      color: #EE3524;
      font-size: 38px;
      width: calc(56.25vw - 100px);
      position: relative;
      padding: 40px 50px 50px 50px;
    }
    @include for-small-desktop-up {
      width: inherit;
      word-spacing: 56.25vw;
      position: fixed;
      padding: 0 20px;
      left: 6.25vw;
      top: 60px;
    }
    @include for-small-desktop-up {
      padding: 0 3.125vw;
    }
    @include for-big-desktop-up {
      word-spacing: inherit;
    }
  }

  .controls {
    position: relative;
    left: 0;
    padding: 20px 0;
    z-index: 200;
    width: calc(100vw - 48px);
    margin-top: 55vh;
    min-height: 45vh;
    @include for-tablet-landscape-up {
      min-height: unset;
      margin-top: unset;
      width: 56.25vw;
      background-color: unset;
    }
    @include for-small-desktop-up {
      border-left: 1px solid rgba(149, 152, 154, 0.2);
      padding: 0;
      margin: unset;
      position: fixed;
      left: 6.25vw;
      top: 0;
      height: 100vh;
      overflow: hidden;
    }
    .inner {
      padding: 0 20px;
      @include for-tablet-landscape-up {
        padding: 40px 50% 50px 50px;
      }
      @include for-tablet-landscape-only {
        padding: 0px 50px;
      }
      @include for-small-desktop-up {
        padding: 0 3.125vw;
      }

      .address {
        @include for-small-desktop-up {
          margin-top: 150px;
        }
        @include for-desktop-up {
          margin-top: 160px;
        }
        @include for-big-desktop-up {
          margin-top: 200px;
        }
        div {
          margin-top: 16px;
          p {
            margin: 8px 0;
          }
          a {
            text-decoration: underline;
          }
          @include for-tablet-portrait-up {
            display: inline-block;
            &:nth-child(2) {
              margin-left: 40px;
            }
          }
          @include for-tablet-landscape-up {
            margin-top: unset;
            p {
              margin: 16px 0;
            }
          }
        }
      }
    }
  }

  .vue-map-container {
    width: calc(100vw - 48px);
    height: 55vh;
    left: 0;
    position: absolute;
    top: 0;
    z-index: 300;
    @include for-tablet-landscape-up {
      height: 50vh;
      left: 50px;
      width: calc(56.25vw - 100px);
      bottom: 50px;
      top: unset;
    }
    @include for-small-desktop-up {
      bottom: 65px;
      left: 6.25vw;
      width: 50vw;
    }
    @include for-desktop-up {
      left: 9.375vw;
      width: 46.875vw;
    }
  }

}

</style>
