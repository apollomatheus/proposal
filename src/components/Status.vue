<template>    
<div id="content" class="application--wrap">
    <div v-if="ready">
      <h3> Hello this is {{head.title}} </h3>
      <div v-if="error.valid">
        <h3> Got error: {{error.message}} </h3>
      </div>
      <div v-if="infoReady">
        <h3 v-if="!status"> Empty information </h3>
        
      </div>
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
        infoReady: false,
        watchers: [],
        status: [],
        error: {
          message: '',
          valid: false,
        }
      };
    },

    computed: {
      ...mapState({
        settings: state => state.settings,
        dash: state => state.dash,
      }),
    },

    methods: {
      go(s) {
        this.$store.commit('EMIT_REDIRECT', { url: this.settings.current.page.url, sector: s });
      },
    },

    created() {
        this.head = this.settings.current.page.head;
        this.ready = true;
        //call for task proposal
        this.$store.commit('GetApiTask',{id:'GSS'});
        //create a watcher
        let watchNUM = this.watchers.length;
        this.watchers.push(setInterval(()=>{
          if (this.dash.task.ready) {
            if (this.dash.task.error.length > 0) {
              this.error.message = this.dash.task.error;
              this.error.valid = true;
            } else {
              if (!this.dash.task.result.proposals) {
                this.error.message = 'Failed to connect to API.';
                this.error.valid = true;
              } else {
                this.proposals = this.dash.task.result.proposals;
                this.infoReady = true;
              }
            }
            clearInterval(this.watchers[watchNUM]);
          }
        }));
    }
  }
</script>

<style scoped>

#content {
  background-color: #eeecec;
  padding: 80px;
  left: 0;
  color: rgb(0, 0, 0);
}

#list {
  background-color: rgb(248, 248, 248);
  position: relative;
  line-height: 1.6em;
  text-align: left;
  margin: 10px;
  border: 1px outset #aaaaaa;
  box-shadow: 1px 1px 1px 1px #aaaaaa;
}


#list h3 {
  padding: 30px;
  text-align: left;
  font-size: 30px;
}

#list-item-info {
  font-size: 16px;
  position: relative;
  padding: 10px;
  margin-top: 1px;
}

#list-item-v {
  position: relative;
  margin: 10px;
}

#list-item-name {
  display: inline;
  left: 35px;
}

#list-item-value {
  position: absolute;
  display: inline;
  right: 35px;
}

#head-item-menu {
  position: absolute;
  display: inline;
  top: 15px;
  right: 35px;
}


.head-list {
  color: black;
  border: 1px outset #aaaaaa;
  box-shadow: 1px 1px 1px 1px #aaaaaa;
}

.body-list {
  color: black;
  border: 1px outset #aaaaaa;
  box-shadow: 1px 1px 1px 1px #aaaaaa;
}

.deep-tag {
  color: white;
  padding: 5px;
  margin: 5px;
  box-shadow: 1px 1px 1px 1px #aaaaaa;
}
.ok-tag {
  background-color: rgb(78, 198, 78);
}
.nok-tag {
  background-color: rgb(198, 98, 78);
}
</style>
