<template>
  <div class="navigation" v-bind:class="{open: nav.isOpen}">

    <div class="toggle-nav">
      <a v-on:click="toggleNav"class="trigger-open">{{ nav.trigger.close }}</a>
      <a v-on:click="toggleNav"class="trigger-close">{{ nav.trigger.open }}</a>
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
                section: link.title_slug
              }
            }">{{ link.title }}</nuxt-link>
        </li>
      </ul>
    </div>

    <div class="locales">
      <ul>
        <li v-for="locale in locales.langs" :key="locale.id" class="locale-wrapper">
          <nuxt-link 
            class="locale"
            @click.native="setLocale"
            :to="{
              to: 'locale',
              params: {
                locale: locale.lang,
                section: siteMap.links[locale.lang][siteMap.currentIndex].title_slug
              }
            }">{{ locale.lang }}</nuxt-link>
        </li>
      </ul>
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
  methods: {
    ...mapActions({
      toggle: 'setNavTrigger',
      setSelectedLocale: 'setSelectedLocale',
      setSectionIndex: 'setSectionIndex'
    }),
    setCorrectActiveLinksOnPageLoad (locale, section) {
      this.setSelectedLocale(locale)
      this.siteMap.links[locale].map((link, index) => {
        if (section === link.title_slug) {
          this.setSectionIndex(index)
        }
      })
    },
    setLocale () {
      this.setSelectedLocale(this.$route.params.locale)
    },
    animOpens ($el) {
      let $targets = {
        list: $el.getElementsByClassName('link-wrapper'),
        links: $el.getElementsByClassName('link')
      }
      let tlNavOpens = new TimelineMax()
      tlNavOpens.staggerTo($targets.links, 0.4, {autoAlpha: 1}, 0.2, 'start')
        .staggerFrom($targets.list, 0.4, {x: 50, clearProps: 'all'}, 0.2, 'start')
    },
    animCloses ($el) {
      let $targets = {
        links: $el.getElementsByClassName('link')
      }
      let tlNavCloses = new TimelineMax()
      tlNavCloses.staggerTo($targets.links, 0.4, {autoAlpha: 0, clearProps: 'all'}, 0.2)
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

.navigation {
  position: absolute;
  width: 110px;
  height: 100%;
  background-color: #e4e4e4;
  overflow: hidden;
  padding-left: 0;
  transition: width .6s ease-in-out, padding-left .6s ease-in-out;
  .toggle-nav {
    position: relative;
    height: 20px;
    padding-left: 20px;
    top: 60px;
    overflow: hidden;
    transition: padding-left .5s ease-in-out;
    a {
      position: absolute;
      cursor: pointer;
      transition: top .6s ease-in-out, opacity .6s color .3s;
    }
    .trigger-open {
      opacity: 1;
      top: 0;
    }
    .trigger-close {
      top: -30px;
      opacity: 0;
    }
  }
  .links {
    position: relative;
    top: 160px;
    ul {
      li {
        .link {
          visibility: hidden;
          white-space: nowrap;
          font-size: 28px;
        }
      }
    }
  }
  .locales {
    width: 110px;
    position: absolute;
    bottom: 60px;
    left: 42px;
    transition: left .6s;
  }
  &.open {
    width: 400px;
    padding-left: 40px;
    .toggle-nav {
      padding-left: 0;
      .trigger-open {
        top: 30px;
        opacity: 0;
      }
      .trigger-close {
        opacity: 1;
        top: 0px;
      }
    }
  }
}
</style>
