<template>
    <v-layout>

      <v-flex xs6 md4 style="margin-right: 15px;">
        <v-card>
          <v-card-title style="">
            <b>Create Users</b>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text style="padding-top:0;padding-bottom:0;">
            <v-container>
              <v-select
                v-bind:items="roles"
                v-model="form.role"
                label="Role"
                bottom
                clearable
                :disabled="(form.id == false ? false : true)"
              ></v-select>
              <v-text-field
                label="Npm"
                v-model="form.npm"
                clearable
                v-if="form.role == 2"
              ></v-text-field>
              <v-text-field
                label="Fullname"
                v-model="form.fullname"
                clearable
              ></v-text-field>
              <v-select
                v-bind:items="programStudi"
                v-model="form.programStudi"
                label="Program Studi"
                bottom
                :loading="form.programStudiLoading"
                clearable
                item-text="name"
                v-if="form.role == 2"
              ></v-select>
              <v-select
                v-bind:items="tahunAkademik"
                v-model="form.tahunAkademik"
                label="Tahun Akademik"
                bottom
                clearable
                v-if="form.role == 2"
              ></v-select>
              <v-text-field
                label="Alamat"
                v-model="form.alamat"
                clearable
                textarea
              ></v-text-field>
              <v-text-field
                label="No Hp"
                v-model="form.noHp"
                clearable
              ></v-text-field>
              <v-text-field
                v-if="form.id == false"
                label="Email"
                v-model="form.email"
                clearable
              ></v-text-field>
              <v-text-field
                v-if="form.id == false"
                label="Password"
                v-model="form.password"
                clearable
              ></v-text-field>
            </v-container>
          </v-card-text>
          <v-card-actions style="padding-top:0;">
            <v-btn color = "primary" @click.native.prevent = "create()" v-if="this.form.id == false">
              Create
            </v-btn>
            <div v-else>
              <v-btn color = "teal" dark @click.native.prevent = "update()">
                Update
              </v-btn>
              <v-btn color = "warning" dark @click.native.prevent = "reset">
                Reset
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-flex>

      <v-flex xs6 md5>
        <v-card>
          <v-card-title style="position:relative;">
            <b>Users</b>
            <v-btn small color="primary" icon dark 
            style="position:absolute;top:0;right:0;"
            @click.native.prevent="get()">
              <v-icon>refresh</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-progress-linear v-bind:indeterminate="true" v-if="loading"></v-progress-linear>
          <v-text-field v-model="pencarian" 
          @keyup.native.enter.prevent="search()"
          label="Pencarian nama"
          ></v-text-field>
          <v-list v-for="item in users" two-line
          style="padding:0;">
            <v-list-tile avatar @click="">
              <v-list-tile-avatar>
                <v-icon> account_box </v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title >{{item.fullname}}</v-list-tile-title>
                <v-list-tile-sub-title >
                  <div v-if="item.role == 1">
                    Admin
                  </div>
                  <div v-if="item.role == 2">
                    Mahasiswa
                  </div>
                  <div v-if="item.role == 3">
                    Baak
                  </div>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn flat icon color="red" @click.native.prevent="trash(item)">
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-list-tile-action>
              <v-list-tile-action>
                <v-btn flat icon color="teal" @click.native.prevent="edit(item)">
                  <v-icon>update</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
          <v-btn @click.native.prevent="next()" block dark color="teal">More</v-btn>
        </v-card>
      </v-flex>

    </v-layout>
</template>

<script>
  import axios from 'axios'
  import fb from '@/firebase.js'
  import fb2 from '@/firebase2.js'
  import {mapGetters} from 'vuex'
  export default {
    data () {
      return {
        limit: 10,
        endAt: null,
        page: 1,
        userUpdateTemp: [],
        programStudi: [],
        users: [],
        loading: false,
        pencarian: null,
        form: {
          id: false,
          npm: null,
          fullname: null,
          programStudi: null,
          programStudiLoading: false,
          tahunAkademik: null,
          alamat: null,
          noHp: null,
          email: null,
          password: null,
          role: 2
        },
        tahunAkademik: [],
        roles: [
          {text: 'Admin', value: 1},
          {text: 'Mahasiswa', value: 2},
          {text: 'Baak', value: 3}
        ]
      }
    },
    methods: {
      getProgramStudi () {
        this.form.programStudiLoading = true
        this.$bindAsArray('programStudi', fb.database().ref('programStudi'), null, snap => {
          this.form.programStudiLoading = false
        })
      },
      get () {
        this.loading = true
        let get = fb.database().ref('users')
        get.limitToFirst(this.limit).on('value', snap => {
          this.limit += 10
          this.users = snap.val()
          this.loading = false
        })
      },
      next () {
        this.get()
      },
      prev () {
        // asd
      },
      async create (skipUser = false) {
        this.loading = true
        this.$toasted.show('Proses..', {
          duration: null
        })
        let user
        if (skipUser === false) {
          user = await fb2.auth().createUserWithEmailAndPassword(this.form.email, this.form.password)
        } else {
          user = skipUser
        }
        let updates = {}
        let post = {
          fullname: this.form.fullname,
          alamat: this.form.alamat,
          noHp: this.form.noHp,
          role: this.form.role
        }
        if (this.form.role === 2) {
          post.npm = this.form.npm
          post.programStudi = this.form.programStudi['.key']
          post.tahunAkademik = this.form.tahunAkademik
          updates['/programStudi/' + this.form.programStudi['.key'] + '/users/' + user.uid] = true
        }
        updates['/users/' + user.uid] = post
        try {
          fb.database().ref().update(updates)
        } catch (err) {
          console.log(err)
          this.$toasted.clear()
          this.$toasted.show('retrying.. something errors : ' + err)
          this.create(user)
        }
        fb2.auth().signOut()
        this.$toasted.clear()
        this.$toasted.show('Success.')
        this.reset()
        this.loading = false
      },
      trash (item) {
        let r = confirm('uh oh, yakin dihapus ?')
        if (r === true) {
          this.loading = true
          this.$toasted.show('proses delete', {
            duration: null
          })
          fb.auth().currentUser.getIdToken(true).then(idToken => {
            axios.get(this.$urlphp + 'index.php', {
              headers: {
                'client-token': idToken
              },
              params: {
                type: 'delete',
                'target-uid': item['.key']
              }
            }).then(resp => {
              if (resp.data.success === false) {
                this.$toasted.error('failed.')
              } else {
                if (item.role === 2) {
                  fb.database().ref('/programStudi/' + item.programStudi + '/users/' + item['.key']).remove()
                }
                fb.database().ref('users').child(item['.key']).remove()
                this.$toasted.show('Success.')
              }
              this.$toasted.clear()
              this.loading = false
            })
          })
        }
      },
      edit (item) {
        this.form.id = item['.key']
        if (item.role === 2) {
          this.form.npm = item.npm
          this.form.programStudi = this.findProgramStudi(item)
          this.form.tahunAkademik = item.tahunAkademik
        }
        this.form.role = item.role
        this.form.fullname = item.fullname
        this.form.alamat = item.alamat
        this.form.noHp = item.noHp
        this.userUpdateTemp = item
      },
      update () {
        this.loading = true
        let put = {
          fullname: this.form.fullname,
          alamat: this.form.alamat,
          noHp: this.form.noHp,
          role: this.form.role
        }
        if (this.form.role === 2) {
          put.npm = this.form.npm
          put.programStudi = this.form.programStudi['.key']
          put.tahunAkademik = this.form.tahunAkademik
        }
        let push = {}
        push['users/' + this.form.id] = put
        push['programStudi/' + this.userUpdateTemp.programStudi + '/users/' + this.form.id] = null
        push['programStudi/' + this.form.programStudi['.key'] + '/users/' + this.form.id] = true
        fb.database().ref().update(push)
        this.reset()
        this.$toasted.show('Success.')
        this.loading = false
      },
      reset () {
        this.form.id = false
        this.form.npm = null
        this.form.fullname = null
        this.form.programStudi = null
        this.form.programStudiLoading = false
        this.form.tahunAkademik = null
        this.form.alamat = null
        this.form.noHp = null
        this.form.email = null
        this.form.password = null
        this.form.role = null
      },
      findProgramStudi (item) {
        for (let i = 0; i < this.programStudi.length; i++) {
          if (this.programStudi[i]['.key'] === item.programStudi) {
            this.programStudi[i]['index'] = i
            return this.programStudi[i]
          }
        }
      },
      search () {
        this.loading = true
        fb.database().ref('/users')
        .orderByChild('fullname')
        .startAt(this.pencarian)
        .endAt(this.pencarian + '\uf8ff')
        .on('value', snap => {
          this.users = snap.val()
          this.loading = false
        })
      }
    },
    computed: {
      ...mapGetters([
        'getUser'
      ])
    },
    mounted () {
      this.getProgramStudi()
      this.get()
      for (let i = 0; i < 19; i++) {
        this.tahunAkademik.push({
          text: (2018 - i),
          value: (2018 - i)
        })
      }
    }
  }
</script>

<style lang="">
  
</style>
