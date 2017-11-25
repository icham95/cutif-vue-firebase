<template>
  <v-flex xs12>
  <v-layout style="margin-bottom:10px;">
    <v-btn @click.native.prevent="reallyInit()"
    dark color="teal" dark> Refresh </v-btn>
    <v-btn @click.native.prevent="exportPDF()"
    dark color="indigo" dark> convert to pdf </v-btn>
  </v-layout>
  <v-layout row wrap>
    <v-flex xs12 md3 style="margin-right:20px;">
      <v-card :color="statusTransaksi(transaksi.status)" dark style="margin-bottom:10px;">
        <v-card-text>
          <h6 style="margin:0;margin-bottom:10px;"> Status </h6>
          <div>
            <span v-if="transaksi.status == 1"> Menunggu Konfirmasi Baak </span>
            <span v-if="transaksi.status == 2"> Ditolak </span>
            <span v-if="transaksi.status == 3"> Pembayaran </span>
            <span v-if="transaksi.status == 4"> Menunggu konfirmasi BAAK </span>
            <span v-if="transaksi.status == 5"> Mahasiswa Aktif </span>
          </div>
        </v-card-text>
      </v-card>
      <v-card style = "margin-bottom:10px;"

      v-if="transaksi.status == 2 || transaksi.status == 3">
        <v-card-text>
          <b>Message</b> : 
          <div style="margin-top:10px;">
            {{transaksi.catatanAdmin}}
          </div>
        </v-card-text>
      </v-card>

      <v-card style = "margin-bottom:10px;"
      v-if="transaksi.status == 3">
        <v-card-title> 
          <b>Pembayaran</b>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div>
            <v-select
              v-bind:items="rekening"
              v-model="formPembayaran.rekening"
              item-text="nameNo"
              item-value="id"
              label="Rekening"
              multi-line
              bottom
            ></v-select>
          </div>
          <div>
            <v-text-field v-model="formPembayaran.noRekeningMahasiswa" 
            label="No Rekening"></v-text-field>
          </div>
          <div>
            <v-text-field v-model="formPembayaran.bayar" 
            label="Jumlah"></v-text-field>
          </div>
          <div>
            <div v-if="formPembayaran.picPembayaranReady != null">
              <img :src="formPembayaran.picPembayaranReady" alt="" 
              style="width:100%;">
              <div style="margin:0 auto;">proses {{ buffer }}%</div>
            </div>
            <v-progress-linear
              v-model="buffer"
              buffer
              v-bind:buffer-value="bufferValue"
            ></v-progress-linear>
            <upload-button title="Bukti Gambar" :selectedCallback="fileSelectedFoto">
            </upload-button>
          </div>
          <div>
            <v-text-field v-model="formPembayaran.catatanMahasiswa" textarea 
            label="Catatan"></v-text-field>
          </div>
          <div>
            <v-btn :loading="loading.pembayaranStatusTiga" :disabled="loading.pembayaranStatusTiga"
            color="primary" block @click.native.prevent="pembayaranStatusTiga()">Proses</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 md4 style="margin-right:20px;">
      <v-progress-linear v-bind:indeterminate="loading.Aktif" v-if="loading.Aktif"></v-progress-linear>
      <v-card v-if="loading.Aktif == false">
        <v-card-title>
          <h5 style="margin-bottom:0;">Aktif</h5>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="text-align:center;">
          <div style="margin-bottom:10px;">
            <b>Nama lengkap</b>
            <div style="padding-top:5px;">
              {{ detailUser.fullname }}
            </div>
          </div>
          <v-divider></v-divider>

          <div style="margin-bottom:10px;margin-top:10px;">
            <b>NPM</b>
            <div style="padding-top:5px;">
              {{ detailUser.npm }}
            </div>
          </div>
          <v-divider></v-divider>

          <div style="margin-bottom:10px;margin-top:10px;">
            <b>Program Studi</b>
            <div style="padding-top:5px;" v-if="programStudi">
              {{ programStudi.name }}
            </div>
          </div>
          <v-divider></v-divider>

          <div style="margin-bottom:10px;margin-top:10px;">
            <b>Tahun Akademik</b>
            <div style="padding-top:5px;">
              {{ aktif.tahunAkademik }}
            </div>
          </div>
          <v-divider></v-divider>

          <div style="margin-bottom:10px;margin-top:10px;">
            <b>Nama Orang Tua</b>
            <div style="padding-top:5px;">
              {{ aktif.namaOrangTua }}
            </div>
          </div>
          <v-divider></v-divider>

          <div style="margin-bottom:10px;margin-top:10px;">
            <b>NIP</b>
            <div style="padding-top:5px;">
              {{ aktif.nip }}
            </div>
          </div>
          <v-divider></v-divider>

          <div style="margin-bottom:10px;margin-top:10px;">
            <b>NRP</b>
            <div style="padding-top:5px;">
              {{ aktif.nrp }}
            </div>
          </div>
          <v-divider></v-divider>

          <div style="margin-bottom:10px;margin-top:10px;">
            <b>Pangkat</b>
            <div style="padding-top:5px;">
              {{ aktif.pangkat }}
            </div>
          </div>
          <v-divider></v-divider>

          <div style="margin-bottom:10px;margin-top:10px;">
            <b>Golongan</b>
            <div style="padding-top:5px;">
              {{ aktif.golongan }}
            </div>
          </div>
          <v-divider></v-divider>

          <div style="margin-bottom:10px;margin-top:10px;">
            <b>Instansi</b>
            <div style="padding-top:5px;">
              {{ aktif.instansi }}
            </div>
          </div>
          <v-divider></v-divider>

        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs4 v-if="transaksi.status > 1">
      <v-progress-linear v-bind:indeterminate="loading.transaksi" v-if="loading.transaksi"></v-progress-linear>
      <v-card v-if="loading.transaksi == false">
        <v-card-title>
          <h5 style="margin-bottom:0;">Transaksi</h5>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="text-align:center;">
          <div v-if="transaksi.rekeningId != ''">
            <div style="margin-bottom:10px;">
              <b>Rekening</b>
              <div style="padding-top:5px;">
                <div>{{ rekeningOrigin[transaksi.rekeningId].name }} </div>
                <div>{{ rekeningOrigin[transaksi.rekeningId].no }} </div>
              </div>
            </div>
            <v-divider></v-divider>
          </div>

          <div v-if="transaksi.noRekeningMahasiswa != ''">
            <div style="margin-bottom:10px;margin-top:10px;">
              <b>No rekening</b>
              <div style="padding-top:5px;"> 
                {{ transaksi.noRekeningMahasiswa }} 
              </div>
            </div>
            <v-divider></v-divider>
          </div>          

          <div v-if="transaksi.bayar != ''">
            <div style="margin-bottom:10px;margin-top:10px;">
              <b>Jumlah</b>
              <div style="padding-top:5px;"> 
                {{ transaksi.bayar }} 
              </div>
            </div>
            <v-divider></v-divider>
          </div>

          <div v-if="transaksi.catatanMahasiswa != ''">
            <div style="margin-bottom:10px;margin-top:10px;">
              <b>Catatan</b>
              <div style="padding-top:5px;"> 
                {{ transaksi.catatanMahasiswa }} 
              </div>
            </div>
            <v-divider></v-divider>
          </div>

          <div v-if="transaksi.bukti != ''">
            <div style="margin-bottom:10px;margin-top:10px;">
              <b>Bukti</b>
              <div style="padding-top:5px;"> 
                <img :src="picBukti" alt="" style="width:100%;"
                v-if="picBukti != null">
              </div>
            </div>
            <v-divider></v-divider>
          </div>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
  </v-flex>
</template>

<script>
  import UploadButton from '@/components/include/UploadButton.vue'
  import fb from '@/firebase.js'
  import {mapGetters} from 'vuex'
  import pdf from '@/components/include/pdf.js'
  import axios from 'axios'
  export default {
    components: {
      UploadButton
    },
    data () {
      return {
        loading: {
          aktif: false,
          transaksi: false,
          programStudi: false,
          rekening: false,
          pembayaranStatusTiga: false
        },
        idAktif: null,
        idTransaksi: null,
        aktif: {
          ipk: 0
        },
        transaksi: {
          status: 0
        },
        programStudi: null,
        rekening: [],
        rekeningOrigin: null,
        bufferValue: 100,
        buffer: 0,
        picBukti: null,
        formPembayaran: {
          rekening: null,
          noRekeningMahasiswa: null,
          bukti: {
            name: null
          },
          bayar: null,
          catatanMahasiswa: null,
          picPembayaranReady: null
        }
      }
    },
    methods: {
      getAktif (id) {
        this.loading.Aktif = true
        fb.database().ref('aktif').child(id).on('value', snap => {
          this.aktif = snap.val()
          this.loading.Aktif = false
          this.getProgramStudi()
        })
      },
      getTransaksi (id) {
        this.loading.transaksi = true
        fb.database().ref('transaksi_aktif').child(id).on('value', snap => {
          this.transaksi = snap.val()
          this.loading.transaksi = false
          this.getPicBukti()
        })
      },
      getProgramStudi () {
        this.loading.programStudi = true
        fb.database().ref('programStudi/' + this.detailUser.programStudi).on('value', snap => {
          this.programStudi = snap.val()
          this.loading.programStudi = false
        })
      },
      getRekening () {
        this.loading.rekening = true
        fb.database().ref('rekening').on('value', snap => {
          let data = snap.val()
          this.rekeningOrigin = data
          let items = []
          for (let index in data) {
            items.push({
              id: index,
              nameNo: data[index].name + ' | ' + data[index].no,
              name: data[index].name,
              no: data[index].no
            })
          }
          this.rekening = items
          this.loading.rekening = false
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
      init () {
        this.idAktif = this.$route.params.idAktif
        this.idTransaksi = this.$route.params.idTransaksi
      },
      fileSelectedFoto (e) {
        this.formPembayaran.bukti = e
        let reader = new FileReader()
        reader.addEventListener('load', () => {
          this.formPembayaran.picPembayaranReady = reader.result
        })
        reader.readAsDataURL(e)
      },
      pembayaranStatusTiga () {
        this.loading.pembayaranStatusTiga = true
        let fotoName = Date.now() + this.formPembayaran.bukti.name
        let storageRef = fb.storage().ref('pics/bukti/' + fotoName)
        storageRef.put(this.formPembayaran.bukti).on('state_changed', (snap) => {
          let percentage = (snap.bytesTransferred / snap.totalBytes) * 100
          this.buffer = percentage
        }, () => {
          this.$toasted.show('upload gambar gagal')
          this.$toasted.show('Proses gagal')
          this.loading.pembayaranStatusTiga = false
        }, () => {
          let updates = {}
          updates['/transaksi_aktif/' + this.$route.params.idTransaksi + '/bayar'] = this.formPembayaran.bayar
          updates['/transaksi_aktif/' + this.$route.params.idTransaksi + '/catatanMahasiswa'] = this.formPembayaran.catatanMahasiswa
          updates['/transaksi_aktif/' + this.$route.params.idTransaksi + '/noRekeningMahasiswa'] = this.formPembayaran.noRekeningMahasiswa
          updates['/transaksi_aktif/' + this.$route.params.idTransaksi + '/rekeningId'] = this.formPembayaran.rekening
          updates['/transaksi_aktif/' + this.$route.params.idTransaksi + '/bukti'] = fotoName
          updates['/transaksi_aktif/' + this.$route.params.idTransaksi + '/status'] = 4
          fb.database().ref().update(updates)
          this.$toasted.show('Proses berhasil')
          this.$toasted.show('upload gambar berhasil')
          this.loading.pembayaranStatusTiga = false
        })
      },
      getPicBukti () {
        if (this.transaksi.bukti) {
          fb.storage().ref('pics/bukti/' + this.transaksi.bukti).getDownloadURL()
          .then(url => {
            this.picBukti = url
          })
        }
      },
      reallyInit () {
        fb.auth().onAuthStateChanged(user => {
          if (user) {
            this.init()
            this.getAktif(this.idAktif)
            this.getTransaksi(this.idTransaksi)
            this.getRekening()
          }
        })
      },
      exportPDF () {
        axios.get(window.location.origin + '/static/img/logoStikom.png', {
          responseType: 'blob'
        }).then(resp => {
          let data = {
            fullname: this.detailUser.fullname,
            npm: this.detailUser.npm,
            programStudi: this.programStudi.name,
            mahasiswaTahunAkademik: this.detailUser.tahunAkademik,
            namaOrangTua: this.aktif.namaOrangTua,
            nip: this.aktif.nip,
            nrp: this.aktif.nrp,
            pangkat: this.aktif.pangkat,
            golongan: this.aktif.golongan,
            instansi: this.aktif.instansi,
            tempat: this.aktif.tempat
          }
          let reader = new FileReader()
          reader.addEventListener('load', () => {
            data.logo = reader.result
            pdf.aktif(data)
          })
          reader.readAsDataURL(resp.data)
        })
      }
    },
    computed: {
      ...mapGetters({
        detailUser: 'getDetailUser'
      })
    },
    mounted () {
      this.reallyInit()
    }
  }
</script>
