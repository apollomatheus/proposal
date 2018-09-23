<template>
    <div id="menu" :begin="begin">
      <div v-if="ready">
        
        <v-btn @click="go('/','list')" color="primary"
            class="deep-orange" dark>
          <i class="fa fa-list" style="padding-right: 5px;"></i>
          Proposals
        </v-btn>

        <v-btn @click="go('/','status')" color="primary"
            class="deep-orange" dark>
          <i class="fa fa-cogs" style="padding-right: 5px;"></i>
          Status
        </v-btn>

      </div>
    </div>
</template>

<script>
  import {mapState} from 'vuex';

  export default {
    data () {
      return {
        page: {},
        redirect: { url: '', sector: '', trigger: false },
        ready: false,
        watchers: []
      };
    },

    computed: {
      ...mapState({
        settings: state => state.settings,
        dash: state => state.dash,
      }),
      begin() {
        this.page = this.settings.current.page;
        this.ready = true;
      }
    },
    
    methods: { 
        go(u,s) {
          this.$store.commit('SavePage', { url: u, sector: s, clean: false, who: 'menu' });
          this.page = this.settings.current.page;
          console.log('Menu Redirect triggered');
        },
    },
    created() {
    }
  }
</script>

<style scoped>
    #menu {
        position: absolute;
        top: 65px;
        right: 10px;
        color: #001b1f;
        width: fit-content;
        height: fit-content;
        background-color: #ffffff;
        box-shadow: 1px 3px 3px 0px #aaaaaa;
    }
</style>
