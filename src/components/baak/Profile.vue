<template>
  <v-layout>
    <v-flex xs12 md4>
      <v-card style="margin-bottom:20px;">
        <v-card-title>
          <b>Profile</b>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text align="center">
          <div style="padding-bottom:10px;">
            <b>Nama Lengkap</b>
            <div style="padding-top:7px;">{{ user.fullname }}</div>
          </div>
        </v-card-text>
      </v-card>

      <v-card>
        <v-card-title>
          <b>Email & Password</b>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text align="center">
          <div style="padding-bottom:10px;position:relative;">
            <a href="" @click.prevent="(openForm.email ? openForm.email = false : openForm.email = true)" 
            style="position:absolute;top:0;right:0;">
              {{ (openForm.email ? 'Cancel' : 'Edit') }}
            </a>
            <a href="" v-if="openForm.email"
            @click.prevent="resetEmail()"
            style="position:absolute;top:0;left:0;">
              Simpan
            </a>
            <b>Email</b>
            <div style="padding-top:7px;">
              <div v-if="openForm.email == false">
                {{ userFromFirebase.email }}
                <div v-if="userFromFirebase.emailVerified" style="color:dodgerblue;">
                  Email Terverifikasi
                </div>
                <div v-if="userFromFirebase.emailVerified == false" style="color:red;">
                  Email Belum Terverifikasi
                </div>
                <v-btn small color="primary" dark block
                @click.native.prevent="sendEmailVerification()"
                v-if="userFromFirebase.emailVerified == false"> 
                Kirim verifikasi </v-btn>
              </div>
              <div v-if="openForm.email">
                <v-text-field v-model="form.email"
                label="Email"
                @keyup.native.enter.prevent = "resetEmail()"
                ></v-text-field>
              </div>
            </div>
          </div>
          <v-divider></v-divider>

          <div style="padding-bottom:10px;padding-top:10px;position:relative;">
            <div style="padding-top:7px;">
              <b>Password</b>
              <div v-if="userFromFirebase.emailVerified == false">
                Untuk update password, diharuskan memferivikasi email terlebih dahulu.
              </div>
              <div v-if="userFromFirebase.emailVerified">
                <v-text-field
                label="Password"
                v-model="form.password"
                ></v-text-field>
                <v-btn block color="primary" 
                @click.native.prevent="updatePassword()"
                > Update Password </v-btn>
              </div>
            </div>
          </div>
          <v-divider></v-divider>

        </v-card-text>
      </v-card>

    </v-flex>
  </v-layout>
</template>

<script>
  import fb from '@/firebase.js'
  export default {
    data () {
      return {
        form: {
          email: null,
          password: null
        },
        openForm: {
          email: false,
          password: false
        },
        user: [],
        userFromFirebase: []
      }
    },
    methods: {
      resetForm () {
        this.form.email = null
        this.form.password = null
      },
      resetEmail () {
        let user = fb.auth().currentUser
        user.updateEmail(this.form.email)
        .then(() => {
          this.$toasted.show('Email berhasil di update.')
          this.$toasted.show('Silahkan logout terlebih dahulu.')
          this.openForm.email = false
          this.$store.commit('changeUser', null)
          this.$store.commit('changeDetailUser', [])
          fb.auth().signOut()
        }).catch((err) => {
          this.$toasted.show(err.message, {
            duration: 10000
          })
          this.openForm.email = false
        })
      },
      sendEmailVerification () {
        let user = fb.auth().currentUser
        user.sendEmailVerification().then(() => {
          this.$toasted.show('verifikasi email telah terkirim, silahkan cek email anda.')
        }).catch(() => {
          this.$toasted.show('verifikasi email gagal.')
        })
      },
      updatePassword () {
        let user = fb.auth().currentUser
        let newPassword = this.form.password
        user.updatePassword(newPassword).then(() => {
          this.$toasted.show('update password berhasil.')
        }).catch((err) => {
          this.$toasted.show(err.message, {
            duration: 10000
          })
        })
      }
    },
    mounted () {
      fb.auth().onAuthStateChanged(user => {
        if (user) {
          this.userFromFirebase = user
          fb.database().ref('users/' + user.uid).on('value', snap => {
            this.user = snap.val()
          })
        }
      })
    }
  }
</script>
