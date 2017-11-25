<template>
  <v-layout column>
    <v-layout style="margin-bottom:15px;">
      <v-flex xs12 md6>
        
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12 md4 style="margin-right:15px;">
        <v-card>
          <v-card-title>
            <v-icon>home</v-icon>
            <b style="font-size:22px;margin-left:15px;">Cuti</b>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text align="center">
            <div style="margin-bottom:10px;">
              <b>Nama lengkap</b>
              <div style="padding-top:5px;">
                {{ user.fullname }}
              </div>
            </div>
            <v-divider></v-divider>

            <div style="margin-bottom:10px;margin-top:10px;">
              <b>NPM</b>
              <div style="padding-top:5px;">
                {{ user.npm }}
              </div>
            </div>
            <v-divider></v-divider>

            <div style="margin-bottom:10px;margin-top:10px;" v-if="programStudis[user.programStudi]">
              <b>Program Studi</b>
              <div style="padding-top:5px;">
                {{ programStudis[user.programStudi].name }}
              </div>
            </div>
            <v-divider></v-divider>

            <div style="margin-bottom:10px;margin-top:10px;">
              <b>Tahun Akademik</b>
              <div style="padding-top:5px;">
                {{ user.tahunAkademik }}
              </div>
            </div>
            <v-divider></v-divider>

            <div style="margin-bottom:10px;margin-top:10px;">
              <b>IPK</b>
              <div style="padding-top:5px;">
                {{ cuti.ipk }}
              </div>
            </div>
            <v-divider></v-divider>

            <div style="margin-bottom:10px;margin-top:10px;">
              <b>Jumlah SKS</b>
              <div style="padding-top:5px;">
                {{ cuti.jumlahSks }}
              </div>
            </div>
            <v-divider></v-divider>

            <div style="margin-bottom:10px;margin-top:10px;">
              <b>Jumlah Semester Cuti</b>
              <div style="padding-top:5px;">
                {{ cuti.jumlahSemester }}
              </div>
            </div>
            <v-divider></v-divider>

            <div style="margin-bottom:10px;margin-top:10px;">
              <b>Tahun Semester</b>
              <div style="padding-top:5px;">
                {{ cuti.tahunSemester }}
              </div>
            </div>
            <v-divider></v-divider>

            <div style="margin-bottom:10px;margin-top:10px;">
              <b>Cuti di Semester</b>
              <div style="padding-top:5px;">
                {{ cuti.semester }}
              </div>
            </div>
            <v-divider></v-divider>

            <div style="margin-bottom:10px;margin-top:10px;">
              <b>Alasan</b>
              <div style="padding-top:5px;">
                {{ cuti.alasan }}
              </div>
            </div>
            <v-divider></v-divider>

            <div style="margin-bottom:10px;margin-top:10px;">
              <b>No Hp</b>
              <div style="padding-top:5px;">
                {{ user.noHp }}
              </div>
            </div>
            <v-divider></v-divider>

          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 md4 style="margin-right:15px;">
        <v-card>
          <v-card-title>
            <v-icon>home</v-icon>
            <b style="font-size:22px;margin-left:15px;">Transaksi</b>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text align="center">
            <div style="padding-bottom:10px;" v-if="rekenings[transaksi.rekeningId]">
              <b>Ke Rekening</b>
              <div style="padding-top:7px;">
                <div>{{ rekenings[transaksi.rekeningId].name }}</div>
                <div>{{ rekenings[transaksi.rekeningId].no }}</div>
              </div>
            </div>
            <v-divider></v-divider>

            <div style="padding-bottom:10px;padding-top:10px;" v-if="transaksi.noRekeningMahasiswa">
              <b>No Rekening</b>
              <div style="padding-top:7px;">
                {{ transaksi.noRekeningMahasiswa }}
              </div>
            </div>
            <v-divider></v-divider>

            <div style="padding-bottom:10px;padding-top:10px;" v-if="transaksi.bayar">
              <b>Jumlah</b>
              <div style="padding-top:7px;">
                {{ transaksi.bayar }}
              </div>
            </div>
            <v-divider></v-divider>

            <div style="padding-bottom:10px;padding-top:10px;" v-if="transaksi.catatanMahasiswa">
              <b>Catatan Mahasiswa</b>
              <div style="padding-top:7px;">
                {{ transaksi.catatanMahasiswa }}
              </div>
            </div>
            <v-divider></v-divider>

            <div style="padding-bottom:10px;padding-top:10px;" v-if="transaksi.picBukti">
              <b>Bukti</b>
              <div style="padding-top:7px;">
                <img :src="picBukti" alt="" style="width:100%;">    
              </div>
            </div>
            <v-divider></v-divider>

          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 md4>
        <v-btn block color="purple" dark @click.native.prevent="reallyInit()"> Refresh </v-btn>
        <v-btn block color="teal" dark @click.native.prevent="exportPDF()"> Export PDF </v-btn>
        <v-card style="margin-bottom:15px;" dark :color="statusTransaksi(transaksi.status)">
          <v-card-text>
            <h5 style="padding:0;margin:0;">Status</h5>
            <b v-if="transaksi.status == 1"> First Confirmation</b>
            <b v-if="transaksi.status == 2"> Ditolak </b>
            <b v-if="transaksi.status == 3"> Pembayaran </b>
            <b v-if="transaksi.status == 4"> Menunggu konfirmasi BAAK </b>
            <b v-if="transaksi.status == 5"> Mahasiswa Cuti </b>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-title>
            <b>Actions</b>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-select
            :items="actions"
            v-model="action"
            label="Actions"
            ></v-select>
            <v-btn dark color="primary" block
            @click.native.prevent="proses()"
            > Proses </v-btn>
          </v-card-text>
          <v-card-text v-if="action == 'Pembayaran'">
            Pembayaran
          </v-card-text>
          <v-card-text v-if="action == 'Tolak' || action == 'Pembayaran'">
            <v-text-field v-model="form.message"
            label="Pesan" textarea
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
  import fb from '@/firebase.js'
  import pdf from '@/components/include/pdf.js'
  import axios from 'axios'
  export default {
    data () {
      return {
        user: [],
        cuti: [],
        transaksi: [],
        programStudis: [],
        rekenings: [],
        picBukti: null,
        picUser: null,
        actions: ['Konfirmasi Pertama', 'Tolak', 'Pembayaran', 'Jadikan Cuti'],
        action: 'Konfirmasi Pertama',
        form: {
          message: ''
        }
      }
    },
    methods: {
      getUser (uid) {
        fb.database().ref('/users').child(uid).on('value', snap => {
          this.user = snap.val()
        })
      },
      getCuti (id) {
        fb.database().ref('/cuti').child(id).on('value', snap => {
          this.cuti = snap.val()
        })
      },
      getTransaksi (id) {
        fb.database().ref('/transaksi_cuti').child(id).on('value', snap => {
          this.transaksi = snap.val()
          this.getPicture('pics/bukti/' + this.transaksi.bukti)
          .then(url => {
            this.picBukti = url
          })
        })
      },
      getProgramStudi () {
        fb.database().ref('/programStudi').on('value', snap => {
          this.programStudis = snap.val()
        })
      },
      getRekening () {
        fb.database().ref('/rekening').on('value', snap => {
          this.rekenings = snap.val()
        })
      },
      statusTransaksi (status) {
        if (status === 1) {
          return 'teal'
        }
        if (status === 2) {
          return 'red'
        }
        if (status === 3) {
          return 'purple'
        }
        if (status === 4) {
          return 'indigo'
        }
        if (status === 5) {
          return 'blue'
        }
      },
      getPicture (path) {
        return fb.storage().ref(path).getDownloadURL()
      },
      proses () {
        let updates = {}
        let message = ''
        if (this.action === 'Konfirmasi Pertama') {
          updates['/transaksi_cuti/' + this.$route.params.idTransaksi + '/status'] = 1
          message = 'berhasil.'
        }
        if (this.action === 'Tolak') {
          updates['/transaksi_cuti/' + this.$route.params.idTransaksi + '/status'] = 2
          updates['/transaksi_cuti/' + this.$route.params.idTransaksi + '/catatanAdmin'] = this.form.message
          message = 'berhasil di tolak'
        }
        if (this.action === 'Pembayaran') {
          updates['/transaksi_cuti/' + this.$route.params.idTransaksi + '/status'] = 3
          updates['/transaksi_cuti/' + this.$route.params.idTransaksi + '/catatanAdmin'] = this.form.message
          message = 'berhasil.'
        }
        if (this.action === 'Jadikan Cuti') {
          updates['/transaksi_cuti/' + this.$route.params.idTransaksi + '/status'] = 5
          message = 'berhasil.'
        }
        fb.database().ref().update(updates)
        this.resetForm()
        this.$toasted.show(message)
      },
      resetForm () {
        this.form.message = null
      },
      async reallyInit () {
        let idUser = this.$route.params.idUser
        let idTransaksi = this.$route.params.idTransaksi
        let idCuti = this.$route.params.idCuti
        await this.getRekening()
        await this.getProgramStudi()
        await this.getUser(idUser)
        await this.getCuti(idCuti)
        await this.getTransaksi(idTransaksi)
      },
      exportPDF () {
        axios.get(window.location.origin + '/static/img/logoStikom.png', {
          responseType: 'blob'
        }).then(resp => {
          let data = {
            fullname: this.user.fullname,
            npm: this.user.npm,
            programStudi: this.programStudis[this.user.programStudi].name,
            mahasiswaTahunAkademik: this.user.tahunAkademik,
            alamat: this.user.alamat,
            noHp: this.user.noHp,
            jumlahSemester: this.cuti.jumlahSemester,
            jumlahSks: this.cuti.jumlahSks,
            ipk: this.cuti.ipk,
            semester: this.cuti.semester,
            alasan: this.cuti.alasan,
            tempat: this.cuti.tempat
          }
          let reader = new FileReader()
          reader.addEventListener('load', () => {
            data.logo = reader.result
            pdf.cuti(data)
          })
          reader.readAsDataURL(resp.data)
        })
      }
    },
    mounted () {
      this.reallyInit()
    }
  }
</script>
