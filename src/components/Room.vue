<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <v-toolbar flat>
              <v-toolbar-title>Rooms</v-toolbar-title>

              <v-spacer></v-spacer>
            </v-toolbar>
          </v-card-title>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 v-for="(item,i) in items" :key="i" ma-4>
                <v-card>
                  <v-card-title>
                    <v-toolbar flat>
                      <v-toolbar-title>{{item.name}}</v-toolbar-title>

                      <v-spacer></v-spacer>
                      <v-toolbar-items>
                        <v-btn text large @click.stop="addItem(item.id)">
                          Add
                          <v-icon right>mdi-plus</v-icon>
                        </v-btn>
                      </v-toolbar-items>
                    </v-toolbar>
                  </v-card-title>
                  <v-card-text>
                    <v-layout row wrap justify-center>
                      <v-card
                        width="150px"
                        v-for="(room,j) in item.rooms"
                        :key="j"
                        class="ma-4"
                        hover
                        :class="room.occupied?'red' : ''"
                        :dark="room.occupied"
                      >
                        <v-card-text>
                          <h2>{{room.id}}</h2>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn icon color="red" @click.stop="deleteItem(room.id)">
                            <v-icon :color="room.occupied?'white' : ''">mdi-trash-can</v-icon>
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-card-text>
            <v-alert type="success" :value="true">
              Rooms available today are in white and occupied rooms are in Red
            </v-alert>
          <v-card-actions></v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    search: '',
    items: []
  }),
  created: function() {
    this.getData();
  },
  methods: {
    addItem: function(roomType) {
      this.$axios.post('/api/room', { roomType }).then(data => {
        // console.log(data);
        this.getData();
      });
    },
    deleteItem: function(id) {
      if (true) {
        if (confirm('Confirm Delete ?')) {
          this.$axios.delete(`/api/room/${id}`).then(data => {
            // console.log(data);
            this.getData();
          });
        }
      }
    },
    getData: function() {
      var chdate = new Date().getTime();
      this.$axios.get('/api/roomtype').then(allData => {
        var all = allData.data;
        this.$axios
          .get(`/api/reservation/occupied/${chdate}`)
          .then(occupiedData => {
            var occupied = occupiedData.data;
            // console.log(occupied);
            // this.items = data.data;
            for (var i = 0; i < all.length; i++) {
              var currentType = all[i];
              for (var j = 0; j < currentType.rooms.length; j++) {
                var test = false;
                for (var k = 0; k < occupied.length; k++) {
                  // console.log(currentType.rooms[j].id);
                  if (currentType.rooms[j].id == occupied[k]) {
                    test = true;
                  }
                }
                currentType.rooms[j].occupied = test;
                // console.log(currentType.rooms[j]);
              }
            }
            this.items = all;
          });
      });
    }
  }
};
</script>

<style>
</style>