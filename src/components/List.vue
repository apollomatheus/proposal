<template>    
<div id="content" class="application--wrap">
    <div v-if="ready">

      <div v-if="error.valid">
        <h3> Got error: {{error.message}} </h3>
      </div>

      <Loading v-if="!listReady"></Loading>
      <div v-if="listReady">
        <h3 v-if="!proposals"> Empty list </h3>
        <div v-if="proposals" id="list">
          <h3>
            {{head.title}}
            <div id="head-item-menu">
               <v-btn slot="activator" color="primary"
                        class="deep-orange" dark>
                      <i class="fas fa-question-circle deep-icon " aria-hidden="true"></i>
                      <div class="tooltip">Help
                        <span class="tooltiptext tooltiptext-left">
                          <p>
                            This is a list with all proposals registered.
                            <br>
                            Use <b>buttons</b> to copy each vote rapidly.
                            <br>
                            Paste the text inside Debug console. 
                          </p>
                        </span>
                      </div>
              </v-btn>
            </div>
          </h3> 

          <hr />

          <div id="list-body">
            <div id="list-item" class="body-list-initial">
              <div id="list-item-info" class="body-list">
                <table id="list-table">
                  <tr id="list-head-item">
                    <th id="list-th">
                        Name / Document
                      <hr />
                    </th>
                    <th id="list-th">
                        Amount
                      <hr />
                    </th>
                    <th id="list-th">
                        Votes (Yes/No)
                      <hr />
                    </th>
                    <th id="list-th">
                        Actions
                      <hr />
                    </th>
                  </tr>
                  <tr id="list-table-item" v-for="(item,index) in proposals" :key="index">
                    <td>
                      <div id="list-item-name">
                        {{item.name}}
                      </div>
                      <div id="list-item-name">
                        <a :href="item.url">{{item.url}}</a>
                      </div>
                    </td>
                    <td>
                      <div id="list-item-name">
                        {{item.amount}}
                      </div>
                    </td>
                    <td>
                      <div id="list-item-name">
                      <i class="fas fa-check"></i> {{item.votes.yes}} / <i class="fas fa-times"></i> {{item.votes.no}} 
                      </div>
                    </td>
                    <td style="width: 250px;">
                      <div id="list-item-name" style="float:left; width: 200px;">
                            <v-btn id="vote-yes" slot="activator" style="background-color: #0bc759; color: white;"
                            @click="clickAction('copyYes',item,'vote-yes','Copy Vote Yes')">
                              <i class="fas fa-check" style="padding-right: 5px;"></i>  
                              Copy Vote Yes
                            </v-btn>
                            
                            <v-btn id="vote-no" slot="activator" style="background-color: #db3838; color: white;"
                            @click="clickAction('copyNo',item,'vote-no', 'Copy Vote No')">
                              <i class="fas fa-times" style="padding-right: 5px;"></i> 
                              Copy Vote No 
                            </v-btn>
                          </div>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</div>
</template>

<script>
  import Loading from './model/Loading'
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
      };
    },
    components: {
      Loading,
    },
    computed: {
      ...mapState({
        settings: state => state.settings,
        dash: state => state.dash,
      }),
    },

    methods: {
      updateElementHTML(id,value) {
        var obj = document.getElementById(id);
        if (obj) {
          obj.innerHTML = value;
        }
      },
      copyText(text) {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.hidden = true;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        textArea.parentNode.removeChild(textArea);
      },
      clickAction(id,param,elementid,text) {
        if (id == "copyYes" || id == "copyNo") {
            var opt = (id == "copyYes") ? " yes":" no";
            var cl = (id == "copyYes") ? "fas fa-check":"fas fa-times";
            this.copyText("gobject vote-many "+param.hash+opt);
            var bf = '<i class="'+cl+'" style="padding-right: 5px;"></i> Copied';
            var af = '<i class="'+cl+'" style="padding-right: 5px;"></i> '+text;
            this.updateElementHTML(elementid,bf);
            setTimeout(()=>{
              this.updateElementHTML(elementid,af);
            },3000);
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
            this.proposals = [
              {
                hash: 'abcdefghijklmnopqrstuvxwyz1234567890',
                name: 'Proposal test',
                url: 'http://www.internet.com',
                amount: 100.00,
                votes: {
                  yes: 100,
                  no: 20,
                }
              }
            ]
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
#list-head-item-v {
  display: inline;
  position: relative;
  padding: 120px;
  -webkit-text-stroke-width: medium;
}
#list-table {
  position: relative;
  width: 100%;
}
#list-item-name {
  max-width: 400px;
  padding-left: 20px;
  padding-top: 10px;
  word-wrap: break-word;
  font-family: Trebuchet MS, sans-serif;
}
#list-item {
  color: black;
  padding: 20px;
}


#list-table-item {
  color: black;
  padding: 20px;
  padding-top: 40px;
}
#list-head-item-name {
  display: inline;
  left: 35px;
  font-weight: 900;
}
#list-head-item {
  position: relative;
  padding: 20px;
}
#list-th {
  padding-top:0;
  text-align: left;
  line-height: 2;
  font-size: 15px;
  font-weight:800;
  padding-left: 10px;
  color: #1c1b1dd3;
  font-family: monospace;
}

.body-list-initial {
  min-height: 500px;
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

.tooltip {
    position: relative;
    display: inline-block;
}

.tooltip .tooltiptext {
    visibility: hidden;
    min-width: 120px;
    min-height: 100px;
    width: auto;
    height: auto;
    top: -10px;
    padding: 30px;
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    position: absolute;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.3s;
    -webkit-text-stroke-width: medium;
}
.tooltip .tooltiptext-right {
    left: 200%;
}
.tooltip .tooltiptext-left {
    right: 200%;
}
.tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
}
</style>
