import axios from 'axios'

export const state = () => ({
  layout: {
    isReady: false,
    isMobileDevice: false,
    width: 0,
    is: '',
    panelOpen: false,
    panelTrigger: {
      en: {
        open: 'open'
      },
      fr: {
        open: 'ouvrir'
      }
    }
  },
  nav: {
    isOpen: false,
    trigger: {
      en: {
        close: 'MENU',
        open: 'CLOSE'
      },
      fr: {
        close: 'MENU',
        open: 'FERMER'
      }
    },
    homeLink: {
      en: 'HOME',
      fr: 'ACCUEIL'
    }
  },
  locales: {
    selected: 'en',
    default: 'en',
    langs: [
      { lang: 'en' },
      { lang: 'fr' }
    ]
  },
  siteMap: {
    currentSection: '',
    currentIndex: 0,
    links: {
      en: [],
      fr: []
    }
  },
  homePage: {}
})

export const mutations = {
  setLayoutWidth (state, width) {
    state.layout.width = width
  },
  setLayoutIsReady (state, value) {
    state.layout.isReady = value
  },
  setLayoutType (state, type) {
    state.layout.is = type
  },
  setLayoutDevice (state, value) {
    state.layout.isMobileDevice = value
  },
  setSiteMapLinks (state, links) {
    state.siteMap.links = links
  },
  setNavTrigger (state) {
    state.nav.isOpen = !state.nav.isOpen
  },
  setSelectedLocale (state, locale) {
    state.locales.selected = locale
  },
  setSectionIndex (state, index) {
    state.siteMap.currentIndex = index
  },
  setHomePage (state, homePage) {
    state.homePage = homePage
  },
  setPanelOpen (state) {
    state.layout.panelOpen = !state.layout.panelOpen
  },
  resetPanel (state) {
    state.layout.panelOpen = false
  },
  setCurrentSection (state, section) {
    state.siteMap.currentSection = section
  }
}

export const actions = {
  async nuxtServerInit ({commit}) {
    let links = {}
    links.en = []
    links.fr = []
    let { data } = await axios.get(process.env.apiUrl + '/regions/data/sitemap?token=' + process.env.apiSmToken)
    data.links.map((link) => {
      links.en.push(link)
    })
    data.links_fr.map((link) => {
      links.fr.push(link)
    })
    commit('setSiteMapLinks', links)
    commit('setHomePage', data.homepage)
  },
  setLayoutWidth ({commit}, width) {
    commit('setLayoutWidth', width)
  },
  setLayoutIsReady ({commit}, value) {
    commit('setLayoutIsReady', value)
  },
  setLayoutType ({commit}, type) {
    commit('setLayoutType', type)
  },
  setLayoutDevice ({commit}, value) {
    commit('setLayoutDevice', value)
  },
  setNavTrigger ({commit}) {
    commit('setNavTrigger')
  },
  setSelectedLocale ({commit}, locale) {
    commit('setSelectedLocale', locale)
  },
  setSectionIndex ({commit}, index) {
    commit('setSectionIndex', index)
  },
  setPanelOpen ({commit}) {
    commit('setPanelOpen')
  },
  resetPanel ({commit}) {
    commit('resetPanel')
  },
  setCurrentSection ({commit}, section) {
    commit('setCurrentSection', section)
  }
}
