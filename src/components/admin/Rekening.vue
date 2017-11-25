<template>
    <v-layout>

      <v-flex xs3 style="margin-right: 15px;">
        <v-card>
          <v-card-title style="">
            <b>Create Rekening</b>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text style="padding-top:0;padding-bottom:0;">
            <v-container>
              <v-text-field
                label="Name"
                v-model="form.name"
              ></v-text-field>
              <v-text-field
                label="No"
                v-model="form.no"
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
            <b>Rekening</b>
          </v-card-title>
          <v-progress-linear v-bind:indeterminate="true" v-if="loading"></v-progress-linear>
          <v-list v-for="(item, index) in rekening" two-line :key="index"
          style="padding:0;">
            <v-list-tile avatar @click="">
              <v-list-tile-avatar>
                <v-icon> money </v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title >{{item.name}}</v-list-tile-title>
                <v-list-tile-sub-title >{{item.no}}</v-list-tile-sub-title>
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
        rekening: [],
        loading: false,
        form: {
          id: false,
          name: null,
          no: null
        }
      }
    },
    methods: {
      get () {
        this.loading = true
        this.$bindAsArray('rekening', fb.database().ref('rekening'), null, snap => {
          this.loading = false
        })
      },
      create () {
        this.loading = true
        fb.database().ref('rekening').push({
          name: this.form.name,
          no: this.form.no
        })
        this.form.name = null
        this.form.no = null
        this.$toasted.show('Success.')
        this.loading = false
      },
      trash (item) {
        let r = confirm('uh oh, yakin dihapus ?')
        if (r === true) {
          this.loading = true
          fb.database().ref('rekening').child(item['.key']).remove()
          this.$toasted.show('Success.')
          this.loading = false
        }
      },
      edit (item) {
        this.form.id = item['.key']
        this.form.name = item.name
        this.form.no = item.no
      },
      update () {
        this.loading = true
        fb.database().ref('rekening').child(this.form.id).set({
          name: this.form.name,
          no: this.form.no
        })
        this.form.name = null
        this.form.no = null
        this.form.id = false
        this.$toasted.show('Success.')
        this.loading = false
      },
      reset () {
        this.form.name = null
        this.form.no = null
        this.form.id = false
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
