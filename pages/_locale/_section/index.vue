<template>
  <div class="section-wrapper" v-if="isReady">

    <div class="bg-wrapper" v-if="section.image">
      <div class="bg" v-bind:style="{ backgroundImage: 'url(' + baseUrl + section.image.path + ')' }"></div>
    </div>

    <p class="title">{{ title }}</p>

    <!-- PARTNERS -->
    <div v-if="sectionIs === 'partners'" class="section partners">  

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

    <!-- PRACTICES -->
    <div v-if="sectionIs === 'practices'" class="section practice-areas">

      <div class="controls">
        <scrollactive
          class="anchors"
          :offset="5"
          :duration="800"
          :clickToScroll="true">
          <ul>
            <li v-for="(practice, index) in section" :key="index">
              <a :href="'#' + practice[keys.title_slug]"
                class="tile-anchor scrollactive-item">
                  {{ practice[keys.title_slug] }}
              </a>
            </li>
          </ul>
        </scrollactive>
      </div>

      <div class="practices-content">
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
      
      <div v-html="section[0].body"></div>

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
    'siteMap'
  ]),
  data () {
    return {
      isReady: false,
      baseUrl: process.env.apiBaseUrl,
      styles: gmStyles
    }
  },
  async asyncData ({store, env, params}) {
    let query = ''
    let title = ''
    let sectionIs = ''

    store.state.siteMap.links[params.locale].map((link) => {
      if (link.value.title_slug === params.section && link.field.name !== 'page') {
        query = env.apiUrl + '/collections/get/' + link.field.name + '?token=' + env.apiToken
        title = link.value.title
        sectionIs = link.field.name
      }
      if (link.value.title_slug === params.section && link.field.name === 'page') {
        query = env.apiUrl + '/collections/get/pages?token=' + env.apiToken + '&filter[_id]=' + link.value.page._id
        title = link.value.title
        sectionIs = link.value.title_slug
      }
    })

    let { data } = await axios.get(`${query}`)

    let keys = mutateKeysForLocale(data.fields, params.locale)

    return {
      title: title,
      sectionIs: sectionIs,
      section: data.entries,
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
        .from('.bg-wrapper', 0.6, {opacity: 0, width: 0, clearProps: 'all'}, 0)
        .from('.title', 1, {x: -20, opacity: 0}, 0)
        .staggerFrom('.partner-link', 0.6, {opacity: 0}, 0.2, 0.2)
    },
    leave (el, done) {
      let tlLeave = new TimelineMax({onComplete: done})
      tlLeave.to('.bg-wrapper', 0.5, {opacity: 0}, 0)
        .staggerTo('.partner-link', 0.6, {opacity: 0}, 0.1, 0)
        .to('.title', 0.4, {x: -20, opacity: 0}, 0)
    }
  }
}
</script>

<style lang="scss">
@import '~assets/css/vars.scss';
 .section-wrapper {
   width: 68.75vw;

    .bg-wrapper {
      position: fixed;
      top: 0;
      right: 0;
      height: 100vh;
      overflow: hidden;
      width: 37.5vw;
      .bg {
        width: calc(37.5vw + 60px);
        position: absolute;
        right: 0;
        height: 100%;
        background-size: cover;
      }
    }

    .title {
      font-family: 'Marklight';
      color: #EE3524;
      margin: 0 0 6px 0;
      font-size: 38px;
      position: fixed;
      padding: 63px 0 0 6.25vw;
      word-spacing: 100vw;
      width: 25vw;
      @include for-big-desktop-up {
        word-spacing: inherit;
      }
    }

    .section {
    }

    .partners {
      padding: 110px 0 0 6.25vw;
      ul {
        li {
          padding: 6px 0;
          .partner-link {
            font-family: 'MarkLight';
            color: #95989A;
            margin: 0;
            font-size: 38px;
            transition: color .3s;
            &:hover {
              color: #676767;
            }
          }
        }
      }
    }

    .practice-areas {

      .controls {
        position: fixed;
        z-index: 200;
        padding: 66px 0 0 0;
        left: 6.25vw;
        top: 0;
        width: 25vw;
        height: 100vh;
        // border-left: 1px solid rgba(149, 152, 154, 0.2);
        overflow: hidden;

        .anchors {
          margin-top: 146px;
          position: relative;
          padding-right: 3.125vw;
          @include for-big-desktop-up {
            margin-top: 199px;
          }
          ul {
            li {
              padding: 0 0 10px 0;
              @include for-big-desktop-up {
                padding: 0 0 20px 0;
              }
              .tile-anchor {
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

      .practices-content {
        margin-left: 31.25vw;
        padding: 0;
        width: 37.5vw;
        max-width: 720px;
        border-left: 1px solid rgba(149, 152, 154, 0.2);
        overflow-x: hidden;
        background-color: white;
        position: relative;

        .practice {
          padding: 0 3.125vw 0 3.125vw;
          position: relative;
          margin-top: 0;
          &:first-of-type {
            margin-top: 5px;
          }
          &:last-of-type {
            min-height: 100vh;
          }

          .practice-title {
            margin-top: 0;
            font-family: 'Marklight';
            font-size: 38px;
            color: #808080;
            padding-top: 200px;
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
            p:last-of-type {
              margin-bottom: 0;
            }
          }
        }
      }
    }
    .contact {
      .vue-map-container {
        width: 50vw;
        height: 50vh;
        left: 6.25vw;
        position: absolute;
        top: 50vh;
      }
    }
 }
</style>

