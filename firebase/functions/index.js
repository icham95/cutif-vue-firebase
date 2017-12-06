const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

exports.hello = functions.https.onRequest((req, resp) => {
    resp.json({
        'query': req.query,
        'body': req.body
    })
})

exports.createUser = functions.https.onRequest((req, resp) => {
    if (req.method == 'POST') {
        let token = req.body.token
        let npm = req.body.npm
        let password = req.body.password
        admin.auth().verifyIdToken(token)
        .then(decodeToken => {
            admin.auth().createUser({
                email: npm + '@user.user',
                password: password
            }).then(user => {
                resp.json({
                    succes: true,
                    user: user
                })
            }).catch(err => {
                resp.json({
                    succes: false,
                    err: err
                })
            })
        }).catch(err => {
            resp.json({
                succes: false,
                err: err
            })
        })
    } else {
        resp.json({
            succes: false,
            err: 'request method/verb harus post, sekian terima kasih.'
        })
    }
})

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

