<template>
  <v-app light>
    <v-navigation-drawer
      persistent
      clipped
      v-model="drawer"
      enable-resize-watcher
      app
    >
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
          @click.prevent = "$router.push('/baak/' + item.push)"
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

    <v-toolbar fixed app clipped-left dark color="indigo">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <div style="position:relative;">
        <v-btn 
        @click.native.prevent="(openNotif ? openNotif = false : openNotif = true)"
        icon>
          <v-badge left dark>
            <span slot="badge">{{ totalNotifications }}</span>
            <v-icon color="white">notifications</v-icon>
          </v-badge>
        </v-btn>

        <div v-if="openNotif"
        style="position:absolute;width:400px;left:-350px;">
          <v-card>
            <v-card-title>
              Notifications
            </v-card-title>
            <v-divider></v-divider>
            <v-list>
              <v-list-tile
                value="true"
                v-for="(item, i) in notifications"
                :key="i"
                @click.prevent = "openNotifs(item, i)"
              >
                <v-list-tile-content>
                  <v-list-tile-title>
                    <small v-if="item.type == 'write cuti'"> Cuti baru dari {{ item.byName }} </small>
                    <small v-if="item.type == 'update cuti'"> Cuti update dari {{ item.byName }} </small>
                    <small v-if="item.type == 'write aktif'"> Aktif baru dari {{ item.byName }} </small>
                    <small v-if="item.type == 'update aktif'"> Aktif update dari {{ item.byName }} </small>
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </div>

      </div>
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
  </v-app>
</template>

<script>
  import fb from '@/firebase.js'
  import {mapGetters} from 'vuex'
  export default {
    data () {
      return {
        totalNotifications: 0,
        notifications: [],
        openNotif: false,
        drawer: true,
        items: [
          { icon: 'home', push: 'dashboard', title: 'Dashboard' },
          { icon: 'event_note', push: 'cuti/first-confirmation', title: 'Cuti' },
          { icon: 'event_note', push: 'aktif/first-confirmation', title: 'Aktif' },
          { icon: 'account_box', push: 'profile', title: 'Profile' }
        ],
        title: 'STIKOM BINANIAGA'
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
          if (this.getDetailUser.role !== 3) {
            this.$router.push('/')
          }
        } else {
          this.$router.push('/')
        }
      },
      openNotifs (item, index) {
        if (item.type === 'write cuti') {
          fb.database().ref('/notifications/' + index + '/opened').set(true)
          this.$router.push('/baak/dcuti/' + item.cutiId + '/' + item.detail.transaksi_cuti + '/' + item.detail.uid)
        }
        if (item.type === 'update cuti') {
          console.log('/baak/dcuti/' + item.detail.cuti + '/' + item.cutiId + '/' + item.detail.uid)
          // fb.database().ref('/notifications/' + index + '/opened').set(true)
          this.$router.push('/baak/dcuti/' + item.cutiId + '/' + item.detail.transaksi_cuti + '/' + item.detail.uid)
        }
      },
      logout () {
        this.$store.commit('changeUser', null)
        this.$store.commit('changeDetailUser', [])
        fb.auth().signOut()
        this.cekLogin()
      }
    },
    watch: {
      getUser () {
        this.cekLogin()
      }
    },
    mounted () {
      this.cekLogin()
      fb.database().ref('/notifications')
      .on('value', snap => {
        this.notifications = []
        this.totalNotifications = 0
        let datas = snap.val()
        let notif = {}
        for (let index in datas) {
          if (datas[index].opened !== true) {
            if (datas[index].from === 'user') {
              notif[index] = datas[index]
              this.totalNotifications += 1
              fb.database().ref('/users/' + notif[index].by).on('value', snap => {
                notif[index].byName = snap.val().fullname
                let strCutif = null
                if (notif[index].type === 'write cuti') {
                  strCutif = 'cuti'
                } else {
                  strCutif = 'aktif'
                }
                if (notif[index].type === 'update cuti') {
                  strCutif = 'transaksi_cuti'
                } else {
                  strCutif = 'transaksi_aktif'
                }
                fb.database().ref('/' + strCutif + '/' + notif[index].cutiId).on('value', snap => {
                  notif[index].detail = snap.val()
                })
              })
            }
          }
        }
        this.notifications = notif
      })
    }
  }
</script>
