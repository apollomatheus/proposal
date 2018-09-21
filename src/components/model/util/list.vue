<template>
    <div v-if="ready">
      <ul :class="object.object.prop.style.body">
        <li :class="GetItemClass(n)" 
             v-for="(x,n) in object.object.prop.items" 
             v-bind:key="n" 
             @click="Trigger(n)"> 
            {{x}} 
        </li>
      </ul>
    </div>
</template>

<script>
import { mapState } from 'vuex';
    export default {
        data() {
            return {
                id: -1,
                object: null,
                ready: false,
            };
        },
        computed: {
            ...mapState({
                render: state => state.render,
            }),
        },
        methods: {
            GetItemClass(n) {
                //default style
                let style = 'deep-list-item';
                //provided style preference
                if (this.object.object.prop.style !== null) {
                    if (this.object.object.prop.style.item !== null) {
                        if (this.object.object.prop.style.item.length > 0) {
                            style = this.object.object.prop.style.item;
                        }
                    }
                }
                //selected style - merge with common style
                if (this.object.object.prop.selection === n) {
                    if (this.object.object.prop.style.selected !== null) {
                        if (this.object.object.prop.style.selected.length > 0) {
                            style += ' ' + this.object.object.prop.style.selected;
                        }
                    } else {
                        style += ' deep-list-item-selected';
                    }
                }
                return style;
            },
            Trigger(n) {
                console.log('List::Triggered ',this.object.object.prop.items[n]);
                this.object.object.prop.selection = n;
            }
        },
        created() {
            console.log('List::Called');
            const n = this.render.objects.items.length;
            if (n === 0) {
                console.log('List::Misbeahavior');
            } else {
                let pos = 0;
                for (let p = 0; p < this.render.objects.items.length; p++) {
                    if (!this.render.objects.items[p].busy) {
                        this.object = this.render.objects.items[p];
                        this.id = this.object.id;
                        this.$store.commit('RemoveObject', this.id);
                        break;
                    }
                }
                console.log('List::Created ~~> '+this.id);
                this.ready = true;
            }
        }
    }
</script>

<style scoped>
.deep-list-body {
    background-color: #000000;
    height: fit-content;
    width: fit-content;
    min-width: 150px;
    list-style: none;
    margin-left: 5px;
    margin-top: 20px;
    margin-bottom: 10px;
    position: relative;
    border-radius: 5px;
    font-weight: 500;
    box-shadow: 1px 1px 1px 1px #aaaaaa;
    padding: 0;
}
.deep-list-item {
    background-color: #000000;
    color: rgb(255, 255, 255);
    padding: 10px;
    border-radius: 5px 5px none;
    border-bottom: 1px  inset #777777;
}
.deep-list-item:hover {
    background-color: #ffffff;
    color:#121212;
}
.deep-list-item:active {
    background-color: #ffffff;
    color:#121212;
}

.deep-list-item-selected {
    background-color: #ffffff;
    color:#121212;
}
.deep-list-item-selected:hover {
    background-color: #ffffffee;
}

</style>
