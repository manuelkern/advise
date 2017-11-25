<template>
  <transition name="nav-transition">
    <div id="nav-wrapper">

      <span class="overlay">
        <img class="big-advise" src="~/assets/images/advise.svg">
      </span>

      <img class="logo" src="~/assets/images/logo.svg">

      <div class="navigation" v-bind:class="{open: nav.isOpen}">

        <div class="toggle-nav">
          <a v-on:click="toggleNav"class="trigger __open">{{ nav.trigger[locales.selected].close }}</a>
          <a v-on:click="toggleNav"class="trigger __close">{{ nav.trigger[locales.selected].open }}</a>
        </div>

        <div class="links">
          <ul>
            <li v-for="(link, index) in siteMap.links[locales.selected]" :key="link.id"  class="link-wrapper">
              <nuxt-link
                class="link"
                v-bind:class="{ active: index === siteMap.currentIndex }"
                @click.native="setNav(index)"
                :to="{
                  name: 'locale-section',
                  params: {
                    locale: locales.selected,
                    section: link.section_title_slug
                  }
                }">{{ link.section_title }}</nuxt-link>
            </li>
          </ul>
        </div>

        <div class="locales">
          <ul>
            <li v-for="locale in locales.langs" :key="locale.id" class="locale-wrapper">
              <nuxt-link 
                class="locale"
                @click.native="setLocale(locale.lang)"
                v-bind:class="{ active: locale.lang === $route.params.locale }"
                :to="{
                  to: 'locale',
                  params: {
                    locale: locale.lang,
                    section: siteMap.links[locale.lang][siteMap.currentIndex].section_title_slug
                  }
                }">{{ locale.lang }}</nuxt-link>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </transition>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { TimelineMax } from 'gsap'
export default {
  computed: mapState([
    'nav',
    'siteMap',
    'locales',
    'layout'
  ]),
  data () {
    return {
      selectedLocale: ''
    }
  },
  methods: {
    ...mapActions({
      toggle: 'setNavTrigger',
      setSelectedLocale: 'setSelectedLocale',
      setSectionIndex: 'setSectionIndex'
    }),
    setCorrectActiveLinksOnPageLoad (locale, section) {
      this.setSelectedLocale(locale)
      this.siteMap.links[locale].map((link, index) => {
        if (typeof section !== 'undefined' && section === link.section_title_slug) {
          this.setSectionIndex(index)
        }
      })
    },
    setLocale (lang) {
      this.setSelectedLocale(lang)
    },
    set$Targets ($el) {
      let $targets = {
        logo: $el.getElementsByClassName('logo'),
        overlay: $el.getElementsByClassName('overlay'),
        navigation: $el.getElementsByClassName('navigation'),
        triggers: $el.getElementsByClassName('trigger'),
        list: $el.getElementsByClassName('link-wrapper'),
        sectionLink: $el.getElementsByClassName('link'),
        advise: $el.getElementsByClassName('big-advise')
      }
      return $targets
    },
    animOpens ($el) {
      let tlNavOpens = new TimelineMax()
      let $t = this.set$Targets($el)
      tlNavOpens.to($t.overlay, 0.8, {width: '68.75vw'}, 'start')
        .to($t.navigation, 0.6, {width: '31.25vw', paddingLeft: '20px'}, 'start')
        .to($t.triggers, 0.4, {y: 30}, 'start')
        .staggerTo($t.sectionLink, 0.4, {autoAlpha: 1}, 0.2, 'start')
        .staggerFrom($t.list, 0.4, {x: 50, clearProps: 'all'}, 0.2, 'start')
        .to($t.logo, 0.4, {x: 60}, 0.1)
        .to($t.advise, 0.8, {opacity: 0.5}, 0.6)
    },
    animCloses ($el) {
      let $t = this.set$Targets($el)
      let tlNavCloses = new TimelineMax()
      tlNavCloses.to($t.overlay, 0.4, {width: 0}, 'start')
        .to($t.logo, 0.4, {x: 0}, 0.1)
        .to($t.navigation, 0.4, {width: '6.25vw', paddingLeft: '0', clearProps: 'padding-left'}, 'start')
        .to($t.triggers, 0.6, {y: 0}, 'start')
        .staggerTo($t.sectionLink, 0.2, {autoAlpha: 0, clearProps: 'all'}, 0.2, 'start')
        .to($t.advise, 0.4, {opacity: 0}, 'start')
    },
    toggleNav () {
      this.toggle()
      if (this.nav.isOpen) {
        this.animOpens(this.$el)
      } else {
        this.animCloses(this.$el)
      }
    },
    setNav (index) {
      this.setSectionIndex(index)
      this.toggleNav()
    }
  },
  created () {
    let locale = this.$route.params.locale
    let section = this.$route.params.section
    this.setCorrectActiveLinksOnPageLoad(locale, section)
  },
  mounted () {
    let $el = document.getElementById('nav-wrapper')
    let tlNavAppears = new TimelineMax()
    let $t = this.set$Targets($el)
    tlNavAppears.from($t.navigation, 1, {width: 0, clearProps: 'width'})
      .from($t.logo, 0.8, {x: 60}, 0)
  }
}
</script>


<style lang="scss" scoped>

@import '~assets/css/vars.scss';

a {
  color: #ACACAC;
  text-transform: uppercase;
  letter-spacing: 4px;
  transition: color .3s;
  font-size: 14px;
  @include for-desktop-up {
    font-size: 16px;    
    letter-spacing: 5px;
  }
  &:hover {
    color: #676767;
  }
  &.active {
    color: #EE3524;
  }
}

.overlay {
  z-index: 800;
  width: 0;
  right: 31.25vw;
  height: 100%;
  background-color: #000000;
  position: fixed;
  opacity: 0.8;
  overflow: hidden;
  img {
    opacity: 0;
    height: 100%;
  }
}

.logo {
  position: fixed;
  right: 20px;
  top: 20px;
  height: 360px;
  z-index: 950;
}

.navigation {
  position: fixed;
  z-index: 900;
  left: 68.75vw;
  width: 6.25vw;
  height: 100%;
  background-color: #F7F7F7;
  overflow: hidden;
  padding-left: 0;
  .toggle-nav {
    position: relative;
    height: 20px;
    top: 67px;
    overflow: hidden;
    a {
      position: absolute;
      cursor: pointer;
      left: calc(3.125vw - 28px);
      @include for-desktop-up {
        left: calc(3.125vw - 33px);
      }
    }
    .__open {
      top: 0;
    }
    .__close {
      top: -30px;
    }
  }
  .links {
    position: relative;
    top: 200px;
    left: calc(3.125vw - 28px);
    @include for-desktop-up {
      left: calc(3.125vw - 33px);
    }
    ul {
      li {
        padding: 6px 0;
        .link {
          visibility: hidden;
          white-space: nowrap;
          font-size: 22px;
        }
      }
    }
  }
  .locales {
    position: absolute;
    bottom: 60px;
    left: calc(3.125vw - 13px);
    transition: left .6s;
    @include for-desktop-up {
      left: calc(3.125vw - 16.25px);
    }
    ul {
      li {
        padding: 6px 0;
      }
    }
  }
  &.open {
    .locales {
      left: calc(3.125vw - 8px);
      @include for-desktop-up {
        left: calc(3.125vw - 14px);
      }
    }
  }
}
</style>
