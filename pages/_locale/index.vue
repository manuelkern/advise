<template>
  <div class="homepage">
    <div class="home-content">
      <p class="home-title">{{ home.title }}</p>
      <div v-html="home.body" class="home-body"></div>
    </div>
    <div class="homepage-bg-wrapper">
      <div class="homepage-bg" v-bind:style="{ backgroundImage: 'url(' + baseUrl + home.image.path + ')' }"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
export default {
  computed: mapState([
    'homePage'
  ]),
  async asyncData ({store, env, params}) {
    let id = store.state.homePage.section_link._id
    let localizedHome = {
      title: ''
    }
    let { data } = await axios.get(`${env.apiUrl}/collections/get/section?token=${env.apiToken}&filter[_id]=${id}`)
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
  }
}
</script>

<style lang="scss" scoped>
  .home-content{
    width: 31.25vw;
    margin-left: 6.25vw;
    font-family: 'MarkLight';
    .home-title {
      font-size: 64px;
    }
    .home-body {
      p {
        color: red;
        &:first-child {
          font-size: 38px;
        }
      }
    }
  }
  .homepage-bg-wrapper {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 37.5vw;
    overflow: hidden;
    .homepage-bg {
      width: calc(37.5vw + 60px);
      position: absolute;
      right: 0;
      height: 100%;
      background-size: cover;
    }
  }
</style>
