<template>
    <div id="box"  v-bind:class="emission.level" :show="show">
        <div id="head">
        </div>
        <p>
            {{emission.message}}
        </p> 
    </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    data () {
      return {
        emission: { message: '', level: 'low' },
        guard: {
            cached: {},
            target: '',
            ready: false,
            holder: undefined,
            clear() {
                this.ready = false;
                this.cached = {};
                this.target = '';
            },
            new(t, c) {
                this.target = t;
                this.cached = c;
                this.ready = true;
            }
        },
      };
    },
    computed: {
      ...mapState({
        settings: state => state.settings
      }),
      show() {
        this.emission = this.settings.current.alert;
        this.init2guard();
        setTimeout(this.bye,2000);
      }
    },

    methods: {
        init2guard() {
            this.guard.holder = setInterval(() => {
                if (!this.settings.current.alert.enabled) {
                    clearInterval(this.guard.holder);
                } else {
                    if (this.guard.ready) {
                        this.$store.commit(this.guard.target, this.guard.cached);
                        this.guard.clear();
                    }
                }
            }, 1000);
        },
        bye() {
            this.guard.new('EMIT_ALERT_OFF');
        },
    },
  }
</script>

<style scoped>

.low {
    background-color: #3ca1ff;
    color: rgb(255, 255, 255);
} 
.medium {
    background-color: #d63113;
    color: rgb(211, 212, 218);
} 
.high {
    background-color: #bd0000;
    color: rgb(255, 255, 255);
} 
#box {
    font-family: Calibri;
    position: absolute;
    margin: 2px;
    right: 0;
    width: 350px;
    border: 1px inset #000000;
}

#head {    
    background-color: #ffffff;
    height: 10px;
}

h3 {
    margin: 0;
    margin-left: 2px;
    font-weight: 600;
}

p {
  padding: 5px;
}
</style>
