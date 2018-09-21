<template>
    <v-btn slot="activator" color="primary"
            v-if="ready" 
            :class="object.object.prop.style" 
            @click="Trigger()">
        {{object.object.prop.title}}
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
            Trigger() {
                console.log('Button::Triggered');
            }
        },
        created() {
            console.log('Button::Called');
            if (this.render.objects.items === null) {
                console.log('Button::Misbeahavior');
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
                console.log('Button::Created ~~> '+this.id);
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
