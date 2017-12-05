import { TimelineMax } from 'gsap'

export const forIn = (obj, fn, thisObj) => {
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

export const mutateKeysForLocale = (fields, locale) => {
  let localizedKeys = {}
  let notLocalizedKeys = {}
  let keys = Object.keys(fields)
  keys.forEach((key) => {
    notLocalizedKeys._id = '_id'
    if (!fields[key].localize) {
      notLocalizedKeys[key] = key
    }
    if (fields[key].localize && locale === 'en') {
      localizedKeys[key] = key
    }
    if (fields[key].localize && locale !== 'en') {
      localizedKeys[key] = key + '_' + locale
    }
    if (fields[key].options.slug && fields[key].localize && locale !== 'en') {
      localizedKeys[key + '_slug'] = key + '_' + locale + '_slug'
    }
    if (fields[key].options.slug && fields[key].localize && locale === 'en') {
      localizedKeys[key + '_slug'] = key + '_slug'
    }
    if (fields[key].options.slug && !fields[key].localize) {
      notLocalizedKeys[key + '_slug'] = key + '_slug'
    }
  })
  let newKeys = Object.assign(localizedKeys, notLocalizedKeys)
  return newKeys
}

export const animations = {
  navAppears: ($t) => {
    let tlNavAppears = new TimelineMax()
    tlNavAppears
      .from($t.logo, 0.8, {x: 60}, 0)
  },
  navOpens: ($t) => {
    let tlNavOpens = new TimelineMax()
    tlNavOpens
      .to($t.triggers, 0.4, {y: 30, x: 18}, 'start')
      .staggerTo($t.sectionLink, 0.4, {autoAlpha: 1}, 0.2, 'start')
      .to($t.sectionLinks, 0.4, {x: 20}, 'start')
      .staggerFrom($t.list, 0.4, {x: 50, clearProps: 'all'}, 0.2, 'start')
  },
  navCloses: ($t) => {
    let tlNavCloses = new TimelineMax()
    tlNavCloses
      .to($t.triggers, 0.6, {y: 0, x: 0}, 'start')
      .to($t.sectionLinks, 0.4, {x: 40}, 'start')
      .staggerTo($t.sectionLink, 0.2, {autoAlpha: 0, clearProps: 'all'}, 0.1, 'start')
  },
  burgerOpens: ($t) => {
    let tlBurgerOpens = new TimelineMax()
    tlBurgerOpens
      .to($t.first, 0.2, {y: 8}, 'start')
      .to($t.first, 0.2, {rotation: 45}, 'middle')
      .to($t.last, 0.2, {y: -8}, 'start')
      .to($t.last, 0.2, {rotation: -45}, 'middle')
      .to($t.middle, 0.1, {opacity: 0}, 'middle')
  },
  burgerCloses: ($t) => {
    let tlBurgerCloses = new TimelineMax()
    tlBurgerCloses
      .to($t.first, 0.2, {rotation: 0}, 'start')
      .to($t.first, 0.2, {y: 0}, 'middle')
      .to($t.last, 0.2, {rotation: 0}, 'start')
      .to($t.last, 0.2, {y: 0}, 'middle')
      .to($t.middle, 0.1, {opacity: 1}, 'middle')
  }
}

export const gmStyles = [
  { 'featureType': 'water',
    'elementType': 'geometry',
    'stylers': [
      { 'color': '#e9e9e9' },
      { 'lightness': 17 }
    ]
  },
  {
    'featureType': 'landscape',
    'elementType': 'geometry',
    'stylers': [
      { 'color': '#f5f5f5' },
      { 'lightness': 20 }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'geometry.fill',
    'stylers': [
      { 'color': '#ffffff' },
      { 'lightness': 17 }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'geometry.stroke',
    'stylers': [
      { 'color': '#ffffff' },
      { 'lightness': 29 },
      { 'weight': 0.2 }
    ]
  },
  {
    'featureType': 'road.arterial',
    'elementType': 'geometry',
    'stylers': [
      { 'color': '#ffffff' },
      { 'lightness': 18 }
    ]
  },
  {
    'featureType': 'road.local',
    'elementType': 'geometry',
    'stylers': [
      { 'color': '#ffffff' },
      { 'lightness': 16 }
    ]
  },
  {
    'featureType': 'poi',
    'elementType': 'geometry',
    'stylers': [
      { 'color': '#f5f5f5' },
      { 'lightness': 21 }
    ]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'geometry',
    'stylers': [
      { 'color': '#dedede' },
      { 'lightness': 21 }
    ]
  },
  {
    'elementType': 'labels.text.stroke',
    'stylers': [
      { 'visibility': 'on' },
      { 'color': '#ffffff' },
      { 'lightness': 16 }
    ]
  },
  {
    'elementType': 'labels.text.fill',
    'stylers': [
      { 'saturation': 36 },
      { 'color': '#333333' },
      { 'lightness': 40 }
    ]
  },
  {
    'elementType': 'labels.icon',
    'stylers': [
      { 'visibility': 'off' }
    ]
  },
  {
    'featureType': 'transit',
    'elementType': 'geometry',
    'stylers': [
      { 'color': '#f2f2f2' },
      { 'lightness': 19 }
    ]
  },
  {
    'featureType': 'administrative',
    'elementType': 'geometry.fill',
    'stylers': [
      { 'color': '#fefefe' },
      { 'lightness': 20 }
    ]
  },
  {
    'featureType': 'administrative',
    'elementType': 'geometry.stroke',
    'stylers': [
      { 'color': '#fefefe' },
      { 'lightness': 17 },
      { 'weight': 1.2 }
    ]
  }
]
