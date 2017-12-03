<template>
  <transition name="home-transition">
    <div class="homepage">
      <div class="home-content">
        <p class="home-title">{{ home.title }}</p>
        <div v-html="home.body" class="home-body"></div>
      </div>
      <div class="homepage-bg-wrapper right">
        <div class="homepage-bg" v-bind:style="{ backgroundImage: 'url(' + baseUrl + home.image.path + ')' }"></div>
      </div>
      <div class="homepage-bg-wrapper left">
        <div class="homepage-bg" v-bind:style="{ backgroundImage: 'url(' + baseUrl + home.image.path + ')' }"></div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
import { TimelineMax } from 'gsap'
import axios from 'axios'
export default {
  computed: mapState([
    'homePage'
  ]),
  async asyncData ({store, env, params}) {
    let id = store.state.homePage.page._id
    let localizedHome = {
      title: ''
    }
    let { data } = await axios.get(`${env.apiUrl}/collections/get/pages?token=${env.apiToken}&filter[_id]=${id}`)
    data.entries.map((homepage) => {
      if (params.locale === 'en') {
        localizedHome = {
          title: homepage.title,
          body: homepage.body,
          image: homepage.image
        }
      } else {
        localizedHome = {
          title: homepage.title_fr,
          body: homepage.body_fr,
          image: homepage.image
        }
      }
    })
    return { home: localizedHome }
  },
  data () {
    return {
      baseUrl: process.env.apiBaseUrl
    }
  },
  transition: {
    name: 'home-transition',
    appear: true,
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
  .home-content{
    width: 50vw;
    margin-left: 6.25vw;
    border-right: 1px solid rgba(149, 152, 154, 0.2);
    min-height: 100vh;
    .home-title {
      margin: 0 0 0 6.25vw;
      padding-top: 55px;
      font-family: 'MarkLight';
      font-size: 50px;
      color: #EE3524;
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
    position: fixed;
    top: 0;
    height: 100vh;
    overflow: hidden;
    .homepage-bg {
      position: absolute;
      height: 100%;
      background-size: cover;
    }
  }

  .right {
    right: 0;
    width: 37.5vw;
    .homepage-bg {
      width: calc(37.5vw + 60px);
      right: 0;
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

</style>
