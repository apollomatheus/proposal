<template>    
<div id="content" class="status-content application--wrap">
  <!-- created by apollo - color definitions -->
  <svg width="0px" height="0px" style="hidden:true;">
    <defs>
      <linearGradient id="lg-ok" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#00b386; stop-opacity:1;"/>
          <stop offset="100%" style="stop-color:#00b386; stop-opacity:1;"/>
      </linearGradient>
      <linearGradient id="lg-false" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#ff3300; stop-opacity:0.8;"/>
          <stop offset="100%" style="stop-color:#ff3300; stop-opacity:0.8;"/>
      </linearGradient>
    </defs>
      <defs>
        <filter id="f1" x="0" y="0" width="200%" height="200%">
          <feOffset result="offOut" in="SourceGraphic" dx="0" dy="1" />
          <feGaussianBlur result="blurOut" in="offOut" stdDeviation="5" />
          <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
        </filter>
      </defs>
    </svg>

    <div v-if="ready">
      <div v-if="error.valid">
        <h3> Got error: {{error.message}} </h3>
      </div>

      <div v-if="infoReady">
        <h3 v-if="!status"> Empty information </h3>
        <div v-if="status" id="list">

<div class="voting-header" style="height: 560px;"> 

        <div class="top-middle-div">
              <center><h3> Voting  Deadline </h3></center>
              <center><h2> {{status.deadline}} <b>DAYS</b> </h2></center>
              <center><h3> {{getStatusDate()}} </h3></center>
        </div>

        <div class="voting-header" style="height: 300px; top: 70px"> 

        <div class="middle-div-left" id="middle-div">
              <h3 class="progress-title"> Budget Requested: <i data-v-264bddce="" class="icon-zcore"></i>{{status.amount.requested}}</h3>
              <div class="progress">
              <svg class="svg-progress" height="100" width="500">
                <path d="M0 0 L 500 0 L 500 70 L 0 70Z" fill="white" />
                <path d="M360 10 L 480 10 L 480 60 L 360 60Z"  id="miss-progress" class="status-box-false" />
              </svg>
              <div class="progress-information">
              <div class="progress-left">
                  <h2>{{status.proposal.passing}}</h2>
                  <h3>Passing Proposals</h3>
              </div>
              <div class="progress-right">
                  <h2 style="right: -70px;">{{status.proposal.insufficient}}</h2>
                  <h3 style="right: -90px;">Insufficient votes</h3>
              </div>
              </div>
              </div>
        </div>

        <div class="middle-div-right" id="middle-div">
              <h3 class="progress-title"> Budget Available: <i data-v-264bddce="" class="icon-zcore"></i>{{status.amount.available}}</h3>
              <div class="progress">
              <svg class="svg-progress" height="100" width="500">
                <path d="M0 0 L 500 0 L 500 70 L 0 70Z" fill="white" />
                <path d="M360 10 L 480 10 L 480 60 L 360 60Z"  id="miss-progress" class="status-box-false" />
              </svg>
              <div class="progress-information">
              <div class="progress-left">
                  <h2>{{status.amount.allocated}}</h2>
                  <h3>Budget Allocated</h3>
              </div>
              <div class="progress-right">
                  <h2 style="right: -70px;">{{status.amount.unallocated}}</h2>
                  <h3 style="right: -90px;">Unallocated Budget</h3>
              </div>
              </div>
              </div>
          </div>
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
        infoReady: false,
        watchers: [],
        status: {},
        error: {
          message: '',
          valid: false,
        },
      };
    },

    computed: {
      ...mapState({
        settings: state => state.settings,
        dash: state => state.dash,
      }),
    },

    methods: {
      getStatusDate() {
        if (this.infoReady) {
          var months = ['January','February','March','April',
                        'May','June','July','August',
                        'September','October','November','December'];
          var month =months[Math.round(this.status.date.month)-1]; 
          return month+' '+this.status.date.day+', '+this.status.date.year;
        }
        return '';
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
            this.$store.commit('GetApiTask', {id:'GSS', register: (task) => {
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
                    this.status = {};
                    if (this.dash.tasks[gsstask].result.status) {
                      this.status = this.dash.tasks[gsstask].result.status;
                      this.infoReady = true;
                    } else {
                      this.error.message = 'Failed to retrieve API information!';
                      this.error.valid = true;
                    }
                  } 

                  var tm = setTimeout(()=>{
                    console.log('Updating...');
                    this.infoReady = false;
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
}

@media only screen and (max-width: 1024px) {
  .status-content {
    display: none;
  }
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

.voting-header h3 {
  padding: 0;
  padding-top: 20px;
  font-size: 16px;
  font-family: arial;
  text-transform: uppercase;
}

.voting-header h2 {
  font-size: 68px;
  margin: 0;
  word-wrap: break-word;
}

.voting-header .left-div h3 {
  margin-top: 80px;
  font-size: 30px;
  font-family: Arial;
  text-transform: uppercase;
}

.voting-header .left-div h2 {
  margin-top: 35px;
  font-size: 100px;
  text-transform: uppercase;
}

.voting-header {
    position: relative;
    padding-left: 50px;
    padding-right: 50px;
    color: #fff;
    height: 430px;
    line-height: 3em;
    box-shadow: -2px 5px 10px 5px #00000022;
    background-image: radial-gradient(#009973,#009973,#00b386);
    font-family: monospace;
    width: auto;
}

.middle-div-left {
    position: absolute;
    padding: 30px;
    margin-top: 100px;
    left: 0;
}

.middle-div-right {
    padding: 30px;
    margin-top: 100px;
    position: absolute;
    right: 0;
    
}

#middle-div h2 {
    position: absolute;
    margin: 3px;
    padding: 0;
    top: -100px;
    font-size: 32px;
    color: #000000cc;
    font-family: Arial;
}

#middle-div h3 {
   position: absolute;
   margin: 0;
   padding: 0;
   top: -20px;
   font-size: 15px;
   color: #f2f2f2cc;
   font-family: monospace;
}


.left-div {
    position: absolute;
    left: 10%;
    font-size: 30px;
}

.right-div {
    position: absolute;
    right: 10%;
    font-size: 30px;
}

.progress {
  width: auto;
  height: auto;
}

.progress-information {
    position: relative;
    margin: 0;
    padding: 0;
    top: 0;
    width: 400px;
    height: 20px;
    color: #001100;
}

.status-box-ok {
    fill: url(#lg-ok);
    filter: url(#f1);
}

.status-box-false {
    fill: url(#lg-false);
    filter: url(#f1);
}

.status-box-false:hover {
  fill: red;
  opacity: 0.8;
  transition: all 1s ease 0s;
}
</style>
