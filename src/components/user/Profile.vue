<template>
  <v-layout>
    <v-flex xs4>
        <v-progress-linear v-if="loading.default"
        v-bind:indeterminate="loading.default"></v-progress-linear>
        <v-card >
            <v-flex xs12 
            text-xs-center
            align-center>
                <v-card-text style="position:relative;">
                  <a href="" @click.prevent="(edit.foto ? edit.foto = false : edit.foto = true)"
                  style="position:absolute;top:0;right:0;"
                  > {{ (edit.foto ? 'cancel' : 'edit') }} </a>
                    <v-avatar
                    size="120px"
                    class="grey lighten-4"
                    >
                        <img :src="fotoUser" v-if="edit.foto == false"
                        :alt="(userFromFirebase.photoURL == null ? 'tidak ada foto' : 'avatar')">
                        <img :src="form.fotoReady" v-if="edit.foto == true && form.fotoReady != null">
                    </v-avatar>
                    <UploadButton title="Browse foto" :selectedCallback="fileSelectedFoto"
                    v-if="edit.foto">
                    </UploadButton>
                    <v-btn block v-if="edit.foto" color="primary"
                    @click.native.prevent= "editFoto()"
                    :loading="loadingUploadFoto"> Upload </v-btn>
                </v-card-text>
            </v-flex>
            <v-flex xs12>
                <v-divider></v-divider>
                <v-card-text align="center">
                    <b>Nama</b>
                    <div>
                      {{ user.fullname }}
                    </div>  
                </v-card-text>
                <v-divider></v-divider>

                <v-card-text align="center">
                    <b>NPM</b>
                    <div>
                      {{ user.npm }}
                    </div>  
                </v-card-text>
                <v-divider></v-divider>

                <v-card-text align="center" v-if="programStudi != null">
                    <b>Program Studi</b>
                    <div>
                      {{ programStudi[user.programStudi].name }}
                    </div>  
                </v-card-text>
                <v-divider></v-divider>

                <v-card-text align="center">
                    <b>Tahun Akademik</b>
                    <div>
                      {{ user.tahunAkademik }}
                    </div>  
                </v-card-text>
                <v-divider></v-divider>

                <v-card-text align="center" style="position:relative;">
                  <a href="" @click.prevent="openEditAlamat()"
                  style="position:absolute;top:0px;right:0px;"> 
                    {{ (edit.alamat ? 'cancel' : 'edit') }}
                  </a>
                  <a href="" v-if="edit.alamat"
                  style="position:absolute;top:0px;left:0px;"
                  @click.prevent="editAlamat()"
                  > Simpan </a>
                  <div v-if="edit.alamat == false">
                    <b>Alamat</b>
                    <div>
                      {{ user.alamat }}
                    </div>  
                  </div>
                  <div v-if="edit.alamat">
                    <v-text-field 
                    @keyup.native.enter.prevent = "editAlamat()"
                    label = 'Alamat'
                    hint="klik simpan atau enter"
                    persistent-hint
                    v-model="form.alamat"></v-text-field>
                  </div>
                </v-card-text>
                <v-divider></v-divider>

                <v-card-text align="center" style="position:relative;">
                  <a href="" @click.prevent="openEditKontak()"
                  style="position:absolute;top:0px;right:0px;"> 
                    {{ (edit.kontak ? 'cancel' : 'edit') }}
                  </a>
                  <a href="" v-if="edit.kontak"
                  style="position:absolute;top:0px;left:0px;"
                  @click.prevent="editKontak()"
                  > Simpan </a>

                  <div v-if="edit.kontak == false">
                    <b>Kontak</b>
                    <div>
                      {{ user.noHp }}
                    </div>  
                  </div>

                  <div v-if="edit.kontak">
                    <v-text-field 
                    @keyup.native.enter.prevent = "editKontak()"
                    label = 'Kontak'
                    hint="klik simpan atau enter"
                    persistent-hint
                    v-model="form.kontak"></v-text-field>
                  </div>
                </v-card-text>
                <v-divider></v-divider>
            </v-flex>
        </v-card>
    </v-flex xs4>

    <v-flex xs4 style="margin-left:20px;">
      <v-card>
        <v-card-text align="center" style="position:relative;">
          <a href=""
          @click.prevent="openEditEmail()"
          style="position:absolute;top:0;right:0;"> 
            {{ (edit.email ? 'cancel' : 'edit') }} 
          </a>
          <a href="" v-if="edit.email"
          style="position:absolute;top:0;left:0;"
          @click.prevent="editEmail()">
            Simpan
          </a>
          <div v-if="edit.email == false">
            <b>Email</b>
            <div> {{ this.userFromFirebase.email }} </div>
            <div v-if="this.userFromFirebase.emailVerified"
            style="color:dodgerblue;"> Email terverifikasi </div>
            <div v-if="this.userFromFirebase.emailVerified == false" 
            style="color:red;"> Email tidak terverifikasi </div>
            <div v-if="this.userFromFirebase.emailVerified == false" 
            style="color:teal;">
              <a href="" @click.prevent="sendEmailVerification()"> Kirim verifikasi email </a>
            </div>
          </div>
          <div v-if="edit.email">
            <v-text-field 
            @keyup.native.enter.prevent = "editEmail()"
            label="email"
            persistent-hint
            hint="setelah anda mengupdate email, jika tidak logout otomatis silahkan anda logout terlebih dahulu."
            v-model="form.email"></v-text-field>
          </div>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-text align="center">
          <div>
            <b>Password</b>
            <div v-if="this.userFromFirebase.emailVerified == false"> 
              Anda harus memverifikasi email, untuk update password.
            </div>
            <div v-if="this.userFromFirebase.emailVerified">
              <v-text-field
              label="new password"
              hint=""
              v-model="form.password"
              persistent-hint
              ></v-text-field>
              <v-btn block color="primary" @click.native.prevent="updatePassword()"> Update password </v-btn>
            </div>
          </div>
        </v-card-text>
        <v-divider></v-divider>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import fb from '@/firebase.js'
  import UploadButton from '@/components/include/UploadButton.vue'
  export default {
    components: {
      UploadButton
    },
    data () {
      return {
        loadingUploadFoto: false,
        loading: {
          default: false
        },
        user: [],
        userFromFirebase: [],
        programStudi: null,
        fotoUser: null,
        edit: {
          alamat: false,
          kontak: false,
          foto: false,
          email: false
        },
        form: {
          alamat: null,
          kontak: null,
          foto: null,
          fotoReady: null,
          email: null,
          password: null
        }
      }
    },
    methods: {
      openEditAlamat () {
        if (this.edit.alamat) {
          this.edit.alamat = false
        } else {
          this.edit.alamat = true
          this.form.alamat = this.user.alamat
        }
      },
      editAlamat () {
        this.loading.default = true
        let updates = {}
        updates['users/' + this.userFromFirebase.uid + '/alamat'] = this.form.alamat
        fb.database().ref().update(updates)
        this.$toasted.show('berhasil menyimpan alamat.')
        this.edit.alamat = false
        this.loading.default = false
      },
      openEditKontak () {
        if (this.edit.kontak) {
          this.edit.kontak = false
        } else {
          this.edit.kontak = true
          this.form.kontak = this.user.noHp
        }
      },
      editKontak () {
        this.loading.default = true
        let updates = {}
        updates['users/' + this.userFromFirebase.uid + '/noHp'] = this.form.kontak
        fb.database().ref().update(updates)
        this.$toasted.show('berhasil menyimpan kontak.')
        this.edit.kontak = false
        this.loading.default = false
      },
      editFoto () {
        this.loadingUploadFoto = true
        let user = fb.auth().currentUser
        let fotoName = user.uid + '.jpg'
        let storageRef = fb.storage().ref('pics/avatar/' + fotoName)
        let task = storageRef.put(this.form.foto)
        task.on('state_changed', snap => {}, () => {
          this.$toasted.show('upload foto gagal.')
          this.loadingUploadFoto = false
        }, () => {
          user.updateProfile({
            photoURL: fotoName
          }).then(() => {
            fb.storage().ref('pics/avatar/' + user.photoURL).getDownloadURL()
            .then(url => {
              this.fotoUser = url
            })
            this.$toasted.show('upload foto berhasil.')
            this.loadingUploadFoto = false
          }).catch(() => {
            this.$toasted.show('upload foto gagal.')
            this.loadingUploadFoto = false
          })
        })
      },
      fileSelectedFoto (e) {
        this.form.foto = e
        let reader = new FileReader()
        reader.addEventListener('load', () => {
          this.form.fotoReady = reader.result
        })
        reader.readAsDataURL(e)
      },
      openEditEmail () {
        if (this.edit.email) {
          this.edit.email = false
        } else {
          this.edit.email = true
          this.form.email = this.userFromFirebase.email
        }
      },
      editEmail () {
        this.loading.default = true
        let user = fb.auth().currentUser
        user.updateEmail(this.form.email)
        .then(() => {
          this.$toasted.show('update email berhasil.')
          this.$toasted.show('Silahkan logout terlebih dahulu.')
          this.edit.email = false
          this.$store.commit('changeUser', null)
          this.$store.commit('changeDetailUser', [])
          fb.auth().signOut()
          this.loading.default = false
        }).catch((err) => {
          this.$toasted.show(err.message, {
            duration: 10000
          })
          this.edit.email = false
          this.loading.default = false
        })
      },
      sendEmailVerification () {
        this.loading.default = true
        let user = fb.auth().currentUser
        user.sendEmailVerification().then(() => {
          this.$toasted.show('verifikasi email telah terkirim, silahkan cek email anda.')
          this.loading.default = false
        }).catch(() => {
          this.$toasted.show('verifikasi email gagal.')
          this.loading.default = false
        })
      },
      updatePassword () {
        this.loading.default = true
        let user = fb.auth().currentUser
        let newPassword = this.form.password
        user.updatePassword(newPassword).then(() => {
          this.$toasted.show('update password berhasil.')
          this.loading.default = false
        }).catch((err) => {
          this.loading.default = false
          this.$toasted.show(err.message, {
            duration: 10000
          })
        })
      }
    },
    mounted () {
      this.loading = true
      fb.auth().onAuthStateChanged(user => {
        if (user) {
          this.userFromFirebase = user
          fb.storage().ref('pics/avatar/' + user.photoURL).getDownloadURL()
          .then(url => {
            this.fotoUser = url
          })
          fb.database().ref('users/' + user.uid).on('value', snap => {
            this.user = snap.val()
            fb.database().ref('programStudi').on('value', snap => {
              this.programStudi = snap.val()
              this.loading = false
            })
          })
        }
      })
    }
  }
</script>