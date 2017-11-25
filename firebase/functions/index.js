const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

exports.onCreateCuti = functions.database
.ref('/cuti/{pushId}')
.onCreate(event => {
  console.log('add notification write cuti')
  let post = event.data.val()
  let newPostKey = admin.database().ref().child('/notifications').push().key;
  return admin.database().ref('/notifications/' + newPostKey).set({
    by: post.uid,
    cutiId: event.data.key,
    type: 'write cuti',
    from: 'user'
  })
})

exports.onUpdateCuti = functions.database
.ref('/transaksi_cuti/{pushId}/status')
.onUpdate(event => {
  console.log('update notification cuti')
  let uid = event.auth.variable.user_id
  admin.database().ref('/users/' + uid).on('value', snap => {
    let post = event.data.val()
    let posts = {
      by: uid,
      cutiId: event.params.pushId,
      type: 'update cuti'
    }
    let user = snap.val()
    if (user.role == 2) {
      posts.from = 'user'
    } else if (user.role == 3) {
      posts.from = 'baak'
    }
    let newPostKey = admin.database().ref().child('/notifications').push().key;
    return admin.database().ref('/notifications/' + newPostKey).set(posts)
  })
})

exports.onCreateAktif = functions.database
.ref('/aktif/{pushId}')
.onCreate(event => {
  console.log('add notification write aktif')
  let post = event.data.val()
  let newPostKey = admin.database().ref().child('/notifications').push().key;
  return admin.database().ref('/notifications/' + newPostKey).set({
    by: post.uid,
    cutiId: event.data.key,
    type: 'write aktif',
    from: 'user'
  })
})

exports.onUpdateAktif = functions.database
.ref('/transaksi_aktif/{pushId}/status')
.onUpdate(event => {
  console.log('update notification aktif')
  let uid = event.auth.variable.user_id
  admin.database().ref('/users/' + uid).on('value', snap => {
    let post = event.data.val()
    let posts = {
      by: uid,
      cutiId: event.params.pushId,
      type: 'update aktif'
    }
    let user = snap.val()
    if (user.role == 2) {
      posts.from = 'user'
    } else if (user.role == 3) {
      posts.from = 'baak'
    }
    let newPostKey = admin.database().ref().child('/notifications').push().key;
    return admin.database().ref('/notifications/' + newPostKey).set(posts)
  })
})

