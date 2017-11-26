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
export default {
  computed: mapState([
    'siteMap'
  ]),
  data () {
    return {
      isReady: false,
      baseUrl: process.env.apiBaseUrl,
      styles: [
        { 'featureType': 'water',
          'elementType': 'geometry',
          'stylers': [
            { 'color': '#e9e9e9' },
            { 'lightness': 17 }
          ]
        },
        {
          'featureType': 'landscape',
          'elementType': 'geometry',
          'stylers': [
            { 'color': '#f5f5f5' },
            { 'lightness': 20 }
          ]
        },
        {
          'featureType': 'road.highway',
          'elementType': 'geometry.fill',
          'stylers': [
            { 'color': '#ffffff' },
            { 'lightness': 17 }
          ]
        },
        {
          'featureType': 'road.highway',
          'elementType': 'geometry.stroke',
          'stylers': [
            { 'color': '#ffffff' },
            { 'lightness': 29 },
            { 'weight': 0.2 }
          ]
        },
        {
          'featureType': 'road.arterial',
          'elementType': 'geometry',
          'stylers': [
            { 'color': '#ffffff' },
            { 'lightness': 18 }
          ]
        },
        {
          'featureType': 'road.local',
          'elementType': 'geometry',
          'stylers': [
            { 'color': '#ffffff' },
            { 'lightness': 16 }
          ]
        },
        {
          'featureType': 'poi',
          'elementType': 'geometry',
          'stylers': [
            { 'color': '#f5f5f5' },
            { 'lightness': 21 }
          ]
        },
        {
          'featureType': 'poi.park',
          'elementType': 'geometry',
          'stylers': [
            { 'color': '#dedede' },
            { 'lightness': 21 }
          ]
        },
        {
          'elementType': 'labels.text.stroke',
          'stylers': [
            { 'visibility': 'on' },
            { 'color': '#ffffff' },
            { 'lightness': 16 }
          ]
        },
        {
          'elementType': 'labels.text.fill',
          'stylers': [
            { 'saturation': 36 },
            { 'color': '#333333' },
            { 'lightness': 40 }
          ]
        },
        {
          'elementType': 'labels.icon',
          'stylers': [
            { 'visibility': 'off' }
          ]
        },
        {
          'featureType': 'transit',
          'elementType': 'geometry',
          'stylers': [
            { 'color': '#f2f2f2' },
            { 'lightness': 19 }
          ]
        },
        {
          'featureType': 'administrative',
          'elementType': 'geometry.fill',
          'stylers': [
            { 'color': '#fefefe' },
            { 'lightness': 20 }
          ]
        },
        {
          'featureType': 'administrative',
          'elementType': 'geometry.stroke',
          'stylers': [
            { 'color': '#fefefe' },
            { 'lightness': 17 },
            { 'weight': 1.2 }
          ]
        }
      ]
    }
  },
  async asyncData ({store, env, params}) {
    let id = null
    let localizedKeys = {}
    let notLocalizedKeys = {}
    let section = {}
    //
    // GET THE RIGHT ID
    //
    store.state.siteMap.links[params.locale].map((link) => {
      if (link.section_title_slug === params.section) {
        id = link.section_link._id
      }
    })
    //
    // GET SECTION
    //
    let { data } = await axios.get(`${env.apiUrl}/collections/get/section?token=${env.apiToken}&filter[_id]=${id}&populate=1`)
    //
    // SET LOCALIZED KEYS
    //
    let fields = data.fields
    let keys = Object.keys(fields)
    keys.forEach((key) => {
      if (fields[key].localize) {
        if (params.locale === 'en') {
          localizedKeys[key] = (key)
          localizedKeys.title_slug = 'title_slug'
        } else {
          localizedKeys[key] = (key + '_' + params.locale)
          let titleSlug = 'title_' + params.locale + '_slug'
          localizedKeys.title_slug = titleSlug
        }
      } else {
        notLocalizedKeys[key] = (key)
        notLocalizedKeys._id = '_id'
      }
    })
    let sectionKeysAndValues = Object.assign(localizedKeys, notLocalizedKeys)
    //
    // FUNCTION TO LOOP KEYS AND VALUES
    //
    function forIn (obj, fn, thisObj) {
      for (let key in obj) {
        if (exec(fn, obj, key, thisObj) === false) {
          break
        }
      }
      function exec (fn, obj, key, thisObj) {
        return fn.call(thisObj, obj[key], key, obj)
      }
      return forIn
    }
    //
    // BUILD SECTION
    //
    forIn(sectionKeysAndValues, (val, key) => {
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

