<template>    
<div id="content" :begin="begin" class="application--wrap">
      <div v-if="ready">
        <div id="list">
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
            <div id="list-item" v-for="(item,n) in preferences" v-bind:key="n">
              <div id="list-item-info" class="head-list">
                <div id="list-item-v">
                  <div id="list-item-name">
                    {{item.key}}
                  </div>
                  <div id="list-item-value" :create="CreateObject(n)">
                    <mButton v-if="item.object.type === 'button' && item.ready"></mButton>
                    <mList v-if="item.object.type === 'list' && item.ready"></mList>
                    <mSwitch v-if="item.object.type === 'switch' && item.ready"></mSwitch>
                  </div>
                  <div id="list-item-desc">
                    {{item.description}}
                  </div>
                </div>
              </div>
              <hr />
            </div>
            <center>
              Use help button to get more detailed info for every option.
            </center>
          </div>
        </div>
      </div>
    </div>
</template>

<script>

  import mButton from '../model/util/button';
  import mList from '../model/util/list';
  import mSwitch from '../model/util/switch';

  import {mapState} from 'vuex'

  export default {
    components: {
      mButton,
      mList,
      mSwitch,
    },
    data () {
      return {
        head: {},
        preferences: [
          {
            id: 0,
            key: 'Auto-restart',
            busy: false,
            ready: false,
            c: null,
            description: 'When \'On\', this feature will be able to restart your masternode when it gets disabled, automatic.',
            object: {
              type: 'switch',
              prop: 
              {
                style: 'deep-button',
                default: 0,
                selection: 0,
                items: ['On','Off'],
              },
            },
          },
          {
            id: 1,
            key: 'Notification level',
            busy: false,
            ready: false,
            c: null,
            description: 'Here you can set your notification level, each level will be limited, except for \'All\'.',
            object: {
              type: 'list',
              prop: 
              { 
                style: {
                  body: 'deep-list-body',
                  item: 'deep-list-item',
                  selected: 'deep-list-item-selected',
                },
                default: 0,
                selection: 0,
                items: [ 'All', 'Status', 'Report', 'Disabled'],
              },
            },
          },
          {
            id: 1,
            key: 'Log enbabled',
            busy: false,
            ready: false,
            c: null,
            description: 'Here you can set your logger status, for all masternodes.',
            object: {
              type: 'switch',
              prop: 
              { 
                style: 'deep-button',
                default: 0,
                selection: 0,
                items: ['On','Off'],
              },
            },
          },
        ],
        ready: false,
      };
    },

    computed: {
      ...mapState({
        settings: state => state.settings,
        render: state => state.render,
      }),
      begin() {
        this.head = this.settings.current.page.head;
        this.ready = true;
      },
    },

    methods: {
      CreateObject(ni) {
        if (this.preferences[ni].c === null) {
          this.$store.commit('CreateObject',  this.preferences[ni]);
          const pos = this.GetRenderObject(this.preferences[ni].id);
          this.preferences[ni].c = setTimeout(()=>{
            this.preferences[ni].ready = true;
          },100);
        }
      },  
      GetRenderObject(id) {
        for(let n = 0; n < this.render.objects.items.length-1; n++) {
          if (this.render.objects.items[n].id === id) {
            return n;
          }
        }
        return -1;
      },
      AssertObject(id) {
      	if (id < 0) {
      		console.log('InvalidItemID ~>'+id);
          return false;
        }
        return true;
      },
      /*
    	ListTrigger(id, x, n) {
        const ni = this.GetObject(id);
        if (this.AssertObject(ni)) {
        	this.list[ni].object.prop.selection = n; 
        }
      },
    	SwitchTrigger(id) {
        const ni = this.GetObject(id);
        if (this.AssertObject(ni)) {
        	let next = this.list[ni].object.prop.selection+1;
          if (next >= this.list[ni].object.prop.items.length){
          	next = 0;
          }
        	this.list[ni].object.prop.selection = next; 
        }
      },
    	ButtonTrigger(x) {
      	alert(x);
      }, */
      go(s) {
        this.$store.commit('EmitRedirect', { url: this.settings.current.page.url, sector: s });
      },
    },
    created() {

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
  top: 0;
  padding: 150px;
  padding-top: 10px;
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
  height: fit-content;
  min-height: 100px;
}

#list-item-name {
  display: inline;
  font-weight: 550;
  margin-left: 10px;
}

#list-item-value {
  position: relative;
  margin-top: 15px;
}

#list-item-desc:hover {
  background-color: #fefefe;
  color: #000000;
}
#list-item-desc {
  background-color: #ffffff;
  color: #555555;
  position: relative;
  padding: 15px;
  margin-top: 25px;
  left: 5px;
  width: fit-content;
  min-width: 100px;
  max-width: 630px;  
  height: fit-content;
  min-height: 40px;
  border-radius: 5px;
  border: 1px outset;
  box-shadow: 1px 1px 1px 1px #dddddd;
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
