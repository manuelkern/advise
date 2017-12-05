<template>
  <div class="section-wrapper" v-if="isReady">

    <div class="bg-wrapper right" v-if="sectionImage" v-bind:class="$route.params.section">
      <div class="bg" v-bind:style="{ backgroundImage: 'url(' + sectionImage + ')' }"></div>
    </div>

    <div v-if="sectionImage && sectionIs !== 'contact' && layout.is !== 'tablet'" class="bg-wrapper left one-c">
      <div class="bg" v-bind:style="{ backgroundImage: 'url(' + sectionImage + ')' }"></div>
    </div>

    <p class="title">{{ title }}</p>

    <!-- PARTNERS -->
    <div v-if="sectionIs === 'partners'" class="section partners">

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

    <!-- PRACTICES -->
    <div v-if="sectionIs === 'practices'" class="section practice-areas">

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

    <!-- CONTACT -->
    <div v-if="sectionIs === 'contact'" class="section contact">
      
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

  </div>

</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import { TimelineMax } from 'gsap'
import { mutateKeysForLocale, gmStyles } from '~/utils/utils.js'
export default {
  computed: mapState([
    'siteMap',
    'layout'
  ]),
  data () {
    return {
      isReady: false,
      styles: gmStyles
    }
  },
  async asyncData ({store, env, params}) {
    let query = ''
    let title = ''
    let sectionIs = ''
    let sectionImage = ''

    store.state.siteMap.links[params.locale].map((link) => {
      if (link.value.title_slug === params.section && link.field.name !== 'page') {
        query = env.apiUrl + '/collections/get/' + link.field.name + '?token=' + env.apiToken
        title = link.value.title
        sectionImage = env.apiBaseUrl + link.value.image.path
        sectionIs = link.field.name
      }
      if (link.value.title_slug === params.section && link.field.name === 'page') {
        query = env.apiUrl + '/collections/get/pages?token=' + env.apiToken + '&filter[_id]=' + link.value.page._id
        title = link.value.title
        sectionImage = env.apiBaseUrl + link.value.image.path
        sectionIs = link.value.title_slug
      }
    })

    let { data } = await axios.get(`${query}`)

    let keys = mutateKeysForLocale(data.fields, params.locale)

    return {
      title: title,
      section: data.entries,
      sectionIs: sectionIs,
      sectionImage: sectionImage,
      keys: keys,
      isReady: true
    }
  },
  transition: {
    name: 'section-transition',
    appear: true,
    css: false,
    enter (el, done) {
      let tlEnter = new TimelineMax({onComplete: done})
      tlEnter.from('.bg', 3, {x: 60})
        .from('.right', 0.6, {opacity: 0, width: 0, clearProps: 'all'}, 0)
        .from('.left', 0.6, {opacity: 0, width: 0, clearProps: 'all'}, 0)
        .from('.controls, .title', 1, {x: -20, opacity: 0}, 0)
        .from('.practice', 1, {opacity: 0, clearProps: 'opacity'}, 0)
        .staggerFrom('.partner-link', 0.6, {opacity: 0}, 0.2, 0.2)
    },
    leave (el, done) {
      let tlLeave = new TimelineMax({onComplete: done})
      tlLeave.to('.right', 0.5, {opacity: 0, width: 0, clearProps: 'width'}, 0)
        .to('.left', 0.5, {opacity: 0, width: 0, clearProps: 'width'}, 0)
        .staggerTo('.partner-link', 0.5, {opacity: 0}, 0.1, 0)
        .to('.controls, .title', 0.4, {x: 20, opacity: 0}, 0)
        .to('.practice', 0.5, {opacity: 0}, 0)
    }
  }
}
</script>

<style lang="scss">
@import '~assets/css/vars.scss';
 .section-wrapper {
   width: calc(100vw - 48px);
   @include for-small-desktop-up {
     width: 68.75vw;
   }

    .bg-wrapper {
      position: relative;
      top: 0;
      height: 55vh;
      @include for-small-desktop-up {
        position: fixed;
        height: 100vh;
        overflow: hidden;
      }
      .bg {
        width: calc(100vw + 60px);
        position: absolute;
        height: 100%;
        background-size: cover;
        @include for-small-desktop-up {
          width: calc(37.5vw + 60px);
        }
      }
    }

    .left {
      left: 0;
      .bg {
        right: 0;
        background-position: 0 100%;
      }
    }

    .right {
      right: 0;
      width: calc(100vw - 48px);
      @include for-small-desktop-up {
        width: 37.5vw;
      }
      &.contact {
        display: none;
        @include for-small-desktop-up {
          display: block;
        }
      }
      .bg {
        background-position: 50% 50%;
        right: 0;
      }
    }

    .title {
      position: absolute;
      font-family: 'Marklight';
      color: #EE3524;
      font-size: 38px;
      margin: 0;
      word-spacing: 56.25vw;
      width: inherit;
      padding: 0;
      left: 20px;
      top: 25px;
      @include for-small-desktop-up {
        position: fixed;
        padding: 0 20px;
        left: 6.25vw;
        top: 60px;
      }
      @include for-desktop-up {
        padding: 0 3.125vw;
      }
      @include for-big-desktop-up {
        word-spacing: inherit;
      }
    }

    .section {
      .controls {
        width: calc(100vw - 48px);
        position: relative;
        left: 0;
        padding: 20px 0;
        z-index: 200;
        background-color: #2F2F2F;
        @include for-small-desktop-up {
          background-color: unset;
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
          @include for-desktop-up {
            padding: 0 3.125vw;
          }
        }
      }
    }

    .partners {

      .controls {
        min-height: calc(45vh - 40px);
        @include for-small-desktop-up {
          min-height: unset;
          width: 56.25vw;
        }
        ul {
          margin: 0;
          @include for-small-desktop-up {
            margin: 110px 0 0 0;
          }
          li {
            padding: 10px 0;
            @include for-small-desktop-up {
              padding: 6px 0;
            }
            .partner-link {
              font-family: 'MarkLight';
              color: #95989A;
              margin: 0;
              transition: color .3s;
              font-size: 18px;
              &:hover {
                color: #676767;
              }
              @include for-small-desktop-up {
                font-size: 38px;
              }
            }
          }
        }
      }
    }

    .practice-areas {

      .controls {

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
              padding: 0 0 10px 0;
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

      .practices {
        left: 0;
        padding: 0;
        width: calc(100vw - 48px);
        position: relative;
        @include for-small-desktop-up {
          left: 31.25vw;
          width: calc(37.5vw -1px);
          max-width: 720px;
          border-left: 1px solid rgba(149, 152, 154, 0.2);
          overflow-x: hidden;
          background-color: white;
        }

        .practice {
          position: relative;
          margin-top: 0;
          padding: 0 40px 0 20px;
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

    .contact {
      .controls {
        width: calc(100vw - 48px);
        margin-top: 55vh;
        min-height: 45vh;
        @include for-small-desktop-up {
          min-height: unset;
          margin-top: unset;
          border-left: 1px solid rgba(149, 152, 154, 0.2);
          width: 56.25vw;
        }
        .inner {
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
              @include for-small-desktop-up {
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
        @include for-small-desktop-up {
          top: unset;
          width: 50vw;
          height: 50vh;
          left: 6.25vw;
          bottom: 65px;
        }
        @include for-desktop-up {
          left: 9.375vw;
          width: 46.875vw;
        }
      }
    }
 }
</style>

