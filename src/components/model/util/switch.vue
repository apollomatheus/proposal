<template>
    <v-btn slot="activator" color="primary"
            v-if="ready" 
            :class="object.object.prop.style" 
            @click="Trigger()" dark>
        {{GetSelected()}}
    </v-btn>
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
            GetSelected() {
                return this.object.object.prop.items[this.object.object.prop.selection];
            },
            Trigger() {
                console.log('Switch::Triggered');
                if (this.object.object.prop.selection + 1 > 1) {
                    this.object.object.prop.selection = 0;
                } else {
                    this.object.object.prop.selection = 1;
                }
            }
        },
        created() {
            console.log('Switch::Called');
            if (this.render.objects.items === null) {
                console.log('Switch::Misbeahavior');
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
                console.log('Switch::Created ~~> '+this.id);
                this.ready = true;
            }
        }
    }
</script>

<style scoped>
.deep-button {
    background-color: #5631ad;
    color: white;
    margin-top: 10px;
    font-size: 15px;
    text-align: center;
    position: relative;
}
</style>
