<template>
    <div id="logo" :start="start">
        <img src="https://i.imgur.com/poG670P.png" width="100" height="100" class="logo-img"/>
        <h2>{{logo.title}}</h2>
        <h3>{{logo.desc}}</h3>
    </div>
</template>

<script>
  import {mapState} from 'vuex';

  export default {
    data () {
      return {
          logo: {
              title:'',
              desc: '',
          },
      };
    },

    computed: {
      ...mapState({
        system: state => state.system,
      }),
      start() {
          this.logo.title = this.system.app.title;
          this.logo.desc = this.system.app.description;
      },
    },

  }
</script>

<style scoped>
#logo {
    text-align: left;
    background-color: #008854;
    line-height: 1.3em;
    height: 130px;
    box-shadow: 0px 3px 3px 0px #d6d6d6ff;
    margin-bottom: 5px;
}
.logo-img {
    position: absolute;
    top: 20px;
    left: 10px;
}

h2 {
    padding-top: 60px;
    font-family: Calibri;
    padding-left: 120px;
    color: #5cffc0;
    font-size: 36px;
}

h3 {
    padding-left: 110px;
    padding-top: 10px;
    color: #eff8e6;
}
</style>
