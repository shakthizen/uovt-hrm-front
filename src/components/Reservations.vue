<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <v-toolbar flat>
              <v-toolbar-title>Reservations</v-toolbar-title>

            </v-toolbar>
          </v-card-title>
          <v-card-text>
            <v-layout row>
              <v-flex xs12 px-5>
                <v-text-field name="search" label="Search" v-model="search"></v-text-field>
              </v-flex>
            </v-layout>
            <v-data-table
              :headers="headers"
              :items="items"
              :items-per-page="10"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.name="{ item }">
                <v-badge color="blue" dark>
                  <template v-slot:badge>{{item.rooms.length}}</template>
                  <span>{{item.name}}</span>
                </v-badge>
              </template>
              <template
                v-slot:item.guestName="{ item }"
              >{{ item.guest.firstName + ' ' + item.guest.lastName }}</template>
              <template
                v-slot:item.total="{ item }"
              >{{ (new Date(item.checkOut).getTime()-new Date(item.checkIn).getTime())/1000/60/60/24*item.room.roomType.price}}</template>
              <template v-slot:item.actions="{ item }">
                <v-btn text icon color="red" @click.stop="deleteItem(item)">
                  <v-icon>mdi-trash-can</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-actions></v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    search: '',
    headers: [
      { text: 'Room', value: 'room.id' },
      { text: 'Room Type', value: 'room.roomType.name' },
      {
        text: 'Check In',
        value: 'checkIn'
        // filterable: true,
        // filter: function(value, search, item) {
        //   var v = new Date(value).toISOString().slice(0, 10);
        //   console.log({ v, search, item });
        //   return v.includes(search, 0);
        // }
      },
      { text: 'Check Out', value: 'checkOut' },
      { text: 'Guest', value: 'guestName' },
      { text: 'Guest ID', value: 'guest.identity' },
      { text: 'Total', value: 'total' },
      { text: 'Actions', value: 'actions', align: 'center' }
    ],
    items: []
  }),
  created: function() {
    this.getData();
  },
  methods: {
    deleteItem: function(item) {
      if (true) {
        if (confirm('Confirm Delete ?')) {
          this.$axios.delete(`/api/reservation/${item.id}`).then(data => {
            // console.log(data);
            this.getData();
          });
        }
      }
    },
    getData: function() {
      this.$axios.get('/api/reservation').then(data => {
        var ress = data.data;
        for (var i = 0; i < ress.length; i++) {
          ress[i].checkIn = new Date(ress[i].checkIn)
            .toISOString()
            .slice(0, 10);
          ress[i].checkOut = new Date(ress[i].checkOut)
            .toISOString()
            .slice(0, 10);
        }
        this.$axios.get('/api/roomtype?populate=false').then(data2 => {
          var rt = data2.data;
          for (var i = 0; i < ress.length; i++) {
            for (var j = 0; j < rt.length; j++) {
              if (ress[i].room.roomType == rt[j].id) {
                ress[i].room.roomType = rt[j];
              }
            }
          }
          this.items = ress;
          console.log(ress);
        });
      });
    }
  }
};
</script>

<style>
</style>