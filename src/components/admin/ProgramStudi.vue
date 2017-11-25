<template>
    <v-layout>

      <v-flex xs3 style="margin-right: 15px;">
        <v-card>
          <v-card-title style="">
            <b>Create Program Studi</b>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text style="padding-top:0;padding-bottom:0;">
            <v-container>
              <v-text-field
                label="Name"
                v-model="form.name"
                :loading="form.nameLoading"
              ></v-text-field>
            </v-container>
          </v-card-text>
          <v-card-actions style="padding-top:0;">
            <v-btn color = "primary" @click.native.prevent = "create" v-if="this.form.id == false">
              Create
            </v-btn>
            <div v-else>
              <v-btn color = "teal" dark @click.native.prevent = "update">
                Update
              </v-btn>
              <v-btn color = "warning" dark @click.native.prevent = "reset">
                Reset
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-flex>

      <v-flex xs4>
        <v-card>
          <v-card-title>
            <b>Program Studi</b>
          </v-card-title>
          <v-progress-linear v-bind:indeterminate="true" v-if="loading"></v-progress-linear>
          <v-list v-for="item in programStudi" 
          style="padding:0;">
            <v-list-tile avatar @click="">
              <v-list-tile-avatar>
                <v-icon> school </v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title >{{item.name}}</v-list-tile-title>
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
        </v-card>
      </v-flex>
      
    </v-layout>
</template>

<script>
  import fb from '@/firebase.js'
  import {mapGetters} from 'vuex'
  export default {
    data () {
      return {
        programStudi: [],
        loading: false,
        form: {
          id: false,
          name: null,
          nameLoading: false
        }
      }
    },
    methods: {
      get () {
        this.loading = true
        this.$bindAsArray('programStudi', fb.database().ref('programStudi'), null, snap => {
          this.loading = false
        })
      },
      create () {
        this.nameLoading = false
        fb.database().ref('programStudi').push({
          name: this.form.name
        })
        this.form.name = null
        this.$toasted.show('Success.')
        this.nameLoading = true
      },
      trash (item) {
        let r = confirm('uh oh, yakin dihapus ?')
        if (r === true) {
          this.loading = true
          fb.database().ref('programStudi').child(item['.key']).remove()
          this.$toasted.show('Success.')
          this.loading = false
        }
      },
      edit (item) {
        this.form.id = item['.key']
        this.form.name = item.name
      },
      update () {
        this.loading = true
        fb.database().ref('programStudi').child(this.form.id).set({
          name: this.form.name
        })
        this.form.name = null
        this.form.id = false
        this.$toasted.show('Success.')
        this.loading = false
      },
      reset () {
        this.form.name = null
        this.form.id = false
        this.form.nameLoading = false
      }
    },
    computed: {
      ...mapGetters([
        'getUser'
      ])
    },
    mounted () {
      this.get()
    }
  }
</script>

<style lang="">
  
</style>
