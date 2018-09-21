<template>
  <div id="fit">
    <Logo> </Logo>
    <Menu> </Menu>
    <Loading v-if="!ready"> </Loading>
    <div v-if="ready">
      <!-- sector -->
      <List v-if="info.sector === 'list'"> </List>
      <New v-if="info.sector === 'new'"> </New>
      <Settings v-if="info.sector === 'settings'"> </Settings>
      <Setup v-if="info.sector === 'setup'"> </Setup>
      <!-- root sector -->
      <div v-if="info.sector === info.root">
        <div id="content">
          <h1>{{info.head.title}}</h1>
          <p>
              Hello! You are logged.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  //models
  import Logo from '../model/logo/logo';
  import Menu from '../model/menu/home';
  import Loading from '../model/Loading';

  //sectors
  import List from './List';
  import New from './New';
  import Settings from './Settings';
  import Setup from './Setup';

  import {mapState} from 'vuex';

  export default {
    data () {
      return {
        info: {
          url: '/dashboard',
          root: 'home',
          sector: 'home',
          head: {sector: 'home'},
        },
        session: '',
        session_interval: 1,
        ready: false,
        watcher: [],
      };
    },
    components: {
      Logo,
      Menu,
      List,
      New,
      Settings,
      Setup,
      Loading,
    },
    computed: {
      ...mapState({
        settings: state => state.settings,
        dash: state => state.dash,
      }),
    },

    methods: {
      validSession() {
        this.session = window.$cookies.get('session');
        this.$store.commit('CheckSession', this.session);
        return this.dash.logged;
      },
      updateSector() {
        this.info.head = this.settings.current.page.head;
      },
      closeSession(u,s) {
        this.$store.commit('ClearSession');
        this.savePage(u, s, '');
      },
      savePage(u,s,c) {
        this.$store.commit('SavePage', { url:u, sector:s, cache: c });
      },
    },
    created() {
        //save as our home
        this.info.head.sector = this.info.root;
        this.$store.commit('SavePage', { url:this.info.url, sector:this.info.head.sector, cache: '' });
        
        //Session watcher
        this.watcher.push(setInterval(() => {
          if (!this.validSession()) {
            this.ready = false;
            this.$store.commit('ClearSession');
            this.$store.commit('EMIT_REDIRECT', { url:'/', sector:'home', trigger: true });
            console.log('Dashboard::NotValidSession');
          } else {
            this.ready = true;
            console.log('Dashboard::SessionValidated');
            if (this.session_interval < 3) {
              this.session_interval = 3;
            }
          }
        }, this.session_interval*1000));
        
        //watcher for sector change via menu
        this.watcher.push(setInterval(() => {
          if (this.info.sector !== this.settings.current.page.head.sector) {
            this.info.head = this.settings.current.page.head;
            this.info.sector = this.info.head.sector;
            console.log('Dashboard::NextSector');
          }
        },1300));
      }
  }
</script>

<style scoped>
#fit {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
#content {
  color: white;
  top: 0;
  padding: 50px;
}
</style>
