const request = require('request');


const state = {
    logged: false,
    session: '',
};


const mutations = {
    ClearSession(state) {
        if (state.logged && state.session != '') {
            request.post({
                url:     'http://localhost:3000/logout/',
                form:    { user: stored.session }
            }, function(error, response, body){
                if (error) throw error;
                state.logged = false;
                state.session = '';
            });
        }
    },
    CheckSession(state, session) {
        if (session !== null) {
            request.post({
                url:     'http://localhost:3000/validate/',
                form:    { user: stored.session }
            }, function(error, response, body){
                if (!error) {
                    if (body.status == 200) {
                        state.logged = true;
                        state.session = body.session;
                        return;
                    } 
                }
                state.logged = false;
                state.session = '';
            });
        } 
    },
    TryLogin(state, stored) {
        request.post({
            url:     'http://localhost:3000/login/',
            form:    { user: stored.user, pwd: stored.password }
        }, function(error, response, body){
            if (error) throw error;
            if (body.status != 200) throw body.error;
            if (body.status == 200) {
                state.logged = true;
                state.session = body.session;
            }
        });
    },

};
  
export default {
    state,
    mutations,
}
  