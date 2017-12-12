<template>
  <div class="section contact">

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
  .controls {
    position: relative;
    left: 0;
    padding: 20px 0;
    z-index: 200;
    background-color: #2F2F2F;
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
        padding: 0 20px;
      }
      @include for-desktop-up {
        padding: 0 3.125vw;
      }

      .address {
        @include for-small-desktop-up {
          margin-top: 150px;
        }
        @include for-desktop-up {
          margin-top: 212px;
        }
        div {
          display: inline-block;
          margin-top: 16px;
          p {
            margin: 8px 0;
          }
          @include for-tablet-landscape-up {
            margin-top: unset;
            p {
              margin: 16px 0;
            }
            &:nth-child(2) {
              margin-left: 40px;
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
