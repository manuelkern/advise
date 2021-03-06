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

      <!-- LINKS TO COMPETENCIES -->

      <scrollactive
        class="competencies-anchors"
        :offset="5"
        :duration="800"
        :clickToScroll="true"
        @itemchanged="updateScroll(...arguments)">

        <ul>
          <li v-for="(competency, index) in currentPartner.competencies" :key="competency.id" class="competency-list">
            <a :href="'#' + competency.value.title_slug"
              class="competency-anchor scrollactive-item">
                {{ competency.value.title }}
            </a>
          </li>
        </ul>

      </scrollactive>

    </div>

    <!-- MAIN CONTENT -->

    <div class="partner-content">
      <div
        v-for="competency in currentPartner.competencies"
        :key="competency.id"
        class="competency"
        v-bind:id="competency.value.title_slug">

        <p class="competency-title">{{ competency.value.title }}</p>
        <div v-html="competency.value.body" class="competency-body"></div>

      </div>
    </div>

    <!-- IMAGE -->

    <div class="partner-image" v-if="currentPartner.image">
      <div class="image" v-bind:style="{ backgroundImage: 'url(' + baseUrl + currentPartner.image.path + ')' }"></div>
    </div>

  </div>
</template>

<script>

import { mapState, mapActions } from 'vuex'
import { TimelineMax } from 'gsap'
import { forIn, mutateKeysForLocale } from '~/utils/utils.js'
import axios from 'axios'
export default {
  computed: mapState([
    'siteMap',
    'layout'
  ]),
  async asyncData ({store, env, params}) {
    let partners = []
    let Partner = class {}

    let { data } = await axios.get(`${env.apiUrl}/collections/get/partners?token=${env.apiToken}`)

    let localizedKeys = mutateKeysForLocale(data.fields, params.locale)

    data.entries.map((p, index) => {
      let partner = new Partner()
      forIn(localizedKeys, (val, key) => {
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

    store.commit('setCurrentSection', 'partner')

    return {
      currentPartner: currentPartner,
      notCurrentPartners: notCurrentPartners
    }
  },
  data () {
    return {
      baseUrl: process.env.apiBaseUrl
    }
  },
  head () {
    return {
      title: 'Advise - ' + this.currentPartner.name,
      meta: [
        { hid: 'description', name: 'description', content: this.currentPartner.metadescription }
      ]
    }
  },
  methods: {
    ...mapActions({
      setPanelOpen: 'setPanelOpen',
      resetPanel: 'resetPanel',
      setCurrentSection: 'setCurrentSection'
    }),
    updateScroll (e, c, l) {
      if (typeof c !== 'undefined') {
        history.pushState(null, null, c.hash)
      }
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
  },
  mounted () {
    window.onhashchange = () => {
      this.$router.push({ name: 'locale-section' })
    }
  },
  transition: {
    name: 'partner-transition',
    css: false,
    enter (el, done) {
      let tlEnter = new TimelineMax({onComplete: done})
      tlEnter.from('.image', 3, {x: 60})
        .from('.partner-image', 0.6, {opacity: 0, width: 0, clearProps: 'all'}, 0)
        .from('.competency', 1, {x: 100, opacity: 0}, 0)
        .staggerFrom('.competency-list', 1, {x: -200, opacity: 0}, 0.2, 0)
        .staggerFrom('.competency-anchor', 1, {opacity: 0, x: 200, clearProps: 'all'}, 0.2, 0.4)
        .from('.__current', 1, {opacity: 0, x: -100, clearProps: 'all'}, 0)
    },
    leave (el, done) {
      if (this.$store.state.layout.panelOpen) {
        let tlLeave = new TimelineMax({onComplete: done})
        tlLeave.staggerTo('.__not-current', 0.4, {autoAlpha: 0}, 0.2, 0)
          .to('.not-current-overlay', 0.5, {autoAlpha: 0}, 0.2)
          .to('.not-current-overlay', 0.5, {y: '-100%'}, 0.2)
          .to('.arrow', 0.3, {rotation: -90}, 0)
          .to('.competency', 0.8, {opacity: 0, x: 100}, 0)
          .to('.partner-image', 0.3, {opacity: 0}, 0)
          .staggerTo('.competency-list', 1, {x: -200, opacity: 0}, 0.2, 0)
          .to('.competencies-anchors', 0.8, {opacity: 0, x: -100}, 0)
          .to('.__current', 1, {opacity: 0, x: -100}, 0)
      } else {
        let tlLeave = new TimelineMax({onComplete: done})
        tlLeave.to('.partner-image', 0.3, {opacity: 0}, 0)
          .staggerTo('.competency-anchor', 1, {opacity: 0, x: 30}, 0.2, 0)
          .to('.competency', 0.8, {opacity: 0, x: 100}, 0)
          .staggerTo('.competency-list', 1, {x: -200, opacity: 0}, 0.2, 0)
          .to('.competencies-anchors', 0.8, {opacity: 0, x: -100}, 0)
          .to('.__current', 1, {opacity: 0, x: -100}, 0)
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
    z-index: 200;
    position: relative;
    top: 50vh;
    padding: 4vh 0 4vh 0;
    width: calc(100% - 48px);
    @include for-tablet-landscape-up {
      overflow: hidden;
      border-left: 1px solid rgba(140, 140, 140, 0.4);
      height: 100vh;
      top: 0;
      width: unset;
      padding: 66px 0 0 0;
      position: fixed;
      left: 6.25vw;
      width: 31.25vw;
    }
    @include for-small-desktop-up {
      width: 25vw;
    }

    .partner-name {
      font-family: 'Marklight';
      font-size: 24px;
      margin: 0;
      padding: 0 0 0 50px;
      position: absolute;
      width: calc(100% - 48px);
      top: 4vh;
      &.__current {
        color: #EE3524;
      }
      @include for-tablet-landscape-up {
        padding: 0 20px;
        width: unset;
        position: unset;
        top: unset;
      }
      @include for-desktop-up {
        padding: 0 3.125vw;
      }
      @include for-big-desktop-up {
        margin: 0 0 6px 0;
        font-size: 30px;
      }
    }

    .show-partners {
      z-index: 650;
      text-align: center;
      opacity: 0.5;
      transition: opacity .3s;
      position: relative;
      top: 0;
      left: 10px;
      width: 28px;
      height: 28px;
      &:hover {
        opacity: 1;
        cursor: pointer;
      }
      @include for-tablet-landscape-up {
        left: 0;
        position: fixed;
        top: 70px;
        height: 20px;
        width: 6.25vw;
      }
      @include for-big-desktop-up {
        height: 30px;
        top: 72px;
      }
      img {
        position: absolute;
        transform: rotate(-90deg);
        height: 100%;
        width: 100%;
        left: 0;
        @include for-tablet-landscape-up {
          width: unset;
          left: unset;
        }
      }
    }

    .not-current {
      position: absolute;
      top: 26px;
      @include for-tablet-landscape-up {
        top: 90px;
      }
      @include for-big-desktop-up {
        top: 100px;
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
        z-index: 200;
      }
    }

    .competencies-anchors {
      position: relative;
      margin-top: 20px;
      padding-left: 50px;
      @include for-tablet-landscape-up {
        margin-top: 80px;
        padding-left: 20px;
      }
      @include for-desktop-up {
        margin-top: 120px;
        padding-left: 3.125vw;
      }
      @include for-big-desktop-up {
        margin-top: 160px;
      }
      ul {
        li {
          padding: 0 0 10px 0;
          @include for-big-desktop-up {
            padding: 0 0 20px 0;
          }
          .competency-anchor {
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

  .partner-content {
    position: relative;
    padding: 0;
    overflow-x: hidden;
    top: 50vh;
    width: calc(100% - 48px);
    background-color: #EFEDEB;
    @include for-tablet-landscape-up {
      background-color: unset;
      border-left: 1px solid rgba(140, 140, 140, 0.4);
      border-right: 1px solid rgba(140, 140, 140, 0.4);
      left: 37.5vw;
      width: calc(56.25vw - 2px);      
    }
    @include for-small-desktop-up {
      top: 0;
      left: 31.25vw;
      width: calc(37.5vw - 2px);
    }
    .competency {
      max-width: 720px;
      position: relative;
      margin-top: 0;
      padding: 0 20px;
      @include for-tablet-landscape-up {
        padding: 0 40px 0 20px;
      }
      @include for-desktop-up {
        padding: 0 3.125vw;
      }
      .competency-title {
        margin-top: 0;
        font-family: 'Marklight';
        font-size: 28px;
        color: #EE3524;
        padding-top: 32px;
        @include for-tablet-landscape-up {
          color: #808080;
          padding-top: 40px;
          font-size: 38px;
          padding-top: 160px;
        }
        @include for-desktop-up {
          padding-top: 200px;
        }
        @include for-big-desktop-up {
          padding-top: 255px;
        }
      }
      .competency-body {
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
      &.active {
      }
      &:first-of-type {
        @include for-tablet-landscape-up {
          margin-top: 5px;
        }
        .competency-title {
          @include for-tablet-landscape-up {
            margin-top: -100px;
          }
          @include for-small-desktop-up {
            margin-top: 0;
          }
        }
      }
      &:last-of-type {
        min-height: 100vh;
      }
    }
  }

  .partner-image {
    overflow: hidden;
    width: calc(100% - 48px);
    top: 0;
    position: absolute;
    height: 50vh;
    @include for-tablet-landscape-up {
      right: 6.25vw;
      width: 56.25vw;
    }
    @include for-small-desktop-up {
      right: 0;
      position: fixed;
      width: 25vw;
      height: 100vh;
    }
    .image {
      position: absolute;
      background-size: cover;
      background-position: 0 50%;
      right: 0;
      width: calc(100vw + 60px);
      height: 50vh;
      @include for-tablet-landscape-up {
        height: 62.5vw;
        width: calc(62.5vw + 60px);
      }
      @include for-small-desktop-up {
        height: 100%;
        width: calc(25vw + 60px);
      }
    }
  }
}
</style>
