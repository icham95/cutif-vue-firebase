<template>
  <div class="login-page">
    <div class="form">
      <h3>Login</h3>
      <form method="post" v-on:submit.prevent="login" name="loginForm">
        <input type="text" placeholder="email" v-model="form.email"/>
        <input type="password" placeholder="password" v-model="form.password"/>
        <v-btn 
        block
        color="primary"
        :loading="loading"
        @click.prevent = "login">
          Login
        </v-btn>
        <v-btn 
        block
        color="teal"
        @click.prevent = "(open.recoveryPassword ? open.recoveryPassword = false : open.recoveryPassword = true)">
          {{ (open.recoveryPassword ? 'Cancel recovery password' : 'Open recovery password') }}
        </v-btn>
        <div v-if="open.recoveryPassword">
          <input 
          type="text" placeholder="email" v-model="form.recoveryPassword"/>
          <v-btn block :loading="loadingRP"
          color="primary" @click.native.prevent="resetPassword()"> SEND RESET PASSWORD </v-btn>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import fb from '@/firebase.js'
  import {mapGetters} from 'vuex'
  export default {
    data () {
      return {
        open: {
          recoveryPassword: false
        },
        loading: false,
        loadingRP: false,
        user: {},
        form: {
          email: null,
          password: null,
          recoveryPassword: null
        }
      }
    },
    computed: {
      ...mapGetters([
        'getUser',
        'getDetailUser'
      ])
    },
    methods: {
      fgetUser (key) {
        this.$bindAsArray('user', fb.database().ref('users').child(key), null, snap => {
          let user = snap.val()
          if (user.role === 1) {
            this.$router.push('/admin/dashboard')
          } else if (user.role === 2) {
            this.$router.push('/user/dashboard')
          } else if (user.role === 3) {
            this.$router.push('/baak/dashboard')
          } else {
            this.$toasted.error('Kamu tidak punya autorisasi.', {
              duration: 10000
            })
          }
          this.loading = false
        })
      },
      login (e) {
        this.loading = true
        try {
          fb.auth().signInWithEmailAndPassword(this.form.email, this.form.password)
          .then(resp => {
            this.fgetUser(resp.uid)
          }).catch(error => {
            // Handle Errors here.
            // let errorCode = error.code
            let errorMessage = error.message
            this.loading = false
            // console.log(errorCode + ' - ' + errorMessage)
            this.$toasted.error(errorMessage, {
              duration: 10000
            })
          })
        } catch (err) {
          this.loading = false
          this.$toasted.error(err.message, {
            duration: 10000
          })
        }
      },
      cekLogin () {
        if (this.getUser) {
          if (this.getDetailUser.role === 1) {
            this.$router.push('/admin/dashboard')
          }
          if (this.getDetailUser.role === 2) {
            this.$router.push('/user/dashboard')
          }
          if (this.getDetailUser.role === 3) {
            this.$router.push('/baak/dashboard')
          }
        }
      },
      resetPassword () {
        this.loadingRP = true
        let auth = fb.auth()
        let emailAddress = this.form.recoveryPassword
        auth.sendPasswordResetEmail(emailAddress).then(() => {
          this.$toasted.show('reset berhasil di kirim ke email ' + emailAddress)
          this.loadingRP = false
        }).catch((error) => {
          this.$toasted.show(error.message)
          this.loadingRP = false
        })
      }
    },
    watch: {
      getDetailUser () {
        this.cekLogin()
      }
    },
    mounted () {
      this.cekLogin()
    }
  }
</script>

<style lang="">
@import url(https://fonts.googleapis.com/css?family=Roboto:300);

.login-page {
  width: 360px;
  padding: 8% 0 0;
  margin: auto;
}
.form {
  position: relative;
  z-index: 1;
  background: #FFFFFF;
  max-width: 360px;
  margin: 0 auto 100px;
  padding: 45px;
  text-align: center;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
}
.form input {
  font-family: "Roboto", sans-serif;
  outline: 0;
  background: #f2f2f2;
  width: 100%;
  border: 0;
  margin: 0 0 15px;
  padding: 15px;
  box-sizing: border-box;
  font-size: 14px;
}
.form .message {
  margin: 15px 0 0;
  color: #b3b3b3;
  font-size: 12px;
}
.form .message a {
  color: #4CAF50;
  text-decoration: none;
}
.form .register-form {
  display: none;
}
.container {
  position: relative;
  z-index: 1;
  max-width: 300px;
  margin: 0 auto;
}
.container:before, .container:after {
  content: "";
  display: block;
  clear: both;
}
.container .info {
  margin: 50px auto;
  text-align: center;
}
.container .info h1 {
  margin: 0 0 15px;
  padding: 0;
  font-size: 36px;
  font-weight: 300;
  color: #1a1a1a;
}
.container .info span {
  color: #4d4d4d;
  font-size: 12px;
}
.container .info span a {
  color: #000000;
  text-decoration: none;
}
.container .info span .fa {
  color: #EF3B3A;
}
body {
  background: #024959; /* fallback for old browsers */
  background: -webkit-linear-gradient(right, #024959, #8DC26F);
  background: -moz-linear-gradient(right, #024959, #8DC26F);
  background: -o-linear-gradient(right, #024959, #8DC26F);
  background: linear-gradient(to left, #024959, #8DC26F);
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;      
}
</style>
