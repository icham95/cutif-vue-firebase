// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import './stylus/main.styl'

import App from './App'
import router from './router'

import store from '@/store.js'
import Toasted from 'vue-toasted'
Vue.use(Toasted, {
  duration: 1500
})

var VueFire = require('vuefire')
Vue.prototype.$urlphp = 'http://localhost/project/cutif/admin-php/'
Vue.prototype.$urlFirebase = 'http://us-central1-cutif-bbde7.cloudfunctions.net/'

Vue.use(VueFire)

Vue.use(Vuetify)
Vue.config.productionTip = false

import fb from '@/firebase.js'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  beforeCreate () {
    fb.auth().onAuthStateChanged(user => {
      if (user) {
        this.$bindAsArray('detailUser', fb.database().ref('users').child(user.uid), null, snap => {
          this.$store.commit('changeDetailUser', snap.val())
        })
        this.$store.commit('changeUser', user)
        let messaging = fb.messaging()
        messaging.requestPermission()
        .then(() => {
          console.log('have permission')
          return messaging.getToken()
        })
        .then(token => {
          let updates = {}
          updates['/users/' + user.uid + '/token'] = token
          fb.database().ref().update(updates)
        })
        .catch(err => {
          console.log(err)
        })
      }
    })
  }
})
