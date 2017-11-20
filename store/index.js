import axios from 'axios'

export const state = () => ({
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
  }
}

export const actions = {
  async nuxtServerInit ({commit}) {
    let links = {}
    links.en = []
    links.fr = []
    let { data } = await axios.get(process.env.cockpit.apiUrl + '/regions/data/sitemap?token=' + process.env.cockpit.apiToken)
    data.section.map((section) => {
      links.en.push(section.value)
    })
    data.section_fr.map((section) => {
      links.fr.push(section.value)
    })
    commit('setSiteMapLinks', links)
    commit('setHomePage', data.homepage)
  },
  setNavTrigger ({commit}) {
    commit('setNavTrigger')
  },
  setSelectedLocale ({commit}, locale) {
    commit('setSelectedLocale', locale)
  },
  setSectionIndex ({commit}, index) {
    commit('setSectionIndex', index)
  }
}
