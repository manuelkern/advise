<template>
  <div class="section-wrapper" v-if="isReady">
    <div class="bg-wrapper">
      <div class="bg" v-bind:style="{ backgroundImage: 'url(' + baseUrl + section.image.path + ')' }"></div>
    </div>
    <p class="title">{{ section.title }}</p>
    <!-- PARTNERS -->
    <div v-if="siteMap.currentIndex === 0" class="section partners">
      <ul>
        <li v-for="partner in section.partners" :key="partner.id">
          <nuxt-link
            class="partner-link"
            :to="{
              name: 'locale-section-partner',
              params: {
                locale: $route.params.locale,
                section: section.title_slug,
                partner: partner.name_slug
              }
            }">
            {{ partner.name }}</nuxt-link>
        </li>
      </ul>
    </div>

    <!-- PRACTICE-AREAS -->
    <div v-if="siteMap.currentIndex === 1" class="section practice-areas">
    </div>

    <!-- CONTACT -->
    <div v-if="siteMap.currentIndex === 2" class="section contact">
      <gmap-map
        :center="{lat: section.location.lat, lng: section.location.lng}"
        :zoom="17"
        :options="{styles: styles}">
        <gmap-marker
          :position="section.location"
          :clickable="true"
          :draggable="true"
        ></gmap-marker>
      </gmap-map>
    </div>
    
  </div>
  <div v-else>
    <div>Loading...</div>
  </div>
</template>


<script>
import axios from 'axios'
import { mapState } from 'vuex'
import { TimelineMax } from 'gsap'
import { forIn, mutateKeysForLocale, gmStyles } from '~/utils/utils.js'
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
    let id = null
    let section = {}

    store.state.siteMap.links[params.locale].map((link) => {
      if (link.section_title_slug === params.section) {
        id = link.section_link._id
      }
    })

    let { data } = await axios.get(`${env.apiUrl}/collections/get/section?token=${env.apiToken}&filter[_id]=${id}&populate=1`)

    let keys = mutateKeysForLocale(data.fields, params.locale)

    forIn(keys, (val, key) => {
      section[key] = data.entries[0][val]
    })

    return { section: section, isReady: true }
  },
  transition: {
    name: 'section-transition',
    appear: true,
    css: false,
    enter (el, done) {
      let tlEnter = new TimelineMax({onComplete: done})
      tlEnter.from('.bg', 3, {x: 60})
        .from('.bg-wrapper', 0.6, {opacity: 0, width: 0}, 0)
        .from('.title', 1, {y: -20, opacity: 0}, 0)
        .staggerFrom('.partner-link', 0.6, {opacity: 0}, 0.2, 0.2)
    },
    leave (el, done) {
      let tlLeave = new TimelineMax({onComplete: done})
      tlLeave.to('.bg-wrapper', 0.5, {opacity: 0}, 0)
        .staggerTo('.partner-link', 0.6, {opacity: 0}, 0.1, 0)
        .to('.title', 0.4, {y: -20, opacity: 0}, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
 .section-wrapper {
   padding: 63px 0 0 6.25vw;
   width: 56.25vw;
    .bg-wrapper {
      position: fixed;
      top: 0;
      right: 0;
      height: 100vh;
      width: 37.5vw;
      overflow: hidden;
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
    }
    .section {
    }
    .partners {
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

    },
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

