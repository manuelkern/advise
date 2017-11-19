export const state = () => ({
  nav: {
    isOpen: false,
    trigger: {
      close: 'MENU',
      open: 'CLOSE'
    }
  },
  locales: {
    selected: 'en',
    langs: [
      {lang: 'en'},
      {lang: 'fr'}
    ]
  },
  siteMap: {
    currentIndex: 0,
    links: {
      en: [
        { title: 'partners', title_slug: 'partners' },
        { title: 'practice areas', title_slug: 'practice-areas' },
        { title: 'contact', title_slug: 'contact' }
      ],
      fr: [
        { title: 'partenaires', title_slug: 'partenaires' },
        { title: 'domaines dactivite', title_slug: 'domaines' },
        { title: 'contact', title_slug: 'contact' }
      ]
    }
  }
})

export const mutations = {
  setNavTrigger (state) {
    state.nav.isOpen = !state.nav.isOpen
  },
  setSelectedLocale (state, locale) {
    state.locales.selected = locale
  },
  setSectionIndex (state, index) {
    state.siteMap.currentIndex = index
  }
}

export const actions = {
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
