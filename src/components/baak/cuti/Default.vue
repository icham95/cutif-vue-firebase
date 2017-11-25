<template>
  <v-layout>
    <v-tabs fixed centered>
      <v-tabs-bar class="cyan" dark>
        <v-tabs-slider class="yellow"></v-tabs-slider>
        <v-tabs-item
          v-for="(item, index) in itemss"
          :key="index"
          :to="'/baak/cuti/' + item.push"
        >
          {{ item.name }}
        </v-tabs-item>
      </v-tabs-bar>
      <v-tabs-items>
        <router-view></router-view>
      </v-tabs-items>
    </v-tabs>
  </v-layout>
</template>

<script>
  export default {
    data () {
      return {
        items: ['First Confirmation', 'rejected', 'Payment', 'Second Confirmation', 'Actived'],
        itemss: [
          {
            name: 'First Confirmation',
            push: 'first-confirmation'
          },
          {
            name: 'Rejected',
            push: 'rejected'
          },
          {
            name: 'payment',
            push: 'payment'
          },
          {
            name: 'second confirmation',
            push: 'second-confirmation'
          },
          {
            name: 'actived',
            push: 'actived'
          }
        ]
      }
    }
  }
</script>

