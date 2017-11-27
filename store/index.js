import axios from 'axios'

export const state = () => ({
  layout: {
    tablet: false,
    ready: false,
    width: 0,
    is: '',
    panelOpen: false
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
    }
  },
  locales: {
    selected: 'en',
    default: 'en',
    langs: [
      {lang: 'en'},
      {lang: 'fr'}
    ]
  },
  siteMap: {
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
  setLayoutType (state, type) {
    state.layout.is = type
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
  }
}

export const actions = {
  async nuxtServerInit ({commit}) {
    let links = {}
    links.en = []
    links.fr = []
    let { data } = await axios.get(process.env.apiUrl + '/regions/data/sitemap?token=' + process.env.apiToken)
    data.section.map((section) => {
      links.en.push(section.value)
    })
    data.section_fr.map((section) => {
      links.fr.push(section.value)
    })
    commit('setSiteMapLinks', links)
    commit('setHomePage', data.homepage)
  },
  setLayoutWidth ({commit}, width) {
    commit('setLayoutWidth', width)
  },
  setLayoutType ({commit}, type) {
    commit('setLayoutType', type)
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
  }
}
