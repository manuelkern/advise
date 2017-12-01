import Vue from 'vue'
import 'vue-googlemaps/dist/vue-googlemaps.css'
import VueGoogleMaps from 'vue-googlemaps'

Vue.use(VueGoogleMaps, {
  load: {
    apiKey: 'AIzaSyDa9n0N3u6SJIDr6tgTGz9zI914fCXRZvI',
    libraries: ['places']
  }
})
