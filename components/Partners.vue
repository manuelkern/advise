<template>
  <div class="section partners">

    <p class="title">{{ title }}</p>

    <div class="controls">
      <div class="inner">

        <ul>
          <li v-for="partner in section" :key="partner.id">
            <nuxt-link
              class="partner-link"
              :to="{
                name: 'locale-section-partner',
                params: {
                  locale: $route.params.locale,
                  section: $route.params.section,
                  partner: partner.name_slug
                }
              }">
              {{ partner.name }}</nuxt-link>
          </li>
        </ul>

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
    title: {
      type: String
    }
  }
}
</script>

<style lang="scss">
@import '~assets/css/vars.scss';

.partners {

  .title {
    position: absolute;
    font-family: 'Marklight';
    color: #F0EDEB;
    font-size: 38px;
    margin: 0;
    width: calc(100vw - 88px);
    top: 0;
    left: 0;
    z-index: 210;
    padding: 23px 20px 0 20px;
    @include for-tablet-landscape-up {
      color: #EE3524;
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
    width: calc(100vw - 48px);
    position: relative;
    left: 0;
    padding: 20px 0;
    z-index: 200;
    min-height: calc(45vh - 40px);
    background-color: #D7D4D2;
    @include for-tablet-landscape-up {
      width: 56.25vw;
    }
    @include for-tablet-landscape-only {
      height: calc(100vh - 173px);
    }
    @include for-small-desktop-up {
      min-height: unset;
      padding: 0;
      margin: unset;
      position: fixed;
      left: 6.25vw;
      top: 0;
      width: 56.25vw;
      height: 100vh;
      overflow: hidden;
    }

    .inner {
      padding: 0 20px;
      @include for-tablet-landscape-up {
        padding: 40px 50% 50px 50px;
      }
      @include for-tablet-landscape-only {
        padding: 40px 100px 50px 50px;
      }
      @include for-small-desktop-up {
        padding: 0 3.125vw;
      }

      ul {
        margin: 0;
        @include for-small-desktop-up {
          margin: 110px 0 0 0;
        }

        li {
          padding: 10px 0;
          border-bottom: 1px solid rgba(149, 152, 154, 0.2);
          &:last-of-type {
            border-bottom: unset;
          }
          @include for-small-desktop-up {
            padding: 6px 0;
            border-bottom: unset;
          }
          .partner-link {
            font-family: 'MarkLight';
            color: #8D8B8A;
            margin: 0;
            transition: color .3s;
            font-size: 18px;
            &:hover {
              color: #646464;
            }
            @include for-tablet-landscape-up {
              font-size: 25px;                
            }
            @include for-small-desktop-up {
              font-size: 38px;
            }
          }
        }
      }
    }
  }
}

</style>
