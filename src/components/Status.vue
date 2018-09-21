<template>
    <div id="status" :begin="begin">
            <h1>{{info.head.title}}</h1>
            <center>
                <div>
                </div>
            </center>
    </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    data () {
      return {
        info: {
          name: 'status',
          head: {},
        },
      };
    },

    computed: {
      ...mapState({
        settings: state => state.settings
      }),
      begin() {
        this.info.head = this.settings.current.page.head;
      },
    },

    methods: {

    },
  }
</script>

<style scoped>

#status {
    background-color: #222222;
    color: white;
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
