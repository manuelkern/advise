<template>
  <div class="nav-wrapper">

    <span class="overlay"></span>

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
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { TimelineMax } from 'gsap'
export default {
  computed: mapState([
    'nav',
    'siteMap',
    'locales'
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
        if (section === link.section_title_slug) {
          this.setSectionIndex(index)
        }
      })
    },
    setLocale (lang) {
      this.setSelectedLocale(lang)
    },
    animOpens ($el) {
      let $targets = {
        overlay: $el.getElementsByClassName('overlay'),
        navigation: $el.getElementsByClassName('navigation'),
        triggers: $el.getElementsByClassName('trigger'),
        list: $el.getElementsByClassName('link-wrapper'),
        links: $el.getElementsByClassName('link')
      }
      let tlNavOpens = new TimelineMax()
      tlNavOpens.to($targets.overlay, 0.8, {width: '68.75vw'}, 'start')
        .to($targets.navigation, 0.6, {width: '31.25vw'}, 'start')
        .to($targets.triggers, 0.4, {y: 30}, 'start')
        .staggerTo($targets.links, 0.4, {autoAlpha: 1}, 0.2, 'start')
        .staggerFrom($targets.list, 0.4, {x: 50, clearProps: 'all'}, 0.2, 'start')
    },
    animCloses ($el) {
      let $targets = {
        overlay: $el.getElementsByClassName('overlay'),
        navigation: $el.getElementsByClassName('navigation'),
        triggers: $el.getElementsByClassName('trigger'),
        links: $el.getElementsByClassName('link')
      }
      let tlNavCloses = new TimelineMax()
      tlNavCloses.to($targets.overlay, 0.4, {width: 0}, 'start')
        .to($targets.navigation, 0.4, {width: '6.25vw'}, 'start')
        .to($targets.triggers, 0.2, {y: 0}, 'start')
        .staggerTo($targets.links, 0.2, {autoAlpha: 0, clearProps: 'all'}, 0.2, 'start')
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
  }
}
</script>


<style lang="scss" scoped>

ul {
  margin: 0;
  padding: 0;
  li {
    list-style: none;
    padding: 6px 0;
  }
}

a {
  color: #ACACAC;
  text-transform: uppercase;
  letter-spacing: 5px;
  transition: color .3s;
  &:hover {
    color: #676767;
  }
  &.exact-active-link {
    color: #EE3524;
  }
}

.overlay {
  z-index: 800;
  width: 0;
  right: 31.25vw;
  height: 100%;
  background-color: #000000;
  position: absolute;
  opacity: 0.8;

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
    top: 60px;
    overflow: hidden;
    a {
      position: absolute;
      left: calc(3.125vw - 35px);
      cursor: pointer;
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
    top: 160px;
    left: calc(3.125vw - 35px);
    ul {
      li {
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
    left: calc(3.125vw - 16.25px);
    transition: left .6s;
  }
  &.open {
    .locales {
      left: calc(3.125vw - 35px);
    }
  }
}
</style>
