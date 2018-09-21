<template>
    <div :start="start">
    </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    data () {
      return {
        ci: null,
      };
    },
    computed: {
      ...mapState({
        settings: state => state.settings,
        dash: state => state.dash,
      }),
      start() {
        this.ci = setTimeout(() => {
            window.$cookies.remove('session');
            this.$store.commit('ClearSession');
            this.$store.commit('EMIT_REDIRECT', { url: '/', sector: 'home', trigger: true });
        }, 2000);
      },
    },
  }
</script>

<style scoped>
</style>
