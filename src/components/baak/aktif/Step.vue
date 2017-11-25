<template>
  <v-layout row column>
    <v-flex xs12>
      <v-progress-linear v-bind:indeterminate="loading" v-if="loading"></v-progress-linear>
      <v-btn @click.native.prevent="this.get()" icon dark primary>
        <v-icon>refresh</v-icon>
      </v-btn>
    </v-flex>
    <table>
      <caption>{{ title }}</caption>
      <thead>
        <tr>
          <th scope="col">NPM</th>
          <th scope="col">Nama lengkap</th>
          <th scope="col">Program Studi</th>
          <th scope="col">Tahun Akademik</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in transaksis">
          <td data-label="NPM">
            {{ item.user.npm }}
          </td>
          <td data-label="NAMA LENGKAP">
            {{ item.user.fullname }}
          </td>
          <td data-label="PROGRAM STUDI">
            <div v-if="programStudis[item.user.programStudi]">
              {{ programStudis[item.user.programStudi].name }}
            </div>
          </td>
          <td data-label="TAHUN AKADEMIK">
            {{ item.user.tahunAkademik }}
          </td>
          <td data-label="NPM">
            <v-btn small icon dark color="teal" 
            :to="'/baak/daktif/' + item.Aktif + '/' + index + '/' + item.uid">
              <v-icon>notes</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </table>
  </v-layout>
</template>

<script>
  import fb from '@/firebase.js'
  export default {
    props: {
      type: {
        type: Number,
        default: 1
      },
      title: String,
      default: null
    },
    data () {
      return {
        loading: false,
        transaksis: [],
        totalTransaksis: 0,
        programStudis: null
      }
    },
    methods: {
      getProgramStudi () {
        fb.database().ref('/programStudi').on('value', snap => {
          this.programStudis = snap.val()
        })
      },
      get () {
        this.loading = true
        fb.database().ref('/transaksi_aktif/')
        .orderByChild('status')
        .equalTo(this.type)
        .on('value', snap => {
          let transaksi = snap.val()
          for (let index in transaksi) {
            transaksi[index].user = {
              npm: null,
              fullname: null,
              tahunAkademik: null,
              programStudi: null
            }
            fb.database().ref('/users').child(transaksi[index].uid).on('value', snap => {
              let user = snap.val()
              transaksi[index].user = user
            })
          }
          this.loading = false
          this.transaksis = transaksi
        })
      }
    },
    mounted () {
      this.getProgramStudi()
      this.get()
    }
  }
</script>



<style lang="">
body {
  font-family: "Open Sans", sans-serif;
  line-height: 1.25;
}
table {
  border: 1px solid #ccc;
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  width: 100%;
  table-layout: fixed;
}
table caption {
  font-size: 1.5em;
  margin: .5em 0 .75em;
}
table tr {
  background: #f8f8f8;
  border: 1px solid #ddd;
  padding: .35em;
}
table th,
table td {
  padding: .625em;
  text-align: center;
}
table th {
  font-size: .85em;
  letter-spacing: .1em;
  text-transform: uppercase;
}
@media screen and (max-width: 600px) {
  table {
    border: 0;
  }
  table caption {
    font-size: 1.3em;
  }
  table thead {
    border: none;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }
  table tr {
    border-bottom: 3px solid #ddd;
    display: block;
    margin-bottom: .625em;
  }
  table td {
    border-bottom: 1px solid #ddd;
    display: block;
    font-size: .8em;
    text-align: right;
  }
  table td:before {
    /*
    * aria-label has no advantage, it won't be read inside a table
    content: attr(aria-label);
    */
    content: attr(data-label);
    float: left;
    font-weight: bold;
    text-transform: uppercase;
  }
  table td:last-child {
    border-bottom: 0;
  }
}
</style>
