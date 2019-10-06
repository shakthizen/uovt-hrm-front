<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <v-toolbar flat>
              <v-toolbar-title>Room Types</v-toolbar-title>

              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn text large @click.stop="showDialog(null)">
                  Add
                  <v-icon right>mdi-plus</v-icon>
                </v-btn>
              </v-toolbar-items>
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
              <template v-slot:item.ac="{ item }">
                <v-chip :color="item.ac?'green':'red'" dark>{{ item.ac?'Yes':'No' }}</v-chip>
              </template>
              <template v-slot:item.wifi="{ item }">
                <v-chip :color="item.wifi?'green':'red'" dark>{{ item.wifi?'Yes':'No' }}</v-chip>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn text icon color="blue" @click.stop="showDialog(item)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
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
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="400">
        <v-card>
          <v-card-title class="headline">{{!current.id?'New':'Update'}}</v-card-title>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field v-model="current.name" label="Name"></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model.number="current.singleBed" label="Single Beds"></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model.number="current.doubleBed" label="Double Beds"></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model.number="current.queenBed" label="Queen Beds"></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model.number="current.kingBed" label="King Beds"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model.number="current.price" label="Price" prefix="Rs."></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-switch v-model="current.ac" label="AC"></v-switch>
              </v-flex>
              <v-flex xs6>
                <v-switch v-model="current.wifi" label="WiFi"></v-switch>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click.native="saveDialog()">Save</v-btn>
            <v-btn text @click.native="closeDialog()">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    current: {
      name: '',
      capacity: 0,
      singleBed: 0,
      doubleBed: 0,
      kingBed: 0,
      queenBed: 0,
      price: 0,
      ac: false,
      wifi: false
    },
    dialog: false,
    search: '',
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'Capacity', value: 'capacity' },
      { text: 'Single Beds', value: 'singleBed' },
      { text: 'Double Beds', value: 'doubleBed' },
      { text: 'King Beds', value: 'kingBed' },
      { text: 'Queen Beds', value: 'queenBed' },
      { text: 'AC', value: 'ac', align: 'center' },
      { text: 'WiFi', value: 'wifi', align: 'center' },
      { text: 'Price', value: 'price', align: 'right' },
      { text: 'Actions', value: 'actions', align: 'center' }
    ],
    items: []
  }),
  created: function() {
    this.getData();
  },
  methods: {
    showDialog: function(item) {
      if (item == null) {
        this.current = {
          name: '',
          singleBed: 0,
          doubleBed: 0,
          kingBed: 0,
          queenBed: 0,
          price: 0,
          ac: false,
          wifi: false
        };
      } else {
        this.current = item;
      }
      this.dialog = true;
    },
    saveDialog: function() {
      if (this.current.id == null) {
        this.$axios.post('/api/roomtype', this.current).then(data => {
          // console.log(data);
          this.getData();
          this.closeDialog();
        });
      } else {
        var cur = JSON.parse(JSON.stringify(this.current));
        delete cur.rooms;
        this.$axios
          .patch(`/api/roomtype/${this.current.id}`, cur)
          .then(data => {
            // console.log(data);
            this.getData();
            this.closeDialog();
          });
      }
    },
    deleteItem: function(item) {
      if (true) {
        if (confirm('Confirm Delete ?')) {
          this.$axios.delete(`/api/roomtype/${item.id}`).then(data => {
            // console.log(data);
            this.getData();
          });
        }
      }
    },
    closeDialog: function() {
      this.dialog = false;
      this.current = {
        name: '',
        singleBed: 0,
        doubleBed: 0,
        kingBed: 0,
        queenBed: 0,
        price: 0,
        ac: false,
        wifi: false
      };
    },
    getData: function() {
      this.$axios.get('/api/roomtype').then(data => {
        this.items = data.data;
      });
    }
  }
};
</script>

<style>
</style>