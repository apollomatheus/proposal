<template>
    <div id="content" :begin="begin">
      <div v-if="ready">
        <p>{{head.title}}</p>
      </div>
    </div>
</template>

<script>

  import {mapState} from 'vuex'

  export default {
    data () {
      return {
        head: {},
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
</style>
