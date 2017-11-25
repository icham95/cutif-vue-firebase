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
        <caption>Cuti</caption>
        <thead>
          <tr>
            <th scope="col">Jumlah Semester</th>
            <th scope="col">Jumlah Sks</th>
            <th scope="col">Ipk</th>
            <th scope="col">Semester</th>
            <th scope="col">Semester Tahun Akademik</th>
            <th scope="col">Alasan</th>
            <th scope="col">Tempat</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="8">
              <span>Sedang mengambil data..</span>
            </td>
          </tr>
          <tr v-for="(item, index) in cuti">
            <td data-label="Jumlah Semester">
              {{ item.jumlahSemester }}
            </td>
            <td data-label="Jumlah SKS">
              {{ item.jumlahSks }}
            </td>
            <td data-label="IPK">
              {{ item.ipk }}
            </td>
            <td data-label="Semester">
              {{ item.semester }}
            </td>
            <td data-label="Tahun Semester">
              {{ item.tahunSemester }}
            </td>
            <td data-label="Alasan">
              {{ item.alasan }}
            </td>
            <td data-label="Tempat">
              {{ item.tempat }}
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
                  <v-list-tile @click="$router.push('/user/cuti/' + index + '/' + item.transaksi_cuti)">
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
          <span class="headline">Form Cuti</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md6>
                <v-text-field label="Jumlah Semester" 
                hint="Jumlah semester kamu akan cuti"
                v-model="form.jumlahSemester"
                required type="number"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field label="Jumlah SKS" 
                v-model="form.jumlahSks"
                hint="Jumlah sks yang kamu peroleh"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field label="IPK" 
                v-model="form.ipk"
                hint="Jumlah ipk kamu peroleh"
                required type="number"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field label="Semester" 
                v-model="form.semester"
                hint="Cuti pada semester"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field label="Tahun Semester" 
                v-model="form.tahunSemester"
                hint="Tahun semester"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field label="Alasan" textarea
                v-model="form.alasan"
                hint="Alasan cuti"></v-text-field>
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
        cuti: [],
        saveStatus: false,
        updateStatus: false,
        itemUpdate: null,
        form: {
          jumlahSemester: null,
          jumlahSks: null,
          ipk: null,
          semester: null,
          tahunSemester: null,
          alasan: null,
          tempat: null
        }
      }
    },
    methods: {
      getCuti () {
        this.loading = true
        fb.database().ref('cuti')
        .orderByChild('uid')
        .equalTo(this.userStore.uid)
        .on('value', snap => {
          this.cuti = snap.val()
          this.loading = false
        })
      },
      getTransaksiCuti (id) {
        this.loading = true
        this.$bindAsObject('transaksiCuti', fb.database().ref('transaksi_cuti/' + id), null, snap => {
          this.loading = false
        })
      },
      openDialogUpdate (id, item) {
        this.itemUpdate = item
        this.itemUpdate.id = id
        this.form.jumlahSemester = item.jumlahSemester
        this.form.jumlahSks = item.jumlahSks
        this.form.ipk = item.ipk
        this.form.semester = item.semester
        this.form.tahunSemester = item.tahunSemester
        this.form.alasan = item.alasan
        this.form.tempat = item.tempat
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
        update.transaksi_cuti = this.itemUpdate.transaksi_cuti
        fb.database().ref('/cuti/' + this.itemUpdate.id).set(update)
        this.loading = false
        this.$toasted.show('berhasil update!')
        this.cancelUpdate()
      },
      trash (id, item) {
        let confirm = window.confirm('Yakin ingim menghapus ?')
        if (confirm === true) {
          this.loading = true
          let updates = {}
          updates['/cuti/' + id] = null
          updates['/transaksi_cuti/' + item.transaksi_cuti] = null
          updates['/users/' + this.userStore.uid + '/cuti/' + id] = null
          updates['/users/' + this.userStore.uid + '/transaksi_cuti/' + item.transaksi_cuti] = null
          fb.database().ref().update(updates)
          alert('berhasil menghapus!')
          this.loading = false
        }
      },
      add () {
        // asd
        let uid = fb.auth().currentUser.uid
        let newKeyCuti = fb.database().ref('cuti').push().key
        let newKeyTransaksiCuti = fb.database().ref('transaksi_cuti').push().key
        let postCuti = this.form
        postCuti.uid = uid
        postCuti.transaksi_cuti = newKeyTransaksiCuti
        let postTransaksiCuti = {
          catatanMahasiswa: '',
          catatanAdmin: '',
          tunggakan: '',
          bayar: '',
          status: 1,
          bukti: '',
          noRekeningMahasiswa: '',
          rekeningId: ''
        }
        postTransaksiCuti.cuti = newKeyCuti
        postTransaksiCuti.uid = uid
        let updates = {}
        updates['/transaksi_cuti/' + newKeyTransaksiCuti] = postTransaksiCuti
        updates['/cuti/' + newKeyCuti] = postCuti
        updates['/users/' + uid + '/cuti/' + newKeyCuti] = true
        updates['/users/' + uid + '/transaksi_cuti/' + newKeyTransaksiCuti] = true
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
        this.form.jumlahSemester = null
        this.form.jumlahSks = null
        this.form.ipk = null
        this.form.semester = null
        this.form.tahunSemester = null
        this.form.alasan = null
        this.form.tempat = null
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
          this.getCuti()
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
