<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 md6 offset-md3>
        <v-card>
          <v-card-title>
            <v-toolbar flat>
              <v-toolbar-title>Reserve Your Dates</v-toolbar-title>
            </v-toolbar>
          </v-card-title>
          <v-card-text>
            <v-layout row>
              <v-flex xs12 sm6>
                <v-menu
                  v-model="checkinMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="checkin"
                      label="Check In Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="checkin"
                    @input="checkinMenu = false"
                    :allowed-dates="checkinDates"
                  ></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 sm6>
                <v-menu
                  v-model="checkoutMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="checkout"
                      label="Check Out Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="checkout"
                    @input="checkoutMenu = false; checkDates()"
                    :allowed-dates="checkoutDates"
                  ></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12>
                <v-select
                  :disabled="!checkin || !checkout"
                  :items="roomtypes"
                  label="Room Type"
                  item-text="name"
                  v-model="roomtype"
                  return-object
                >
                  <template v-slot:item="{item}">
                    <span class="pr-5">{{item.name}}</span>
                    <v-spacer></v-spacer>
                    <v-chip outlined>Rs. {{item.price}} / {{item.rooms.length}} Available</v-chip>
                  </template>
                </v-select>
              </v-flex>
              <v-flex xs12 pa-5>
                <v-layout row justify-center>
                  <v-btn
                    :disabled="!checkin || !checkout || !roomtype || roomtype.rooms.length==0"
                    color="primary"
                    @click="showDialog()"
                  >Check Out</v-btn>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions></v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="400">
        <v-card>
          <v-card-title class="headline">Guest Information</v-card-title>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field v-model="guest.firstName" label="First Name"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="guest.lastName" label="Last Name"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="guest.identity" label="Identity"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="guest.mobile" label="Mobile"></v-text-field>
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
    guest: {
      firstName: '',
      lastName: '',
      identity: '',
      mobile: ''
    },
    checkinMenu: false,
    checkin: '',
    checkoutMenu: false,
    checkout: '',
    dialog: false,
    dates: ['', ''],
    roomtype: null,
    roomtypes: []
  }),
  created: function() {
    var a = new Date();
    var b = new Date();
    b.setDate(b.getDate() + 1);
    // console.log(a.getTime());
    // console.log(b.getTime());
    a = a.toISOString().slice(0, 10);
    b = b.toISOString().slice(0, 10);
    this.checkin = a;
    this.checkout = b;
    this.checkDates();
  },
  methods: {
    showDialog: function() {
      this.dialog = true;
    },
    saveDialog: function() {
      var chin = new Date(this.checkin).getTime();
      var chout = new Date(this.checkout).getTime();
      var roomid = this.roomtype.rooms[0].id;
      if (true) {
        this.$axios.post('/api/guest', this.guest).then(data1 => {
          this.$axios
            .post('/api/reservation', {
              guest: data1.data.id,
              checkIn: chin,
              checkOut: chout,
              room: roomid
            })
            .then(data2 => {
              // console.log(data);
              this.closeDialog();
              this.checkDates();
              this.$notify({
                type: 'success',
                title: 'Successfully Reserved'
              });
            });
        });
      }
    },
    closeDialog: function() {
      this.dialog = false;
      this.roomtype = null;
      this.guest = {
        firstName: '',
        lastName: '',
        identity: '',
        mobile: ''
      };
    },
    checkDates: function() {
      var chin = new Date(this.checkin).getTime();
      var chout = new Date(this.checkout).getTime();
      this.$axios
        .get(`/api/reservation/available/${chin}/${chout}`)
        .then(data => {
          // console.log(data.data);
          this.roomtypes = data.data;
          // this.items = data.data;
        });
    },
    checkinDates: function(v) {
      this.checkout = '';
      var d = new Date(v);
      var today = new Date();
      today.setDate(today.getDate() - 1);
      return d >= today;
    },
    checkoutDates: function(v) {
      var din = new Date(this.checkin);
      var dout = new Date(v);
      return dout > din;
    }
  }
};
</script>

<style>
</style>