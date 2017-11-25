<template>
  <div class="homepage">
    {{ home.title }}
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
          title: homepage.title
        }
      } else {
        localizedHome = {
          title: homepage.title_fr
        }
      }
    })
    return { home: localizedHome }
  }
}
</script>

<style lang="scss" scoped>
  .homepage {
    position: relative;
    left: 300px;
  }
</style>
