<template>
  <div class="section practice-areas">

    <div class="controls">
      <div class="inner">

        <scrollactive
          class="anchors"
          :offset="5"
          :duration="800"
          :clickToScroll="true">
          <ul>
            <li v-for="(practice, index) in section" :key="index">
              <a :href="'#' + practice[keys.title_slug]"
                class="anchor scrollactive-item">
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
    title: {
      type: String
    }
  }
}
</script>

<style lang="scss">
@import '~assets/css/vars.scss';

.practice-areas {
  .controls {
    width: calc(100vw - 48px);
    position: relative;
    left: 0;
    padding: 20px 0;
    z-index: 200;
    background-color: #2F2F2F;
    @include for-tablet-landscape-up {
      width: 56.25vw;
      background-color: unset;
    }
    @include for-tablet-landscape-only {
      width: 37.5vw;
      position: fixed;
      top: 150px;
    }
    @include for-small-desktop-up {
      padding: 0;
      margin: unset;
      position: fixed;
      left: 6.25vw;
      top: 0;
      width: 25vw;
      height: 100vh;
      overflow: hidden;
    }
    .inner {
      padding: 0 20px;
      @include for-tablet-landscape-up {
        padding: 40px 50% 50px 50px;
      }
      @include for-tablet-landscape-only {
        padding: 0 50px 0 50px;
      }
      @include for-small-desktop-up {
        padding: 0 20px;
      }
      @include for-desktop-up {
        padding: 0 3.125vw;
      }

      .anchors {
        position: relative;
        @include for-small-desktop-up {
          margin-top: 212px;
        }
        @include for-big-desktop-up {
          margin-top: 265px;
        }

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
            @include for-small-desktop-up {
              border-bottom: unset;
            }
            @include for-big-desktop-up {
              padding: 0 0 20px 0;
            }
            .anchor {
              font-size: 16px;
              transition: color .3s;
              @include for-big-desktop-up {
                font-size: 20px;
              }
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
  }

  .practices {
    left: 0;
    padding: 0;
    width: calc(100vw - 48px);
    position: relative;
    max-width: 720px;
    @include for-tablet-landscape-up {
      width: 56.25vw;
      border-left: 1px solid rgba(149, 152, 154, 0.2);
      overflow-x: hidden;
      left: 37.5vw;
      top: 50vh;
    }
    @include for-small-desktop-up {
      top: 0;
      left: 31.25vw;
      width: calc(37.5vw -1px);
      background-color: white;
    }

    .practice {
      position: relative;
      margin-top: 0;
      padding: 0 40px 0 20px;
      @include for-tablet-landscape-up {
        padding: 0 20% 0 50px;
      }
      @include for-desktop-up {
        padding: 0 3.125vw;
      }
      &:first-of-type {
        margin-top: 5px;
      }
      &:last-of-type {
        min-height: 100vh;
      }

      .practice-title {

        margin: 0 0 20px 0;
        font-family: 'Marklight';
        padding-top: 20px;
        color: #EE3524;
        font-size: 24px;
        @include for-tablet-landscape-up {
          padding-top: 50px;
        }
        @include for-small-desktop-up {
          font-size: 38px;
          color: #808080;
          margin: 0 0 38px 0;
          padding-top: 200px;
        }
        @include for-big-desktop-up {
          padding-top: 255px;
        }
      }

      .practice-body {

        font-size: 15px;
        line-height: 1.3;
        @include for-big-desktop-up {
          font-size: 18px;
        }

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
