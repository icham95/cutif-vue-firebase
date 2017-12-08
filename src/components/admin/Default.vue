<template>
  <v-app light>
    <v-navigation-drawer
      persistent
      clipped
      v-model="drawer"
      enable-resize-watcher
      app
      primary
    >
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
          @click.prevent = "$router.push('/admin/' + item.push)"
        >
          <v-list-tile-action>
            <v-icon light v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          value="true"
          @click.prevent = "logout"
        >
          <v-list-tile-action>
            <v-icon light>arrow_left</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title> Logout </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar fixed app clipped-left dark color="purple">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    
    <main>
      <v-content>
        <v-container fluid>
          <v-slide-y-transition mode="out-in">
            <v-layout>
              <router-view></router-view>
              </blockquote>
            </v-layout>
          </v-slide-y-transition>
        </v-container>
      </v-content>
    </main>

    <v-footer fixed app>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
  import fb from '@/firebase.js'
  import {mapGetters} from 'vuex'
  export default {
    data () {
      return {
        drawer: true,
        items: [
          { icon: 'home', push: 'dashboard', title: 'Dashboard' },
          { icon: 'people', push: 'users', title: 'Users' },
          { icon: 'school', push: 'program-studi', title: 'Program Studi' },
          { icon: 'money', push: 'rekening', title: 'Rekening' }
        ],
        title: 'Admin'
      }
    },
    computed: {
      ...mapGetters([
        'getUser',
        'getDetailUser'
      ])
    },
    methods: {
      cekLogin () {
        if (this.getUser) {
          if (this.getDetailUser.role !== 1) {
            this.$router.push('/')
          }
        } else {
          this.$router.push('/')
        }
      },
      logout () {
        this.$store.commit('changeUser', null)
        this.$store.commit('changeDetailUser', [])
        fb.auth().signOut()
      }
    },
    watch: {
      getUser () {
        this.cekLogin()
      }
    }
    // mounted () {
    //   this.cekLogin()
    // }
  }
</script>