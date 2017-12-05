<template>
  <div id="nav-wrapper" v-bind:class="{open: nav.isOpen}">
    
    <transition name="fade">
      <div class="big-advise" v-if="$route.name !== 'locale-section-partner'">
        <img src="~/assets/images/advise.svg">
      </div>
    </transition>

    <span class="overlay"></span>

    <nuxt-link to="/" class="logo one-c"><img src="~/assets/images/logo.svg"></nuxt-link>

    
    <div class="navigation">
      <div class="inner" v-if="layout.is === 'tablet'">
        <burger :isNavOpen="nav.isOpen" @clicked="toggleBurger" v-if="layout.is === 'tablet'"></burger>
      </div>
      <div class="toggle-nav" v-if="layout.is !== 'tablet'">
        <a v-on:click="toggleNav" class="trigger __open">{{ nav.trigger[locales.selected].close }}</a>
        <a v-on:click="toggleNav" class="trigger __close">{{ nav.trigger[locales.selected].open }}</a>
      </div>

      <div class="links">
        <ul>
          <li>
            <nuxt-link
              :to="{ name: 'locale', params: { locale: locales.selected }}"
              @click.native="toggleNav()"
              class="link">{{ nav.homeLink[locales.selected] }}</nuxt-link>
          </li>
          <li v-for="(link, index) in siteMap.links[locales.selected]" :key="link.id"  class="link-wrapper">
            <nuxt-link
              class="link"
              @click.native="setNav(index)"
              :to="{
                name: 'locale-section',
                params: {
                  locale: locales.selected,
                  section: link.value.title_slug
                }
              }">{{ link.value.title }}</nuxt-link>
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
                  section: siteMap.links[locale.lang][siteMap.currentIndex].value.title_slug
                }
              }">{{ locale.lang }}</nuxt-link>
          </li>
        </ul>
      </div>

    </div>

  </div>
</template>

<script>
import Burger from '~/components/Burger'
import { animations } from '~/utils/utils.js'
import { mapState, mapActions } from 'vuex'
export default {
  components: {
    'burger': Burger
  },
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
        if (typeof section !== 'undefined' && section === link.value.title_slug) {
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
        navigation: $el.getElementsByClassName('navigation'),
        triggers: $el.getElementsByClassName('trigger'),
        list: $el.getElementsByClassName('link-wrapper'),
        sectionLink: $el.getElementsByClassName('link'),
        sectionLinks: $el.getElementsByClassName('links'),
        advise: $el.getElementsByClassName('big-advise')
      }
      return $targets
    },
    navAppears ($el) {
      let $t = this.set$Targets($el)
      animations.navAppears($t)
    },
    navOpens ($el) {
      let $t = this.set$Targets($el)
      animations.navOpens($t)
    },
    navCloses ($el) {
      let $t = this.set$Targets($el)
      animations.navCloses($t)
    },
    toggleNav () {
      this.toggle()
      if (this.nav.isOpen) {
        this.navOpens(this.$el)
      } else {
        this.navCloses(this.$el)
      }
    },
    setNav (index) {
      this.setSectionIndex(index)
      this.toggleNav()
    },
    toggleBurger (value) {
      this.toggle()
      if (value) {
        this.navOpens(this.$el)
      } else {
        this.navCloses(this.$el)
      }
    }
  },
  mounted () {
    this.setCorrectActiveLinksOnPageLoad(this.$route.params.locale, this.$route.params.section)
    this.navAppears(this.$el)
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
  @include for-desktop-up {
    letter-spacing: 5px;
  }
  &:hover {
    color: #676767;
  }
  &.active {
    color: #EE3524;
  }
  &.nuxt-link-exact-active {
    color: #EE3524;
  }
}

#nav-wrapper {

  .logo {
    position: fixed;
    z-index: 950;
    height: calc(45vh - 30px);
    max-height: 280px;
    right: 0;
    min-width: 48px;
    bottom: 30px;
    transition: opacity .3s;
    @include for-small-desktop-up {
      max-height: unset;
      bottom: 65px;
      right: initial;
      left: 0;
      height: 320px;
    }

    img {
      position: absolute;
      height: 100%;
      left: calc(2px + 50%);
      transform: translateX(-50%);
      @include for-small-desktop-up {
        left: calc(4px + 50%);
        transform: translateX(-50%);
      }
    }
  }

  .big-advise {
    position: fixed;
    overflow: hidden;
    height: 60vh;
    right: 48px;
    width: 25vw;
    top: 0;
    visibility: hidden;
    @include for-tablet-landscape-up {
      z-index: 500;
      visibility: visible;
      right: 6.25vw;
    }
    @include for-small-desktop-up{
      height: 100vh;
      right: 0;
    }
    img {
      height: 100%;
      position: absolute;
      right: -4px;
    }
  }

  .overlay {
    z-index: 800;
    width: 0;
    top: 0;
    right: 31.25vw;
    height: 100%;
    background-color: #000000;
    position: fixed;
    opacity: 0.8;
    overflow: hidden;
    transition: width .8s;
  }

  .navigation {
    min-width: 48px;
    width: 6.25vw;
    position: fixed;
    z-index: 900;
    height: 100%;
    background-color: #F7F7F7;
    overflow: hidden;
    right: 0;
    top: 0;
    transition: width .5s;

    @include for-small-desktop-up {
      left: 68.75vw;
      padding-left: 0;
    }
    .inner{
      min-width: 48px;
      width: 6.25vw;
      position: fixed;
      height: 100%;
      overflow: hidden;
      right: 0;
      top: 0;
      #burger {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 28px;
        height: 18px;
        top: 40px;
      }
    }

    .toggle-nav {
      position: relative;
      height: 20px;
      top: 67px;
      overflow: hidden;
      a {
        position: absolute;
        cursor: pointer;
        font-size: 13px;
        left: calc(3.125vw - 29px);
        @include for-big-desktop-up {
          font-size: 16px;
          left: calc(3.125vw - 35px);
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
      left: 0;
      @include for-small-desktop-up {
        left: calc(3.125vw - 28px);
      }
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
      bottom: 30px;
      transition: left .6s;
      visibility: hidden;
      opacity: 0;
      transition: opacity .5s;
      left: 20px;
      @include for-small-desktop-up {
        left: calc(3.125vw - 12px);
        bottom: 60px;
        opacity: 1;
        visibility: visible;
      }
      @include for-big-desktop-up {
        left: calc(3.125vw - 15px);
      }
      ul {
        li {
          padding: 3px 0;
          @include for-big-desktop-up {
            padding: 6px 0;
          }
          a {
            font-size: 13px;
            @include for-big-desktop-up {
              font-size: 16px;
            }
          }
        }
      }
    }
  }
  &.open {
    .big-advise {
      visibility: visible;
    }
    .logo {
      opacity: 0;
      @include for-small-desktop-up {
        opacity: 1;
      }
    }
    .overlay {
      width: 68.75vw;
    }
    .navigation {
      width: 100vw;
      @include for-tablet-landscape-up {
        width: 50vw;
      }
      @include for-small-desktop-up {
        width: 31.25vw;
      }

      .locales {
        opacity: 1;
        visibility: visible;
      }
    }
  }
}

</style>
