<template>
  <div class="section practice-areas-mobile">

    <p class="title">{{ title }}</p>

    <div class="controls" v-bind:class="{open: isOpen}">
    
      <div class="trigger" v-on:click="toggleSubNav()">
        <img src="~/assets/images/red-arrow.svg" class="arrow">
        <!-- <p v-if="neverOpened">{{ trigger }}</p> -->
      </div>

      <div class="inner">

        <scrollactive
          class="anchors"
          :offset="32"
          :duration="800"
          :clickToScroll="true">
          <ul>
            <li v-for="(practice, index) in section" :key="index">
              <a :href="'#' + practice[keys.title_slug]"
                class="anchor scrollactive-item"
                v-on:click="toggleSubNav()">
                  {{ practice[keys.title] }}
              </a>
            </li>
          </ul>
        </scrollactive>

      </div>
    </div>

    <div class="practices content">
      <div
        class="practice"
        v-for="(practice, index) in section"
        v-bind:id="practice[keys.title_slug]"
        :key="index">
        <p class="practice-title">{{ practice[keys.title] }}</p>
        <div class="practice-body" v-html="practice[keys.body]"></div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    section: {
      type: Array
    },
    keys: {
      type: Object
    },
    trigger: {
      type: String
    },
    title: {
      type: String
    }
  },
  data () {
    return {
      isOpen: false,
      neverOpened: true
    }
  },
  methods: {
    toggleSubNav () {
      this.neverOpened = false
      this.isOpen = !this.isOpen
    }
  }
}
</script>

<style lang="scss">
@import '~assets/css/vars.scss';

.practice-areas-mobile {


  .title {
    position: absolute;
    font-family: 'Marklight';
    color: #F0EDEB;;
    font-size: 38px;
    margin: 0;
    width: calc(100vw - 88px);
    bottom: 45%;
    left: 0;
    padding: 0 20px 20px 20px;
  }

  .overlay-trigger {
    width: 34px;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #2B2B2B;
    height: 55vh;
  }

  .controls {

    width: 100vw;
    min-height: 100vh;
    position: fixed;
    left: -100vw;
    top: 0;
    z-index: 200;
    background-color: #D7D4D2;
    transition: left .5s;

    .trigger {
      position: absolute;
      width: 40px;
      height: 40px;
      top: 29px;
      right: -40px;
      visibility: visible;
      transition: opacity .5s;
      opacity: 1;
      background-color: #D7D4D2;;

      .arrow {
        position: absolute;
        width: 60%;
        height: 60%;
        left: 20%;
        top: 20%;
      }
      p {
        position: absolute;
        text-align: right;
        top: 44px;
        margin: 0;
        right: -4px;
        color: #EE3524;
        font-size: 12px;
        transform: rotate(-90deg);
      }
    }

    .inner {
      padding: 20px 68px 20px 20px;

      .anchors {
        position: relative;

        ul {
          li {
            padding: 10px 0 10px 0;
            border-bottom: 1px solid rgba(149, 152, 154, 0.2);
            &:first-of-type {
              padding: 0 0 10px 0;
            }
            &:last-of-type {
              border-bottom: unset;
            }
            .anchor {
              font-size: 16px;
              transition: color .3s;
              &.is-active {
                color: #EE3524;
              }
              &:hover {
                color: #676767;
                cursor: pointer;
              }
            }
          }
        }
      }
    }

    &.open {
      left: 0;
      .trigger {
      }
    }
  }

  .practices {
    left: 0;
    margin: 0;
    padding: 0;
    width: calc(100vw - 48px);
    position: relative;
    max-width: 720px;
    background-color: #F0EDEB;
    .practice {
      position: relative;
      margin-top: 0;
      padding: 0 20px 6px 20px;
      max-width: 560px;
      &:last-of-type {
        min-height: 100vh;
      }
      .practice-title {
        margin: 0 0 20px 0;
        font-family: 'Marklight';
        padding-top: 46px;
        color: #EE3524;
        font-size: 24px;
      }

      .practice-body {

        font-size: 15px;
        line-height: 1.3;
        h3 {
          color: #808080;
          margin-bottom: 6px;
        }

        ul {
          li {
            padding: 10px 0;
            margin-left: 14px;
            list-style: initial;
            h3 {
              margin: 0;
            }
          }
        }

      }

    }

  }

}

</style>
