<template>
    <div id="logo" :start="start">
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

h2 {
    padding-top: 60px;
    font-family: Calibri;
    padding-left: 25px;
    color: #5cffc0;
    font-size: 36px;
}

h3 {
    padding-left: 25px;
    padding-top: 10px;
    color: #eff8e6;
}
</style>
