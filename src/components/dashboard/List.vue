<template>    
<div id="content" :begin="begin" class="application--wrap">
      <div v-if="ready">
        <div id="list">
          <h3>
            {{head.title}}
            <div id="head-item-menu">
               <v-btn slot="activator" color="primary"
                        class="deep-orange" dark>
                      <i class="fas fa-plus-circle deep-icon" aria-hidden="true"></i>
                      Add Masternode 
              </v-btn>
               <v-btn slot="activator" color="primary"
                        class="deep-orange" dark>
                      <i class="fas fa-question-circle deep-icon" aria-hidden="true"></i>
                      Help
              </v-btn>
            </div>
          </h3> 
          <hr />
          <div id="list-body">
            <div id="list-item" v-for="item in masternodes" v-bind:key="item">
              <div id="list-item-info" class="head-list">
                <div id="list-item-v">
                  <div id="list-item-name">
                    ID:
                  </div>
                  <div id="list-item-value">
                    {{item.id}}
                  </div>
                </div>
                <div id="list-item-v">
                  <div id="list-item-name">
                    Coin:
                  </div>
                  <div id="list-item-value">
                    {{item.coin}} ( {{item.asset}} )
                  </div>
                </div>
                <div id="list-item-v">
                  <div id="list-item-name">
                    VPS IP Address:
                  </div>
                  <div id="list-item-value">
                    <a :href="item.ip" target="_blank">{{item.ip}}</a>
                  </div>
                </div>

                <!-- Keys -->
                <div id="list-item-v" v-for="(ik,i) in item.keys" :key="i">
                  <div id="list-item-name">
                    {{ ik.name }}
                  </div>
                  <div id="list-item-value">
                    {{ ik.value }}
                  </div>
                </div>
                
                <div id="list-item-v">
                  <div id="list-item-name">
                    Status:
                  </div>
                  <div id="list-item-value" :class="statusClass(item.status)">
                    <i :class="statusClassIcon(item.status)"> </i>
                    {{ item.status }}
                  </div>
                </div>

                <!-- item menu -->
                <div id="list-item-v">
                  <div id="list-item-name">
                  <v-menu bottom origin="center center" transition="scale-transition">
                    <v-btn slot="activator" color="primary"
                        class="deep-orange" dark>
                      <i class="fas fa-bars"></i>  
                    </v-btn>
                    <v-list class="blue" color="white">
                      <v-list-tile
                        v-for="(x,i) in menuItems"
                        :key="i"
                        @click="go(x.sector)">
                        <v-list-tile-title><i :class="x.icon" :style="x.style"></i> {{ x.title }}</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                  </div>
                </div>

              </div>
              <hr />
            </div>
            <center>
              You can find more about each coin in their respective websites.
            </center>
          </div>
        </div>
      </div>
    </div>
</template>

<script>

  import {mapState} from 'vuex'

  export default {
    data () {
      return {
        head: {},
        menuItems: [
          {title:'Log', url: '/dashboard', sector: 'home', icon: 'fas fa-exclamation-triangle', style: "color: white;"},
          {title:'Setup', url: '/dashboard', sector: 'setup', icon: 'fas fa-cog', style: "color: white;"},
          {title:'Remove', url: '/dashboard', sector: 'home', icon: 'fas fa-times', style: "color: white;"},
        ],
        masternodes: [
          {
            id:0, coin: 'ZCore', asset: 'ZCR', ip: '127.0.0.1', 
            status: 'Enabled',
            keys: [
              {name: 'Masterode Genkey', value: 'Z.....'},
              {name: 'Collateral Tx', value: '0000.....'},
            ],
            report: [
              {date: '12/09/2018', action: 'ENABLED'},
              {date: '12/09/2018 11:12:13', action: 'NEW_START_REQUIRED'},
              {date: '12/09/2018 11:13:13', action: 'ENABLED'},
            ],
          },
          {
            id:1, coin: 'SmartCash', asset: 'SMC', ip: '127.0.0.2', 
            status: 'Disabled', 
            keys: [
              {name: 'Masterode Genkey', value: 'Z.....'},
              {name: 'Collateral Tx', value: '0000.....'},
            ],
            report: [
              {date: '12/09/2018', action: 'ENABLED'},
            ],
          },
        ],
        ready: false,
      };
    },

    computed: {
      ...mapState({
        settings: state => state.settings,
      }),
      begin() {
        this.head = this.settings.current.page.head;
        this.ready = true;
      },
    },

    methods: {
      statusClass(s) {
        if (s.toLowerCase() === 'enabled') {
          return 'deep-tag ok-tag';
        }
        return 'deep-tag nok-tag'; 
      },
      statusClassIcon(s) {
        if (s.toLowerCase() === 'enabled') {
          return 'fas fa-check-circle';
        }
        return 'fas fa-exclamation-triangle'; 
      },
      go(s) {
        this.$store.commit('EMIT_REDIRECT', { url: this.settings.current.page.url, sector: s });
      },
    },
  }
</script>

<style scoped>

#content {
  background-color: #eeecec;
  padding: 80px;
  left: 0;
  color: rgb(0, 0, 0);
}

#list {
  background-color: rgb(248, 248, 248);
  position: relative;
  line-height: 1.6em;
  text-align: left;
  margin: 10px;
  border: 1px outset #aaaaaa;
  box-shadow: 1px 1px 1px 1px #aaaaaa;
}


#list h3 {
  padding: 30px;
  text-align: left;
  font-size: 30px;
}

#list-item-info {
  font-size: 16px;
  position: relative;
  padding: 10px;
  margin-top: 1px;
}

#list-item-v {
  position: relative;
  margin: 10px;
}

#list-item-name {
  display: inline;
  left: 35px;
}

#list-item-value {
  position: absolute;
  display: inline;
  right: 35px;
}

#head-item-menu {
  position: absolute;
  display: inline;
  top: 15px;
  right: 35px;
}


.head-list {
  color: black;
  border: 1px outset #aaaaaa;
  box-shadow: 1px 1px 1px 1px #aaaaaa;
}

.body-list {
  color: black;
  border: 1px outset #aaaaaa;
  box-shadow: 1px 1px 1px 1px #aaaaaa;
}

.deep-tag {
  color: white;
  padding: 5px;
  margin: 5px;
  box-shadow: 1px 1px 1px 1px #aaaaaa;
}
.ok-tag {
  background-color: rgb(78, 198, 78);
}
.nok-tag {
  background-color: rgb(198, 98, 78);
}
</style>
