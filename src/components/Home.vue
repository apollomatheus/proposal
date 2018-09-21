<template>
    <div id="content" :begin="begin">
      <Logo> </Logo>
      <Menu> </Menu>
      <div v-if="settings.current.page.head.sector === info.root">
        <List v-if="info.sector === 'list'"> </List>
        <Status v-if="info.sector === 'status'"> </Status>
        <div v-if="info.sector === 'home'"> 
          <h1>{{info.head.title}}</h1>
          <p>
            Hello!
          </p>
        </div>
      </div>
    </div>
</template>

<script>
  import Logo from './model/logo/logo'
  import Menu from './model/menu/home'

  import List from './List'
  import Status from './Status'
  
  import {mapState} from 'vuex'

  export default {
    data () {
      return {
        info: {
          url: '/',
          root: 'home',
          sector: 'home',
          head: {sector: 'home'},
        },
        ci: null,
        watcher: [],
      };
    },
    components: {
      Logo,
      Menu,
      List,
      Status,
    },
    computed: {
      ...mapState({
        settings: state => state.settings
      }),
      begin() {
          //not saved in store, so we save
          if (this.settings.current.page.head.sector !== this.info.head.sector) {
            this.$store.commit('SavePage', { url: this.info.url, sector: this.info.root, cache: '' });
          }
          //get new head sectors
          this.ci = setInterval(() => {
            if (this.settings.current.page.head.sector !== this.info.head.sector) {
              console.log('Caught::NewSector');
              this.info.head = this.settings.current.page.head;
            }
          }, 3000);
      },
    },

    methods: {
      savePage(u,s,c) {
        this.$store.commit('SavePage', { url: u, sector: s, cache: c });
      },
      updateSector() {
        this.info.head = this.settings.current.page.head;
      },
    },

    created() {
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
#content {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
