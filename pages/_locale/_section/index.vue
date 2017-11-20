<template>
  <div class="section">

    <!-- PARTNERS -->
    <div v-if="siteMap.currentIndex === 0" class="partners">
      {{ section.title }}
    </div>

    <!-- PRACTICE-AREAS -->
    <div v-if="siteMap.currentIndex === 1" class="practice-areas">
      {{ section.title }}
    </div>
    
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
export default {
  computed: mapState([
    'siteMap'
  ]),
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
    let { data } = await axios.get(`${env.cockpit.apiUrl}/collections/get/section?token=${env.cockpit.apiToken}&filter[_id]=${id}`)
    //
    // SET LOCALIZED KEYS
    //
    let fields = data.fields
    let keys = Object.keys(fields)
    keys.forEach((key) => {
      if (fields[key].localize) {
        if (params.locale === 'en') {
          localizedKeys[key] = (key)
        } else {
          localizedKeys[key] = (key + '_' + params.locale)
        }
      } else {
        notLocalizedKeys[key] = (key)
        notLocalizedKeys._id = '_id'
      }
    })
    let sectionKeysAndValues = Object.assign(localizedKeys, notLocalizedKeys)

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

    return { section: section }
  }
}
</script>

<style lang="scss" scoped>
 .section {
    position: absolute;
    left: 200px; 
    .partners {
      background-color: red;
    }
    .practice-areas {
      background-color: green;
    }
 }
</style>

