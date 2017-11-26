<template>
  <div class="partners-wrapper">

    <div class="partner-controls">

      <div class="show-partners" v-on:click="togglePanel"><img src="~/assets/images/arrow.svg" class="arrow"></div>

      <p class="__current partner-name">
        {{ currentPartner.name }}
      </p>

      <div class="not-current">
        <p v-for="other in notCurrentPartners" :key="other.id">
          <nuxt-link class="__not-current partner-name"
            :to="{
              name: 'locale-section-partner',
              params: {
                locale: $route.params.locale,
                section: $route.params.section,
                partner: other.name_slug
              }
            }">
            {{ other.name }}
          </nuxt-link>
        </p>
        <span class="not-current-overlay"></span>
      </div>

      <!-- LINKS TO TILE -->

      <scrollactive
        class="tiles-anchors"
        :offset="5"
        :duration="800"
        :clickToScroll="true"
        @itemchanged="updateScroll(...arguments)">
        <ul>
          <li v-for="(tile, index) in currentPartner.tile" :key="tile.id">
            <a :href="'#' + tile.value.title_slug"
              @click.native="setLinkActive($event, tile.value.title_slug)"
              class="tile-anchor scrollactive-item">
                {{ tile.value.title }}
            </a>
          </li>
        </ul>
      </scrollactive>

    </div>

    <!-- MAIN CONTENT -->

    <div class="partner-content">
      <div
        v-for="tile in currentPartner.tile"
        :key="tile.id"
        class="tile"
        v-bind:id="tile.value.title_slug"
        v-bind:class="{active: linkActive === '#' + tile.value.title_slug}">
        <p class="tile-title">{{ tile.value.title }}</p>
        <div v-html="tile.value.body" class="tile-body"></div>
      </div>
    </div>

    <!-- IMAGE -->

    <div class="partner-image">
      <div class="image" v-bind:style="{ backgroundImage: 'url(' + baseUrl + currentPartner.image.path + ')' }"></div>
    </div>

  </div>
</template>

<script>

import { mapState, mapActions } from 'vuex'
import { TimelineMax } from 'gsap'
import axios from 'axios'
import Tile from '~/components/Tile'
export default {
  components: {
    'tile': Tile
  },
  computed: mapState([
    'siteMap',
    'layout'
  ]),
  async asyncData ({store, env, params}) {
    let localizedKeys = {}
    let notLocalizedKeys = {}
    let partners = []
    let Partner = class {}
    //
    // GET PARTNERS
    //
    let { data } = await axios.get(`${env.apiUrl}/collections/get/partner?token=${env.apiToken}`)
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
        notLocalizedKeys.name_slug = 'name_slug'
      }
    })
    let partnerKeysAndValues = Object.assign(localizedKeys, notLocalizedKeys)
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
    // BUILD PARTNERS
    //
    data.entries.map((p, index) => {
      let partner = new Partner()
      forIn(partnerKeysAndValues, (val, key) => {
        partner[key] = p[val]
      })
      partners.push(partner)
    })

    let currentPartner = {}
    let notCurrentPartners = []
    partners.forEach((partner) => {
      if (partner.name_slug === params.partner) {
        currentPartner = partner
      } else {
        notCurrentPartners.push(partner)
      }
    })

    return {
      partners: partners,
      currentPartner: currentPartner,
      notCurrentPartners: notCurrentPartners
    }
  },
  data () {
    return {
      baseUrl: process.env.apiBaseUrl,
      linkActive: ''
    }
  },
  methods: {
    ...mapActions({
      setPanelOpen: 'setPanelOpen',
      resetPanel: 'resetPanel'
    }),
    setLinkActive (event, slug) {
      event.preventDefault()
      this.$data.linkActive = '#' + slug
    },
    updateScroll (e, c, l) {
      history.pushState(null, null, c.hash)
    },
    togglePanel () {
      if (!this.layout.panelOpen) {
        this.panelOpens()
      } else {
        this.panelCloses()
      }
      this.setPanelOpen()
    },
    targetPanel$el () {
      let $t = {
        partners: this.$el.getElementsByClassName('__not-current'),
        overlay: this.$el.getElementsByClassName('not-current-overlay'),
        arrow: this.$el.getElementsByClassName('arrow')
      }
      return $t
    },
    panelOpens () {
      let $t = this.targetPanel$el()
      let tlOpenPartners = new TimelineMax()
      tlOpenPartners.to($t.overlay, 1, {autoAlpha: 0.9})
        .from($t.overlay, 1, {y: '-100%'}, 0)
        .staggerTo($t.partners, 1, {autoAlpha: 1}, 0.4, 0.2)
        .to($t.arrow, 0.3, {rotation: 90}, 0)
    },
    panelCloses () {
      let $t = this.targetPanel$el()
      let tlOpenPartners = new TimelineMax()
      tlOpenPartners.staggerTo($t.partners, 0.5, {autoAlpha: 0}, 0.2, 0)
        .to($t.overlay, 0.5, {autoAlpha: 0}, 0.2)
        .to($t.overlay, 0.5, {y: '-100%', clearProps: 'all'}, 0.2)
        .to($t.arrow, 0.3, {rotation: -90}, 0)
    }
  },
  created () {
    this.resetPanel()
    if (this.$route.hash) {
      this.$data.linkActive = this.$route.hash
    } else {
      this.$data.linkActive = '#' + this.currentPartner.tile[0].value.title_slug
    }
  },
  mounted () {
    window.onhashchange = () => {
      this.$router.push({ name: 'locale-section' })
      // this.$router.go(-1)
    }
  },
  transition: {
    name: 'partner-transition',
    appear: true,
    css: false,
    enter (el, done) {
      let tlEnter = new TimelineMax({onComplete: done})
      tlEnter.from('.image', 3, {x: 60})
        .from('.partner-image', 0.6, {opacity: 0, width: 0}, 0)
        .from('.partner-content', 0.6, {x: -30, opacity: 0, clearProps: 'all'}, 0.3)
        .staggerFrom('.tile-anchor', 1, {opacity: 0, x: 30, clearProps: 'all'}, 0.2, 0.3)
        .from('.__current', 1, {opacity: 0, y: -30, clearProps: 'all'}, 0)
    },
    leave (el, done) {
      if (this.$store.state.layout.panelOpen) {
        let tlLeave = new TimelineMax({onComplete: done})
        tlLeave.staggerTo('.__not-current', 0.4, {autoAlpha: 0}, 0.2, 0)
          .to('.not-current-overlay', 0.5, {autoAlpha: 0}, 0.2)
          .to('.not-current-overlay', 0.5, {y: '-100%'}, 0.2)
          .to('.arrow', 0.3, {rotation: -90}, 0)
          .to('.partner-content', 0.3, {x: 30, opacity: 0}, 0)
          .to('.partner-image', 0.3, {opacity: 0, width: 0}, 0)
          .staggerTo('.tile-anchor', 1, {opacity: 0, x: 30}, 0.2, 0)
          .to('.__current', 1, {opacity: 0, y: -30}, 0)
      } else {
        let tlLeave = new TimelineMax({onComplete: done})
        tlLeave.to('.partner-image', 0.3, {opacity: 0, width: 0}, 0)
          .to('.partner-content', 0.3, {x: 30, opacity: 0}, 0)
          .staggerTo('.tile-anchor', 1, {opacity: 0, x: 30}, 0.2, 0)
          .to('.__current', 1, {opacity: 0, y: -30}, 0)
      }
      let tlLeave = new TimelineMax({onComplete: done})
      tlLeave.to('.partner-image', 0.5, {opacity: 0}, 0)
    }
  }
}
</script>

<style lang="scss">
@import '~assets/css/vars.scss';
.partners-wrapper {


  .partner-controls {
    position: fixed;
    z-index: 200;
    padding-top: 66px;
    left: 6.25vw;
    top: 0;
    width: 25vw;
    .partner-name {
      font-family: 'Marklight';
      font-size: 24px;
      margin: 0 0 6px 0;
      &.__current {
        color: #EE3524;
      }
      @include for-big-desktop-up {
        margin: 0 0 6px 0;
        font-size: 38px;
      }
    }

    .show-partners {
      width: 6.25vw;
      position: fixed;
      z-index: 650;
      left: 0;
      height: 20px;
      top: 70px;
      text-align: center;
      opacity: 0.5;
      transition: opacity .3s;
      &:hover {
        opacity: 1;
        cursor: pointer;
      }
      img {
        position: absolute;
        transform: rotate(-90deg);
        height: 100%;
      }
      @include for-big-desktop-up {
        height: 30px;
        top: 72px;
      }
    }

    .not-current {
      position: absolute;
      top: 90px;
      @include for-big-desktop-up {
        top: 107px;
      }
      .partner-name {
        position: relative;
        z-index: 500;
        visibility: hidden;
      }
      .not-current-overlay {
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        background-color: #000000;
        visibility: hidden;
      }
    }

    .tiles-anchors {
      margin-top: 80px;
      @include for-desktop-up {
        margin-top: 120px;
      }
      @include for-big-desktop-up {
        margin-top: 160px;
      }
      ul {
        li {
          padding-bottom: 10px;
          .tile-anchor {
            font-size: 20px;
            transition: color .3s;
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

  .partner-content {
    margin-left: 31.25vw;
    padding: 0 40px 0 20px;
    width: calc(37.5vw - 60px);
    max-width: 720px;
    .tile {
      position: relative;
      margin-top: 0;
      &:last-of-type {
        min-height: 100vh;
      }
      .tile-title {
        margin-top: 0;
        font-family: 'Marklight';
        font-size: 38px;
        color: #808080;
        padding-top: 160px;
        @include for-desktop-up {
          padding-top: 200px;
        }
        @include for-big-desktop-up {
          padding-top: 255px;
        }
      }
      .tile-body {
        font-size: 15px;
        line-height: 1.3;
        @include for-big-desktop-up {
          font-size: 18px;
        }
        h3 {
          color: #808080;
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
      &.active {
      }
    }
  }

  .partner-image {
    position: fixed;
    overflow: hidden;
    width: 25vw;
    height: 100vh;
    right: 0;
    top: 0;
    .image {
      position: absolute;
      background-size: cover;
      right: 0;
      width: calc(25vw + 60px);
      height: 100%;
    }
  }
}
</style>
