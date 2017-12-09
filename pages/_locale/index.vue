<template>
  <transition name="home-transition">
    <div class="homepage">

      <p class="home-title">{{ home.title }}</p>

      <div class="homepage-bg-wrapper right">
        <div class="homepage-bg" v-bind:style="{ backgroundImage: 'url(' + baseUrl + homePage.image.path + ')' }"></div>
      </div>

      <div class="homepage-bg-wrapper left" v-if="!layout.isMobileDevice">
        <div class="homepage-bg" v-bind:style="{ backgroundImage: 'url(' + baseUrl + homePage.image.path + ')' }"></div>
      </div>

      <div class="home-content">
        <div v-html="home.body" class="home-body"></div>
      </div>

    </div>
  </transition>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { TimelineMax } from 'gsap'
import axios from 'axios'
export default {
  computed: mapState([
    'homePage',
    'layout'
  ]),
  async asyncData ({store, env, params}) {
    let id = store.state.homePage.page._id
    let localizedHome = {
      title: '',
      body: ''
    }
    let { data } = await axios.get(`${env.apiUrl}/collections/get/pages?token=${env.apiToken}&filter[_id]=${id}`)
    data.entries.map((homepage) => {
      if (params.locale === 'en') {
        localizedHome = {
          title: homepage.title,
          body: homepage.body
        }
      } else {
        localizedHome = {
          title: homepage.title_fr,
          body: homepage.body_fr
        }
      }
    })
    store.commit('setCurrentSection', 'homepage')
    return { home: localizedHome }
  },
  data () {
    return {
      baseUrl: process.env.apiBaseUrl
    }
  },
  methods: {
    ...mapActions({
      setCurrentSection: 'setCurrentSection'
    })
  },
  transition: {
    name: 'home-transition',
    css: false,
    enter (el, done) {
      let tlEnter = new TimelineMax({onComplete: done})
      tlEnter.from('.homepage-bg', 3, {x: 60})
        .from('.right', 0.6, {opacity: 0, width: 0, clearProps: 'all'}, 0)
        .from('.left', 0.6, {opacity: 0, width: 0, clearProps: 'all'}, 0)
        .from('.home-title', 1, {x: -20, opacity: 0}, 0)
        .from('.home-body', 1, {x: 20, opacity: 0}, 0)
    },
    leave (el, done) {
      let tlLeave = new TimelineMax({onComplete: done})
      tlLeave.to('.right', 0.5, {opacity: 0, width: 0}, 0)
        .to('.left', 0.6, {opacity: 0, width: 0}, 0)
        .to('.home-title', 0.4, {x: -20, opacity: 0}, 0)
        .to('.home-title', 1, {x: -20, opacity: 0}, 0)
        .to('.home-content', 1, {x: 20, opacity: 0}, 0)
    }
  }
}
</script>

<style lang="scss">
@import '~assets/css/vars.scss';

.homepage {

  .home-title {
    position: absolute;
    padding: 23px 25px;
    top: 0;
    left: 0;
    margin: 0;
    font-family: 'MarkLight';
    color: #EE3524;
    z-index: 800 !important;
    font-size: 38px;
    width: calc(100vw - 48px);
    @include for-tablet-landscape-up {
      left: 6.25vw;
      padding-top: 55px;
      width: inherit;
      font-size: 50px;
    }
  }

  .home-content{
    width: calc(100vw - 48px);
    margin: 0;
    @include for-tablet-landscape-up {
      width: 50vw;
      margin-left: 6.25vw;
      border-right: 1px solid rgba(149, 152, 154, 0.2);
      min-height: 100vh;
    }
    .home-body {
      margin: 75px 0 0 12.5vw;
      padding-right: 6.25vw;
      p {
        &:first-child {
          font-family: 'MarkLight';
          font-size: 32px;
        }
      }
      a {
        color: #EE3524;
      }
    }
  }

  .homepage-bg-wrapper {
    position: relative;
    top: 0;
    height: 55vh;
    overflow: hidden;
    @include for-tablet-landscape-up {
      position: fixed;
      height: 100vh;
    }
    .homepage-bg {
      position: absolute;
      height: 100%;
      background-size: cover;
    }

  }

  .right {
    width: 100vw;
    right: 0;
    @include for-tablet-landscape-up {
      width: 37.5vw;
    }
    .homepage-bg {
      right: 0;
      width: calc(100vw + 60px);
      @include for-tablet-landscape-up {        
        width: calc(37.5vw + 60px);
      }
    }
  }

  .left {
    left: 0;
    width: 6.25vw;
    .homepage-bg {
      width: calc(6.25vw + 60px);
      right: 0;
      background-position: 100% 100%;
    }
  }

}

</style>
