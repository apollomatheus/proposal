<template>
    <div id="content">
        <Logo> </Logo>
        <Menu> </Menu>
        <div v-if="ready">
            <div id="login" v-if="info.head.sector === info.root">
                <h1>{{info.head.title}}</h1>
                <Alert v-if="settings.current.alert.enabled"></Alert>
                <center>
                    <form>
                        <input v-model="Login" value="login"/>
                        <input v-model="Password" value="password"/>
                        <v-btn slot="activator" color="primary"
                            class="deep-orange" dark @click="login()">
                            Login
                        </v-btn>
                    </form>
                </center>
            </div>
        </div>
    </div>
</template>

<script>
  import Alert from './model/Alert'
  import Logo from './model/logo/logo'
  import Menu from './model/menu/menu'
  import axios from 'axios'
  import {mapState} from 'vuex'

  export default {
    data () {
      return {
        session: '',
        ready: false,
        info: {
          url: '/login',
          root: 'login',
          head: {sector: 'login'},
        },
        stored: {
            user: '',
            password: '',
        },
        ci: null,
      };
    },
    components: {
        Alert,
        Menu,
        Logo,
    },
    computed: {
      ...mapState({
        settings: state => state.settings,
        dash: state => state.dash,
      }),
      Login: {
          get() {
              return this.stored.user;
          },
          set(val) {
              this.stored.user = val;
          },
      },
      Password: {
          get() {
              return this.stored.password;
          },
          set(val) {
              this.stored.password = val;
          },
      },
    },

    methods: {
        updateSector() {
            this.info.head = this.settings.current.page.head;
            this.ready = true;
        },
        validSession() {
            this.session = window.$cookies.get('session');
            this.$store.commit('CheckSession', this.session);
            return this.dash.logged;
        },
        makeSession() {
            if (this.dash.logged) {
                this.$store.commit('GenerateSession');
                window.$cookies.set('session', this.dash.session);
                this.go('/dashboard','home');
            } else {
                this.alert('You are not authorized.','high');
            }
        },
        makeLogin() {
            this.$store.commit('TryLogin', this.stored);
            if (this.dash.logged) {
                this.makeSession();
            } else {
                this.alert('Incorrect user or password!', 'high');
            }
        },
        login() {
            if (this.stored.user.length === 0 || this.stored.password.length === 0) {
                this.alert('Please insert correct user or password!', 'medium');
            } else {
                this.makeLogin();
            }
        },
        alert(m,l) {
            this.$store.commit('EMIT_ALERT_ON', { enabled: true, 
                                              message: m, 
                                              level: l });
        },
        go(u,s) {
            this.$store.commit('EMIT_REDIRECT', { url:u, sector:s, trigger: true });
        },
    },
    created() {
        if (this.validSession()) {
            this.go('/dashboard', 'home');
        } else {
            //not saved in store, so we save
            if (this.settings.current.page.head.sector !== this.info.head.sector) {
                this.$store.commit('SavePage', { url: this.info.url, sector: this.info.root, cache: '' });
            }
            //get head sector
            this.updateSector();
        }
    },
  }
</script>

<style scoped>

#content {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

#login {
    background-color: #ffffff;
    color: rgb(20, 20, 20);
    position: absolute;
    margin:0;
    padding: 100px;
    top: 80px;
    bottom: 0;
    width: 100%;
}

input {
    padding: 5px;
    margin: 5px;
    display: block;
    background-color: #e6e0e0;
    color:#222222;
    border-bottom: 1px inset #00ee00;
}

</style>
