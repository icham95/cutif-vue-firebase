import Vue from 'vue'
import Router from 'vue-router'
// import PublicDefault from '@/components/public/Default'
import Login from '@/components/login/Login'
import AdminDefault from '@/components/admin/Default'
import AdminDashboard from '@/components/admin/Dashboard'
import AdminUsers from '@/components/admin/Users'
import AdminProgramStudi from '@/components/admin/ProgramStudi'
import AdminRekening from '@/components/admin/Rekening'
import UserDefault from '@/components/user/Default'
import UserDashboard from '@/components/user/Dashboard'
import UserCutiDefault from '@/components/user/cuti/CutiDefault'
import UserCutiAll from '@/components/user/cuti/Cuti'
import UserCutiSingle from '@/components/user/cuti/CutiSingle'
import UserAktifDefault from '@/components/user/aktif/AktifDefault'
import UserAktifAll from '@/components/user/aktif/Aktif'
import UserAktifSingle from '@/components/user/aktif/AktifSingle'
import UserProfile from '@/components/user/Profile'
// baak
import BaakDefault from '@/components/baak/Default'
import BaakDashboard from '@/components/baak/Dashboard'
import BaakProfile from '@/components/baak/Profile'
// baak cuti
import BaakCutiDefault from '@/components/baak/cuti/Default'
import BaakCutiFirstConfirmation from '@/components/baak/cuti/FirstConfirmation'
import BaakCutiRejected from '@/components/baak/cuti/Rejected'
import BaakCutiPayment from '@/components/baak/cuti/Payment'
import BaakCutiSecondConfirmation from '@/components/baak/cuti/SecondConfirmation'
import BaakCutiActived from '@/components/baak/cuti/Actived'
import BaakDcuti from '@/components/baak/cuti/Detail'
// baak aktif
import BaakAktifDefault from '@/components/baak/aktif/Default'
import BaakAktifFirstConfirmation from '@/components/baak/aktif/FirstConfirmation'
import BaakAktifRejected from '@/components/baak/aktif/Rejected'
import BaakAktifPayment from '@/components/baak/aktif/Payment'
import BaakAktifSecondConfirmation from '@/components/baak/aktif/SecondConfirmation'
import BaakAktifActived from '@/components/baak/aktif/Actived'
import BaakDaktif from '@/components/baak/aktif/Detail'
import BaakNotifications from '@/components/baak/Notifications'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/baak',
      name: 'BaakDefault',
      component: BaakDefault,
      children: [
        {
          path: 'dashboard',
          name: 'BaakDashboard',
          component: BaakDashboard
        },
        {
          path: 'notifications',
          name: 'BaakNotifications',
          component: BaakNotifications
        },
        {
          path: 'profile',
          name: 'BaakProfile',
          component: BaakProfile
        },
        {
          path: 'daktif/:idAktif/:idTransaksi/:idUser',
          name: 'BaakDaktif',
          component: BaakDaktif
        },
        {
          path: 'aktif',
          name: 'BaakAktifDefault',
          component: BaakAktifDefault,
          children: [
            {
              path: 'first-confirmation',
              name: 'BaakAktifFirstConfirmation',
              component: BaakAktifFirstConfirmation
            },
            {
              path: 'rejected',
              name: 'BaakAktifRejected',
              component: BaakAktifRejected
            },
            {
              path: 'payment',
              name: 'BaakAktifPayment',
              component: BaakAktifPayment
            },
            {
              path: 'second-confirmation',
              name: 'BaakAktifSecondConfirmation',
              component: BaakAktifSecondConfirmation
            },
            {
              path: 'actived',
              name: 'BaakAktifActived',
              component: BaakAktifActived
            }
          ]
        },
        {
          path: 'dcuti/:idCuti/:idTransaksi/:idUser',
          name: 'BaakDcuti',
          component: BaakDcuti
        },
        {
          path: 'cuti',
          name: 'BaakCutiDefault',
          component: BaakCutiDefault,
          children: [
            {
              path: 'first-confirmation',
              name: 'BaakCutiFirstConfirmation',
              component: BaakCutiFirstConfirmation
            },
            {
              path: 'rejected',
              name: 'BaakCutiRejected',
              component: BaakCutiRejected
            },
            {
              path: 'payment',
              name: 'BaakCutiPayment',
              component: BaakCutiPayment
            },
            {
              path: 'second-confirmation',
              name: 'BaakCutiSecondConfirmation',
              component: BaakCutiSecondConfirmation
            },
            {
              path: 'actived',
              name: 'BaakCutiActived',
              component: BaakCutiActived
            }
          ]
        }
      ]
    },
    {
      path: '/admin',
      name: 'AdminDefault',
      component: AdminDefault,
      children: [
        {
          path: 'dashboard',
          name: 'AdminDashboard',
          component: AdminDashboard
        },
        {
          path: 'users',
          name: 'AdminUsers',
          component: AdminUsers
        },
        {
          path: 'program-studi',
          name: 'AdminProgramStudi',
          component: AdminProgramStudi
        },
        {
          path: 'rekening',
          name: 'AdminRekening',
          component: AdminRekening
        }
      ]
    },
    {
      path: '/user',
      name: 'UserDefault',
      component: UserDefault,
      children: [
        {
          path: 'dashboard',
          name: 'UserDashboard',
          component: UserDashboard
        },
        {
          path: 'profile',
          name: 'UserProfile',
          component: UserProfile
        },
        {
          path: 'cuti',
          name: 'UserCutiDefault',
          component: UserCutiDefault,
          children: [
            {
              path: 'all',
              name: 'UserCutiAll',
              component: UserCutiAll
            },
            {
              path: ':idCuti/:idTransaksi',
              name: 'UserCutiSingle',
              component: UserCutiSingle
            }
          ]
        },
        {
          path: 'aktif',
          name: 'UserAktifDefault',
          component: UserAktifDefault,
          children: [
            {
              path: 'all',
              name: 'UserAktifAll',
              component: UserAktifAll
            },
            {
              path: ':idAktif/:idTransaksi',
              name: 'UserAktifSingle',
              component: UserAktifSingle
            }
          ]
        }
      ]
    }
  ]
})
