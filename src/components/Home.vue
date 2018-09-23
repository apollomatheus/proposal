<template>
    <div id="content">
      <Logo> </Logo>
      <Menu> </Menu>
      <div v-if="ready">
        <List v-if="info.head.sector === 'list' || info.head.sector === 'home'"> </List>
        <Status v-if="info.head.sector === 'status'"> </Status>
      </div>
    </div>
</template>

<script>
  import Logo from './model/logo/logo'
  import Menu from './model/menu/menu'

  import List from './List'
  import Status from './Status'
  
  import {mapState} from 'vuex'

  export default {
    data () {
      return {
        info: {
          url: '/',
          root: 'home',
          sector: 'list',
          head: { url: '/', sector: 'home' },
        },
        watcher: [],
        ready: false,
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
    },

    methods: {

    },

    created() {
        //not saved in store, so we save
        if (this.settings.current.page.head.url !== this.info.url) {
          this.$store.commit('SavePage', { url: this.info.url, sector: this.info.sector, cache: '', who: 'home' });
        }
          
        this.info.head = this.settings.current.page.head;
        this.info.sector = this.info.head.sector;
        this.ready = true;
        //watcher for sector change via menu
        this.watcher.push(setInterval(() => {
          if (this.info.sector !== this.settings.current.page.head.sector) {
            this.info.head = this.settings.current.page.head;
            this.info.sector = this.info.head.sector;
            console.log('Page::NextSector--->');
            console.log(this.info);
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
