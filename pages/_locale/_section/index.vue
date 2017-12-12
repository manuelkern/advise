<template>
  <div class="section-wrapper" v-if="isReady">

    <div class="bg-wrapper right" v-if="sectionImage" v-bind:class="sectionIs">
      <div class="bg" v-bind:style="{ backgroundImage: 'url(' + sectionImage + ')' }"></div>
      <div class="overlay"></div>
    </div>

    <div v-if="sectionImage && sectionIs !== 'contact' && !layout.isMobileDevice" class="bg-wrapper left one-c">
      <div class="bg" v-bind:style="{ backgroundImage: 'url(' + sectionImage + ')' }"></div>
      <div class="overlay"></div>
    </div>

    <!-- PARTNERS -->
    <partners v-if="sectionIs === 'partners'" :section="section" :title="title"></partners>

    <!-- PRACTICES -->
    <practices v-if="sectionIs === 'practices' && layout.is !== 'mobile'" :section="section" :title="title" :keys="keys"></practices>
    <practicesmobile v-if="sectionIs === 'practices' && layout.is === 'mobile'" :section="section" :keys="keys" :title="title" :trigger="layout.panelTrigger[$route.params.locale].open"></practicesmobile>

    <!-- CONTACT -->
    <contact v-if="sectionIs === 'contact'" :section="section" :title="title"></contact>

  </div>

</template>

<script>
import axios from 'axios'
import Partners from '~/components/Partners'
import Practices from '~/components/Practices'
import PracticesForMobile from '~/components/PracticesForMobile'
import Contact from '~/components/Contact'
import { mapState, mapActions } from 'vuex'
import { TimelineMax } from 'gsap'
import { mutateKeysForLocale } from '~/utils/utils.js'
export default {
  computed: mapState([
    'siteMap',
    'layout'
  ]),
  components: {
    'partners': Partners,
    'practices': Practices,
    'practicesmobile': PracticesForMobile,
    'contact': Contact
  },
  data () {
    return {
      isReady: false
    }
  },
  head () {
    return {
      title: 'Advise - ' + this.title,
      meta: [
        { hid: 'description', name: 'description', content: this.metadescription }
      ]
    }
  },
  async asyncData ({store, env, params}) {
    let query = ''
    let title = ''
    let sectionIs = ''
    let sectionImage = ''
    let metadescription = ''

    store.state.siteMap.links[params.locale].map((link) => {
      if (link.value.title_slug === params.section && link.field.name !== 'page') {
        query = env.apiUrl + '/collections/get/' + link.field.name + '?token=' + env.apiToken
        title = link.value.title
        sectionImage = env.apiBaseUrl + link.value.image.path
        sectionIs = link.field.name
        metadescription = link.value.metadescription
      }
      if (link.value.title_slug === params.section && link.field.name === 'page') {
        query = env.apiUrl + '/collections/get/pages?token=' + env.apiToken + '&filter[_id]=' + link.value.page._id
        title = link.value.title
        sectionImage = env.apiBaseUrl + link.value.image.path
        sectionIs = link.value.title_slug
        metadescription = link.value.metadescription
      }
    })

    let { data } = await axios.get(`${query}`)

    let keys = mutateKeysForLocale(data.fields, params.locale)

    store.commit('setCurrentSection', sectionIs)

    return {
      title: title,
      section: data.entries,
      sectionIs: sectionIs,
      sectionImage: sectionImage,
      keys: keys,
      metadescription: metadescription,
      isReady: true
    }
  },
  methods: {
    ...mapActions({
      setCurrentSection: 'setCurrentSection'
    }),
    sectionEnter () {
      console.log('sectionEnters')
    }
  },
  transition: {
    name: 'section-transition',
    css: false,
    enter (el, done) {
      let tlEnter = new TimelineMax({onComplete: done})
      tlEnter.from('.bg', 3, {x: 60})
        .from('.right', 0.6, {opacity: 0, width: 0, clearProps: 'all'}, 0)
        .from('.left', 0.6, {opacity: 0, width: 0, clearProps: 'all'}, 0.5)
        .from('.controls, .title', 1, {x: -20, opacity: 0}, 0)
        .from('.content', 1, {opacity: 0, clearProps: 'opacity'}, 0)
        .staggerFrom('.partner-link', 0.6, {opacity: 0}, 0.2, 0.2)
    },
    leave (el, done) {
      let tlLeave = new TimelineMax({onComplete: done})
      tlLeave.to('.right', 0.5, {opacity: 0}, 0)
        .to('.left', 0.5, {opacity: 0}, 0)
        .staggerTo('.partner-link', 0.5, {opacity: 0}, 0.1, 0)
        .to('.controls, .title', 0.4, {x: 20, opacity: 0}, 0)
        .to('.content', 0.5, {opacity: 0}, 0)
    }
  }
}
</script>

<style lang="scss">
@import '~assets/css/vars.scss';
 .section-wrapper {

  @include for-tablet-landscape-up {
    width: 68.75vw;
  }

  .bg-wrapper {
    position: relative;
    top: 0;
    height: 55vh;
    overflow: hidden;
    @include for-tablet-landscape-up {
      position: fixed;
      height: 100vh;
    }
    .overlay {
      position: absolute;
      width: 100%;
      height: 100%;
    }
    .bg {
      width: calc(100vw + 60px);
      position: absolute;
      height: 100%;
      background-size: cover;
      @include for-tablet-landscape-up {
        width: calc(37.5vw + 60px);
      }
    }
  }

  .left {
    left: 0;
    .overlay {
      background-color: rgba(44, 43, 42, 0.5);
    }
    .bg {
      right: 0;
      background-position: 0 100%;
    }
  }

  .right {
    right: 0;
    width: calc(100vw - 48px);
    .overlay {
      background-color: rgba(44, 43, 42, 0.5);
    }
    @include for-tablet-landscape-only {
      right: 6.25vw;
    }
    @include for-tablet-landscape-up {
      width: 37.5vw;
    }
    .bg {
      background-position: 50% 50%;
      right: 0;
    }
    &.practices {
      @include for-tablet-landscape-only {
        width: 56.25vw;
        height: 50vh;
        position: absolute;
      }
      .bg {
        @include for-tablet-landscape-only {
          background-position: 50% 20%;
          position: absolute;
          width: calc(62.5vw + 60px);
        }
      }
    }
    &.contact {
      display: none;
      @include for-tablet-landscape-up {
        display: block;
      }
    }
  }
 }
</style>

