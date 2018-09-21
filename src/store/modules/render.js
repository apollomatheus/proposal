/**
 *  @author Apollo
 * 
 *  @const state.objects.items 
 *  When we pass from one vue to another, we'll use
 *  this array to keep objects before they be created.
 * 
 *  @const state.objects.busy
 *  After created, they'll get busy status to return 'props' to the root page.
 *  Since, the root page already know eache object, we just pass 'id' and change store.
 * 
 * @const mutations.CreateObject
 * Create a new object and add it's properties as non-busy
 * 
 * @const mutations.BusyObject
 * Find object and change to busy status - not always work
 * 
 * @const mutations.RemoveObject
 * Remove an object from items, working better to side by side object creation, like v-for.
 */
const state = {
    objects: {
        items: [],
        busy: [],
        errors: ['Unknow error'],
    }
};

const mutations = {
    CreateObject(state, object) {
        state.objects.items.push(object);
        state.objects.items[state.objects.items.length-1].busy = false;
        return state.objects.items.length-1;
    },
    BusyObject(state, id) {
        state.objects.errors = ['Unknow error'];
        for (let i = 0; i < state.objects.items.length; i++) {
            if (state.objects.items[i] !== null) {
                if (state.objects.items[i].id === id) {
                    state.objects.items[i].busy = true;
                    return true;
                }
            }
        }
        state.objects.errors.push('Render::BusyObject ~> Failed to find id: '+id+', object may not be created/registered.');
        return false;
    },
    RemoveObject(state, id) {
        state.objects.errors = ['Unknow error'];
        for (let i = 0; i < state.objects.items.length; i++) {
            if (state.objects.items[i] !== null) {
                if (state.objects.items[i].id === id) {
                    state.objects.items.splice(i, 1);
                    return true;
                }
            }
        }
        state.objects.errors.push('Render::RemoveObject ~> Failed to find id: '+id+', object may not be created/registered.');
        return false;
    },
};
  
export default {
    state,
    mutations,
};
  