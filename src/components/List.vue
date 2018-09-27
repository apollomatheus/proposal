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
                            Use <b> actions buttons</b> to copy each vote rapidly.
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
                    </th>
                    <th id="list-th">
                        Payment
                    </th>
                    <th id="list-th">
                        Amount Asked / Available
                    </th>
                    <th id="list-th">
                        Votes (Yes/No)
                    </th>
                    <th id="list-th">
                        Status
                    </th>
                    <th id="list-th">
                        <i class="fas fa-cog"></i> Actions
                    </th>
                  </tr>
                  <!-- proposal informations -->
                  <tr id="list-table-item" v-for="(item,index) in proposals" :key="index">
                    <td id="list-td">
                      <div id="list-item-name">
                        {{item.name}}
                      </div>
                      <div id="list-item-name">
                        <a :href="fixURL(item.url)">{{item.url}}</a>
                      </div>
                    </td>
                    <!-- paument -->
                    <td id="list-td">
                      <div id="list-item-name">
                        {{item.amount.payment.paid}} / {{item.amount.payment.total}} 
                      </div>
                    </td>
                    <!-- amount -->
                    <td id="list-td">
                      <div id="list-item-name">
                        <i class="icon-zcore"></i>
                        {{item.amount.request}} 
                        <br>
                        <i class="icon-zcore"></i>
                        {{item.amount.available}} 
                      </div>
                    </td>
                    <!-- votes -->
                    <td id="list-td">
                      <div id="list-item-name">
                      <i class="fas fa-check"></i> {{item.votes.yes}} / <i class="fas fa-times"></i> {{item.votes.no}} 
                      <br>
                      Total: {{item.votes.yes-item.votes.no}}
                      </div>
                    </td>
                    <!-- status -->
                    <td id="list-td">
                      <div id="list-item-name"  v-if="(item.votes.yes-item.votes.no) >= item.masternodes * 0.10" style="color: #00aa00dd">
                          <i class="fas fa-check"></i> 
                          Passing
                      </div>
                      <div id="list-item-name"  v-if="(item.votes.yes-item.votes.no) < item.masternodes * 0.10" style="color: #aa0000dd">
                          <i class="fas fa-times"></i> 
                          <b>Insufficient Votes</b>
                      </div>
                    </td>
                    <!-- actions -->
                    <td style="width: 250px;" id="list-td">
                      <div id="list-item-name" style="float:left; width: 200px;" :class="item.index">

                        <v-btn id="copy-yes" class="button-collapse" slot="activator"
                            style="color:#2d3a30; background-color: #2fdd55;"
                            @click="ClickAction('copyYes',item,{id:'copy-yes', class: item.index},'Copy Vote Yes') ">
                            <i class="fas fa-check" style="padding-right: 5px;"></i>  
                            <span class="span-collapse" id="input-spam"> Copy Vote Yes </span>
                        </v-btn>

                        <v-btn  id="copy-no" class="button-collapse" slot="activator" 
                            style="color:white; background-color: #f17034;"
                            @click="ClickAction('copyNo',item,{id:'copy-no', class: item.index},'Copy Vote No')">
                            <i class="fas fa-times" style="padding-right: 5px;"></i> 
                            <span class="span-collapse" id="input-spam"> Copy Vote No </span> 
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
  
  HTMLCollection.prototype.getChildElementById = function(id) {
    if (this.length > 0 && id) {
      for (var i = 0; i < this.length; i++) {
        if (this[i]) {
            if (this[i].id == id) {
                return this[i]; 
              }
          }
      }
    }
    return null;
  }
  
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
      fixURL(text) {
        var init = text.substr(0, 6);
        var http = (init == 'https:') ? 'https:': ((init == 'http:/') ? 'http:/': '');
        if (http.length > 0) return text;
        return 'http://'+text;
      },
      updateElement(element,html) {
        if (element) {
          element.innerHTML = html;
        }
      },
      updateElementHTML(id,value) {
        var obj = document.getElementById(id);
        this.updateElement(obj,value);
      },
      updateElementHTML2(classname,id,value) {
        var x = document.getElementsByClassName(classname)[0];
        var y = x.children.getChildElementById(id);
        this.updateElement(y,value);
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
      ClickAction(id,param,element,text) {
        if (id == "copyYes" || id == "copyNo") {
            var opt = (id == "copyYes") ? " yes":" no";
            var cl = (id == "copyYes") ? "fas fa-check":"fas fa-times";
            this.copyText("gobject vote-many "+param.hash+opt);
            //inner element
            var obj = document.getElementsByClassName(element.class)[0];
            var btn = obj.children.getChildElementById(element.id);
            var span = btn.children[0].children[1];//span element
            this.updateElement(span,'Copied');
            //default text
            setTimeout(()=> {
              this.updateElement(span,text);
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
        //create a watcher
        let watchNUM = this.watchers.length;
        let gsstask = -1;
          
        //wait task response
        this.watchers.push(setInterval(()=>{
          if (gsstask < 0) {
            let wNUM = this.watchers.length;
            let TaskDone = false;
            let TaskInterval = 100;

            //call for task proposal
            this.$store.commit('GetApiTask', {id:'GSP', register: (task) => {
              gsstask = task;
            }});

            //wait task response
            this.watchers.push(setInterval(()=>{
              if (!TaskDone) {
                if (this.dash.tasks[gsstask].ready) {
                  TaskDone = true;
                  TaskInterval = 10000;

                  if (this.dash.tasks[gsstask].error) {
                    if (this.dash.tasks[gsstask].error.length > 0) {
                      this.error.message = this.dash.tasks[gsstask].error;
                      this.error.valid = true;
                    }
                  } else {
                    this.proposals = [];
                    if (this.dash.tasks[gsstask].result.proposals) {
                      this.proposals = this.dash.tasks[gsstask].result.proposals;
                      this.listReady = true;
                    } else {
                      this.error.message = 'Failed to retrieve API information!';
                      this.error.valid = true;
                    }
                  } 

                  var tm = setTimeout(()=>{
                    console.log('Updating...');
                    this.listReady = false;
                    clearInterval(this.watchers[wNUM]);
                    gsstask = -1;
                  },2*60000);//2 minutes
                }
              }
            },TaskInterval));
          }
      },3000));
    }
  }
</script>

<style scoped>

.application--wrap {
  min-height: 100px;
  margin-top: 10px;
}

#content {
  background-color: #eeecec;
  padding: 0;
  color: rgb(0, 0, 0);
}

#list {
  background-color: rgb(248, 248, 248);
  position: relative;
  line-height: 1.6em;
  text-align: left;
  margin: 10px;
  box-shadow: 1px 1px 1px 1px #aaaaaa33;
}


#list h3 {
  padding: 30px;
  text-align: left;
  font-size: 30px;
  color: #00000066;
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
  box-shadow: 1px 1px 1px 1px #aaaaaa33;
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
  font-size: 12px;
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
  font-size: 12px;
  font-weight:800;
  padding-left: 10px;
  color: #1c1b1dd3;
  font-family: monospace;
  border-bottom: 5px solid #00000011;
}
#list-td {
  border-bottom: 5px solid #00000011;
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

.button-collapse {
 width: 50px;
 height: 50px;
 background-color: white;
 box-shadow:1px 1px #12211222;
 border-radius: 10px;
 font-size: 15px;
}

.span-collapse {
 opacity: 0;
 font-size: 0;
}

.button-collapse:hover {
 width: 150px;
 height: 50px;
 transition:all 0.4s ease 0s;
}

.button-collapse:hover .span-collapse {
 opacity: 1;
 font-size: 15px;
 transition:all 0.4s ease 0s;
}

.button-dark {
 color:white;
 background-color: #223322aa;
}

.button-white {
 color: #223322ff;
 background-color: #ddddddaa;
}

.icon-zcore {
 width: 20px;
 height: 13px;
 display: inline-block;
 background-image: url('/static/zcore.svg');
 background-repeat: no-repeat;
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
    -webkit-text-stroke-width: thin;
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
