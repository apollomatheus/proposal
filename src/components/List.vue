<template>    
<div id="content" class="application--wrap">
    <div v-if="ready">
      <h3> Hello this is {{head.title}} </h3>

      <div v-if="error.valid">
        <h3> Got error: {{error.message}} </h3>
      </div>

      <div v-if="listReady">
        <h3 v-if="!proposals"> Empty list </h3>
        <div v-if="proposals" id="list">
          <h3>
            {{head.title}}
            <div id="head-item-menu">
               <v-btn slot="activator" color="primary"
                        class="deep-orange" dark>
                      <i class="fas fa-question-circle deep-icon" aria-hidden="true"></i>
                      Help
              </v-btn>
            </div>
          </h3> 
          
          <hr />

          <div id="list-body">
            <div id="list-item" v-for="item in proposals" v-bind:key="item">
              <div id="list-item-info" class="head-list">

                <div id="list-item-v">
                  <div id="list-item-name">
                    Description:
                  </div>
                  <div id="list-item-value">
                    {{item.description}}
                  </div>
                </div>

                <div id="list-item-v">
                  <div id="list-item-name">
                    URL:
                  </div>
                  <div id="list-item-value">
                    {{item.url}} 
                  </div>
                </div>

                <div id="list-item-v">
                  <div id="list-item-name">
                    Votes
                  </div>
                  <div id="list-item-value">
                    {{item.votes.yes}} / {{item.votes.no}}
                  </div>
                </div>
                
                <!-- action buttons -->
                <div id="list-item-v">
                  <div id="list-item-name">
                  <v-menu bottom origin="center center" transition="scale-transition">

                    <v-btn slot="activator" color="primary"
                        class="deep-orange" dark>
                      <i class="fas fa-bars"></i>  
                    </v-btn>
                    <v-list class="blue" color="white">
                      <v-list-tile
                        v-for="(x,i) in menuItems"
                        :key="i"
                        @click="action(item,x.action)">
                        <v-list-tile-title><i :class="x.icon" :style="x.style"></i> {{ x.title }}</v-list-tile-title>
                      </v-list-tile>
                    </v-list>

                  </v-menu>
                  </div>
                </div>

              </div>
              <hr />
            </div>
          </div>
        </div>
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
        listReady: false,
        watchers: [],
        proposals: [],
        error: {
          message: '',
          valid: false,
        },
        menuItems: [
          {title:'Copy Vote Yes', icon: 'fas fa-',      style: "color: white;", action: 'copyYes'},
          {title:'Copy Vote No',  icon: 'fas fa-cog',   style: "color: white;", action: 'copyNo'},
         ],
      };
    },

    computed: {
      ...mapState({
        settings: state => state.settings,
        dash: state => state.dash,
      }),
    },

    methods: {
      action(item,action) {
        if (action == "copyYes" || action == "copyNo") {
            var opt = (action == "copyYes") ? " yes":" no";
            var textArea = document.createElement("textarea");
            textArea.style.hidden = true;
            textArea.value = "gobject vote-many "+item.hash+opt;
            document.body.appendChild(textArea);
            textArea.select();
            try {
              var successful = document.execCommand('copy');
              var msg = successful ? 'successful' : 'unsuccessful';
              console.log('Copied: ' + msg);
            } catch (err) {
              console.error('Failed to copy: ', err);
            }
        }
      },
      go(s) {
        this.$store.commit('EMIT_REDIRECT', { url: this.settings.current.page.url, sector: s });
      },
    },

    created() {
        this.head = this.settings.current.page.head;
        this.ready = true;
        //call for task proposal
        this.$store.commit('GetApiTask',{id:'GSP'});
        //create a watcher
        let watchNUM = this.watchers.length;
        //wait task response
        this.watchers.push(setInterval(()=>{
          if (this.dash.task.ready) {
            if (this.dash.task.error.length > 0) {
              this.error.message = this.dash.task.error;
              this.error.valid = true;
            } else {
              this.proposals = this.dash.task.result.proposals;
              this.listReady = true;
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
