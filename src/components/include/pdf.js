import JSPDF from 'jspdf'

let pdf = {}

pdf.cuti = function (data) {
  let doc = new JSPDF()
  doc.addImage(data.logo, 'PNG', 10, 10, 30, 20)
  doc.setFontSize(14)
  doc.text(105, 10, 'SEKOLAH TINGGI ILMU KOMPUTER (STIKOM) BINANIAGA', null, null, 'center')
  doc.setFontSize(10)
  doc.text(105, 15, 'Program Studi : S1 Sistem Informasi dan S1 Tehnik Informatika', null, null, 'center')
  doc.text(105, 20, 'Status "Terakreditasi"', null, null, 'center')
  doc.text(105, 25, 'Kampus : Jl. Mayor Oking Jayaatmaja No. 27 BOGOR', null, null, 'center')
  doc.text(105, 30, 'Telepon (0251) 8343980', null, null, 'center')
  doc.text(105, 35, 'Email : info@stikombinaniaga.ac.id', null, null, 'center')
  doc.setLineWidth(1.5)
  doc.line(200, 38, 10, 38)
  doc.setFontSize(16)
  doc.text(105, 50, 'FORMULIR PERMOHONAN CUTI AKADEMIK', null, null, 'center')
  // new line
  doc.setFontSize(12)
  doc.text(10, 65, 'Dengan ini saya, :')
  // new line
  doc.text(10, 75, 'Nama Mahasiswa')
  doc.text(80, 75, ':')
  doc.text(90, 75, data.fullname)
  // new line
  doc.text(10, 85, 'NPM')
  doc.text(80, 85, ':')
  doc.text(90, 85, data.npm)
  // new line
  doc.text(10, 95, 'Program Studi')
  doc.text(80, 95, ':')
  doc.text(90, 95, data.programStudi)
  // new line
  doc.text(10, 105, 'Semester/Tahun Akademik')
  doc.text(80, 105, ':')
  doc.text(90, 105, data.mahasiswaTahunAkademik.toString())
  // new line
  doc.text(10, 115, 'Alamat Rumah')
  doc.text(80, 115, ':')
  doc.text(90, 115, data.alamat)
  // new line
  doc.text(10, 125, 'Telepon/Hp')
  doc.text(80, 125, ':')
  doc.text(90, 125, data.noHp)
  // new line
  doc.text(10, 135, 'Jumlah semester yang telah diselesaikan')
  doc.text(100, 135, ':')
  doc.text(110, 135, data.jumlahSemester)
  // new line
  doc.text(10, 145, 'Jumlah SKS yang telah diperoleh')
  doc.text(100, 145, ':')
  doc.text(110, 145, data.jumlahSks)
  // new line
  doc.text(10, 155, 'IPK yang telah diperoleh')
  doc.text(100, 155, ':')
  doc.text(110, 155, data.ipk)
  // new line
  doc.text(10, 165, 'Mengajukan permohonan cuti akademik pada semester')
  doc.text(120, 165, data.semester + ' / ')
  doc.text(130, 165, 'Tahun Akademik')
  doc.text(165, 165, '2017')
  // new line
  doc.text(10, 175, 'Dikarenakan : ')
  doc.text(40, 175, data.alasan)
  // new line
  doc.text(10, 190, 'Demikian permohonan ini saya buat dengan sebenarnya.')
  doc.text(10, 200, 'Mengetahui,')
  // new line
  let today = new Date()
  let dd = today.getDate()
  let mm = today.getMonth() + 1
  let yyyy = today.getFullYear()
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }
  // let now = dd + '/' + mm + '/' + yyyy
  doc.text(120, 200, data.tempat + ', ')
  doc.text(140, 200, dd.toString())
  doc.text(150, 200, '/')
  doc.text(155, 200, this.convertBulan(mm))
  doc.text(175, 200, '/')
  doc.text(180, 200, yyyy.toString())
  // asd
  doc.text(10, 210, 'Wakil Ketua Bidang Akademik,')
  doc.text(10, 240, '.................................................')
  // asd
  doc.text(140, 210, 'Dosen Wali,')
  doc.text(140, 240, '.................................................')
  // asd
  doc.text(88, 250, 'Menyutujui,')
  doc.text(88, 260, 'Ka. BAAK')
  doc.text(70, 290, '.................................................')
  // end
  doc.save(data.npm + '-formulir-surat-permohonan-cuti-akademik.pdf')
}

pdf.aktif = function (data) {
  let doc = new JSPDF()
  doc.addImage(data.logo, 'PNG', 10, 10, 30, 20)
  doc.setFontSize(14)
  doc.text(105, 10, 'SEKOLAH TINGGI ILMU KOMPUTER (STIKOM) BINANIAGA', null, null, 'center')
  doc.setFontSize(10)
  doc.text(105, 15, 'Program Studi : S1 Sistem Informasi dan S1 Tehnik Informatika', null, null, 'center')
  doc.text(105, 20, 'Status "Terakreditasi"', null, null, 'center')
  doc.text(105, 25, 'Kampus : Jl. Mayor Oking Jayaatmaja No. 27 BOGOR', null, null, 'center')
  doc.text(105, 30, 'Telepon (0251) 8343980', null, null, 'center')
  doc.text(105, 35, 'Email : info@stikombinaniaga.ac.id', null, null, 'center')
  doc.setLineWidth(1.5)
  doc.line(200, 38, 10, 38)
  doc.setFontSize(16)
  doc.text(105, 50, 'FORMULIR SURAT KETERANGAN AKTIF KULIAH', null, null, 'center')
  // new line
  doc.setFontSize(12)
  doc.text(10, 65, 'Nama Mahasiswa')
  doc.text(80, 65, ':')
  doc.text(90, 65, data.fullname)
  // new line
  doc.text(10, 75, 'NPM')
  doc.text(80, 75, ':')
  doc.text(90, 75, data.npm)
  // new line
  // doc.text(10, 85, 'Semester')
  // doc.text(80, 85, ':')
  // doc.text(90, 85, data.c_semester)
  // new line
  doc.text(10, 85, 'Program Studi')
  doc.text(80, 85, ':')
  doc.text(90, 85, data.programStudi)
  // new line
  doc.text(10, 95, 'Tahun Akademik')
  doc.text(80, 95, ':')
  doc.text(90, 95, data.mahasiswaTahunAkademik.toString())
  // new line
  doc.text(10, 105, 'Nama Orang Tua / wali')
  doc.text(80, 105, ':')
  doc.text(90, 105, data.namaOrangTua)
  // new line
  doc.text(10, 115, 'NIP/NRP')
  doc.text(80, 115, ':')
  doc.text(90, 115, data.nip + '/' + data.nrp)
  // new line
  doc.text(10, 125, 'Pangkat')
  doc.text(80, 125, ':')
  doc.text(90, 125, data.pangkat)
  // new line
  doc.text(10, 135, 'Golongan')
  doc.text(80, 135, ':')
  doc.text(90, 135, data.golongan)
  // new line
  doc.text(10, 145, 'Instansi')
  doc.text(80, 145, ':')
  doc.text(90, 145, data.instansi)
  // new line
  doc.text(120, 180, data.tempat + ', ')
  let today = new Date()
  let dd = today.getDate()
  let mm = today.getMonth() + 1
  let yyyy = today.getFullYear()
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }
  doc.text(140, 180, dd.toString())
  doc.text(150, 180, '/')
  doc.text(155, 180, this.convertBulan(mm))
  doc.text(175, 180, '/')
  doc.text(180, 180, yyyy.toString())
  doc.text(120, 190, 'Pemohon,')
  doc.text(120, 230, data.fullname)
  // end
  doc.save(data.npm + '-formulir-surat-keterangan-aktif-kuliah.pdf')
}

pdf.convertBulan = function (bulan) {
  bulan = bulan.toString()
  if (bulan === '01') {
    return 'januari'
  }
  if (bulan === '02') {
    return 'februari'
  }
  if (bulan === '03') {
    return 'maret'
  }
  if (bulan === '04') {
    return 'april'
  }
  if (bulan === '05') {
    return 'mei'
  }
  if (bulan === '06') {
    return 'juni'
  }
  if (bulan === '07') {
    return 'juli'
  }
  if (bulan === '08') {
    return 'agustus'
  }
  if (bulan === '09') {
    return 'september'
  }
  if (bulan === '10') {
    return 'oktober'
  }
  if (bulan === '11') {
    return 'november'
  }
  if (bulan === '12') {
    return 'desember'
  }
}

export default pdf
