<template>
    <div id="menu" :validate="validate">
      <div v-if="ready">
        <Logoff v-if="logoff"></Logoff>

        <v-btn @click="go('/','home')" color="primary"
            class="deep-orange" dark>
          Home
        </v-btn>

        <!-- log- page -->
        <v-btn @click="logaction()" color="primary"
            class="deep-orange" dark>
            <i class="fas fa-user deep-icon"></i>
            {{loglabel()}}
        </v-btn>

        <!-- go to sector root -->
        <v-btn @click="go('/dashboard','home')" v-if="settings.current.page.url !== '/dashboard' && dash.logged" color="primary"
            class="deep-orange" dark>
          <i class="fas fa-home deep-icon"> </i> 
          Dashboard
        </v-btn>

        <!-- sector change -->
        <v-menu bottom origin="center center" transition="scale-transition" v-if="sysmenu()">
          <v-btn slot="activator" color="primary"
              class="deep-orange" dark>
            <i class="fas fa-bars deep-icon"></i>
            Dashboard
          </v-btn>
          <v-list class="blue" color="white">
            <v-list-tile
              v-for="(item, i) in items"
              :key="i"
              @click="go(item.url, item.sector)">
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>

      </div>
    </div>
</template>

<script>
  import Logoff from '../../api/logoff';
  import {mapState} from 'vuex';

  export default {
    data () {
      return {
        items: [
          {title:'Home', url: '/dashboard', sector: 'home'},
          {title:'List:', url: '/dashboard', sector: 'list'},
          {title:'New', url: '/dashboard', sector: 'new'},
          {title:'Settings', url: '/dashboard', sector: 'settings'},
        ],
        page: {},
        emit: {
          redirect: {url: '', sector: '', trigger: false},
        },
        ready: false,
        logoff: false,
        session: '',
        ci: null,
        pci: null,
      };
    },

    computed: {
      ...mapState({
        settings: state => state.settings,
        dash: state => state.dash,
      }),
      validate() {
        //get session
        this.session = window.$cookies.get('session');
        this.$store.commit('CheckSession', this.session);

        //get page info
        this.page = this.settings.current.page;

      }
    },
    
    components: {
      Logoff,
    },

    methods: { 
        sysmenu() {
          return this.dash.logged && this.settings.current.page.url === '/dashboard';
        },
        loglabel() {
          if (this.dash.logged) {
            return 'logout';
          }
          return 'login';
        },
        logaction() {
          if (this.dash.logged) {
            this.logoff = true;
          } else {
            this.go('/login','login');
          }
        },
        go(u,s) {
          //local triggering
          this.emit.redirect.url = u;
          this.emit.redirect.sector = s;
          this.emit.redirect.trigger = true;
        },
    },
    created() {
        //callback page
        this.ci = setInterval(()=> {
          
          if (this.settings.current.page.redirect.trigger) {
            this.emit.redirect.url = this.settings.current.page.redirect.url;
            this.emit.redirect.sector = this.settings.current.page.redirect.sector;
            this.emit.redirect.trigger = true;
            console.log('Redirect triggered');
            this.$store.commit('EMIT_REDIRECT', { trigger: false });
          }

          let url = false;
          //trigger redirection page cycle
          if (this.emit.redirect.trigger) {
            console.log('Menu::Triggered -> ',this.emit.redirect);
            if (this.emit.redirect.url !== this.page.url) {
              url = true;
            }
            this.$store.commit('SavePage', { url: this.emit.redirect.url, sector: this.emit.redirect.sector, clean: false });
            this.emit.redirect = {url: '', sector: '', trigger: false};
             if (url) {
              window.location.href = this.settings.current.page.url;
            }
            this.page = this.settings.current.page;
          }
        }, 1000);
        this.ready = true;
    }
  }
</script>

<style scoped>
    #menu {
        position: absolute;
        top: 20px;
        right: 5px;
        color: #001b1f;
        width: fit-content;
        height: fit-content;
        background-color: #ffffff;
        box-shadow: 1px 3px 3px 0px #aaaaaa;
    }
</style>
