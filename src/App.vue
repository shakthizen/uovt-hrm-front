<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-items>
        <v-btn text href="/" active-class>
          <v-toolbar-title class="headline text-uppercase">
            <span class="font-weight-bold">ViVid</span>
            <span class="font-weight-light">HOTELS</span>
          </v-toolbar-title>
        </v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn
          text
          v-for="(item,i) in filteredMenu"
          :key="i"
          :to="item.route"
          :color="item.color"
        >{{item.text}}</v-btn>
        <!-- <v-btn v-if="$store.state.logged" text>{{$store.state.user.name}}</v-btn> -->
      </v-toolbar-items>
    </v-app-bar>

    <v-content>
      <notifications position="bottom right" />
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    menu: [
      {
        condition: true,
        text: 'Reserve',
        route: '/',
        color: 'blue'
      },
      {
        condition: false,
        text: 'Reserve',
        route: '/',
        color: 'blue'
      },
      {
        condition: true,
        text: 'Reservations',
        route: '/reservations'
      },
      {
        condition: true,
        text: 'Rooms',
        route: '/rooms'
      },
      {
        condition: true,
        text: 'Room Types',
        route: '/roomtypes'
      },
      // {
      //   condition: true,
      //   text: 'Guests',
      //   route: '/guests'
      // },
      //-------------------
      // {
      //   condition: true,
      //   text: 'Logout',
      //   route: '/logout'
      // },
      // {
      //   condition: false,
      //   text: 'Login',
      //   route: '/login'
      // },
      // {
      //   condition: false,
      //   text: 'Sign Up',
      //   route: '/signup'
      // }
    ]
  }),

  computed: {
    filteredMenu() {
      return this.menu.filter(item => {
        return this.$store.state.logged == item.condition;
      });
    }
  }
};
</script>
