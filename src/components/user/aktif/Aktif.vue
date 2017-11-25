<template>
  <v-layout>
    <div>
      <div>
        <v-btn float icon color="primary" dark
        @click.native.prevent="openDialogSave()">
          <v-icon>create</v-icon>
        </v-btn>
      </div>
      <v-card>
      <v-progress-linear v-bind:indeterminate="true" v-if="loading"></v-progress-linear>
      <table>
        <caption>Aktif</caption>
        <thead>
          <tr>
            <th scope="col">Tahun Akademik</th>
            <th scope="col">Nama Orang Tua</th>
            <th scope="col">NIP</th>
            <th scope="col">NRP</th>
            <th scope="col">Pangkat</th>
            <th scope="col">Golongan</th>
            <th scope="col">Instansi</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="8">
              <span>Sedang mengambil data..</span>
            </td>
          </tr>
          <tr v-for="(item, index) in Aktif">
            <td data-label="Tahun Akademik">
              {{ item.tahunAkademik }}
            </td>
            <td data-label="Nama Orang Tua">
              {{ item.namaOrangTua }}
            </td>
            <td data-label="NIP">
              {{ item.nip }}
            </td>
            <td data-label="NRP">
              {{ item.nrp }}
            </td>
            <td data-label="Pangkat">
              {{ item.pangkat }}
            </td>
            <td data-label="Golongan">
              {{ item.golongan }}
            </td>
            <td data-label="Instansi">
              {{ item.instansi }}
            </td>
            <td>
              <v-menu bottom left>
                <v-btn icon slot="activator" dark color="primary">
                  <v-icon>more_vert</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile>
                    <v-list-tile-title>Actions</v-list-tile-title>
                  </v-list-tile>
                  <v-divider></v-divider>
                  <v-list-tile @click="$router.push('/user/Aktif/' + index + '/' + item.transaksi_Aktif)">
                    <v-list-tile-action>
                      <v-icon color="teal">star</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>Detail</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile @click="openDialogUpdate(index, item)">
                    <v-list-tile-action>
                      <v-icon color="blue">update</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>Update</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile @click="trash(index, item)">
                    <v-list-tile-action>
                      <v-icon color="red">delete</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>Delete</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </tbody>
      </table>
      </v-card>
    </div>

    <v-dialog v-model="dialog" persistent max-width="500px" scrollable>
      <v-card>
        <v-card-title>
          <span class="headline">Form Aktif</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md6>
                <v-text-field label="Tahun Akademik" 
                hint="Tahun Akademik"
                v-model="form.tahunAkademik"
                required type="number"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field label="Nama Orang Tua" 
                v-model="form.namaOrangTua"
                hint="Nama Orang Tua"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field label="NIP" 
                v-model="form.nip"
                hint="NIP"
                required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field label="NRP" 
                v-model="form.nrp"
                hint="NRP"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field label="Pangkat" 
                v-model="form.pangkat"
                hint="Pangkat"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field label="Golongan" 
                v-model="form.golongan"
                hint="Golongan"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field label="Instansi" 
                v-model="form.instansi"
                hint="Instansi"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field label="Tempat" 
                v-model="form.tempat"
                hint="Tempat"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <div v-if="saveStatus">
            <v-btn color="blue darken-1" flat @click.native="cancelAdd()">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click.native="add()">
              Save
            </v-btn>
          </div>
          <div v-if="updateStatus">
            <v-btn color="blue darken-1" flat @click.native="cancelUpdate()">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click.native="update()">
              Update
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import fb from '@/firebase.js'
  import {mapGetters} from 'vuex'
  export default {
    data () {
      return {
        user: [],
        dialog: false,
        loading: false,
        Aktif: [],
        saveStatus: false,
        updateStatus: false,
        itemUpdate: null,
        form: {
          tahunAkademik: null,
          namaOrangTua: null,
          nip: null,
          nrp: null,
          pangkat: null,
          golongan: null,
          instansi: null,
          tempat: null
        }
      }
    },
    methods: {
      getAktif () {
        this.loading = true
        fb.database().ref('aktif')
        .orderByChild('uid')
        .equalTo(this.userStore.uid)
        .on('value', snap => {
          this.Aktif = snap.val()
          this.loading = false
        })
      },
      getTransaksiAktif (id) {
        this.$bindAsObject('transaksiAktif', fb.database().ref('transaksi_Aktif/' + id), null, snap => {
          this.loading = true
          this.loading = false
        })
      },
      openDialogUpdate (id, item) {
        this.itemUpdate = item
        this.itemUpdate.id = id
        // form
        this.form.tahunAkademik = item.tahunAkademik
        this.form.namaOrangTua = item.namaOrangTua
        this.form.nip = item.nip
        this.form.nrp = item.nrp
        this.form.pangkat = item.pangkat
        this.form.golongan = item.golongan
        this.form.instansi = item.instansi
        this.form.tempat = item.tempat
        // end form
        this.updateStatus = true
        this.dialog = true
      },
      cancelUpdate () {
        this.resetForm()
        this.dialog = false
      },
      update () {
        this.loading = true
        let update = this.form
        update.uid = this.userStore.uid
        update.transaksi_Aktif = this.itemUpdate.transaksi_Aktif
        fb.database().ref('/aktif/' + this.itemUpdate.id).set(update)
        this.loading = false
        this.$toasted.show('berhasil update!')
        this.cancelUpdate()
      },
      trash (id, item) {
        let confirm = window.confirm('Yakin ingim menghapus ?')
        if (confirm === true) {
          this.loading = true
          let updates = {}
          updates['/aktif/' + id] = null
          updates['/transaksi_aktif/' + item.transaksi_Aktif] = null
          updates['/users/' + this.userStore.uid + '/aktif/' + id] = null
          updates['/users/' + this.userStore.uid + '/transaksi_aktif/' + item.transaksi_Aktif] = null
          fb.database().ref().update(updates)
          alert('berhasil menghapus!')
          this.loading = false
        }
      },
      add () {
        // asd
        let uid = fb.auth().currentUser.uid
        let newKeyAktif = fb.database().ref('aktif').push().key
        let newKeyTransaksiAktif = fb.database().ref('transaksi_aktif').push().key
        let postAktif = this.form
        postAktif.uid = uid
        postAktif.transaksi_Aktif = newKeyTransaksiAktif
        let postTransaksiAktif = {
          catatanMahasiswa: '',
          catatanAdmin: '',
          tunggakan: '',
          bayar: '',
          status: 1,
          bukti: '',
          noRekeningMahasiswa: '',
          rekeningId: ''
        }
        postTransaksiAktif.Aktif = newKeyAktif
        postTransaksiAktif.uid = uid
        let updates = {}
        updates['/transaksi_aktif/' + newKeyTransaksiAktif] = postTransaksiAktif
        updates['/aktif/' + newKeyAktif] = postAktif
        updates['/users/' + uid + '/aktif/' + newKeyAktif] = true
        updates['/users/' + uid + '/transaksi_aktif/' + newKeyTransaksiAktif] = true
        fb.database().ref().update(updates)
        this.$toasted.show('berhasil menyimpan!')
        this.resetForm()
        this.dialog = false
      },
      cancelAdd () {
        this.resetForm()
        this.dialog = false
      },
      openDialogSave () {
        this.saveStatus = true
        this.dialog = true
      },
      resetForm () {
        this.itemUpdate = null
        this.saveStatus = false
        this.updateStatus = false
        this.form.tahunAkademik = null
        this.form.namaOrangTua = null
        this.form.nip = null
        this.form.nrp = null
        this.form.pangkat = null
        this.form.golongan = null
        this.form.instansi = null
      }
    },
    computed: {
      ...mapGetters({
        userStore: 'getUser'
      })
    },
    mounted () {
      fb.auth().onAuthStateChanged(user => {
        if (user) {
          this.getAktif()
        }
      })
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
