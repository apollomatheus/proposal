const request = require('request');


const state = {
    api_url: 'http://localhost:3080',
    logged: false,
    session: '',
    task: {
        id: '',
        ready: false,
        error: '',
        result: {},
    },
    config: [],
    responses: [
        {code: 11, valid: true},
        {code: 12, valid: false, error: "Missing post param"},
        {code: 13, valid: false, error: "Missing get param"},
        {code: 14, valid: false, error: "Missing param"},
        {code: 15, valid: false, error: "Connection error"},
    ]
};

///Task handler
///GSS-> Get System Status
///GSP-> Get System Proposals
const mutations = {
    GetApiTask(state, task) {
        if (state.task.id == task.id) {
            if (state.task.ready == false) return;
        }

        state.task.id = task.id;
        state.task.ready = false;
        state.task.error = '';
        
        let url = state.api_url;
        switch (task.id) {
            case "GSS": {
                url += '/status';
                break;
            }
            case "GSP": {
                url += '/proposals';
                break;
            }
            default:
            return;
        }

        request({
            url,
        }, function(error, response, body){
            state.task.ready = true;
            if (response) {
                if (response.statusCode != 200)
                    state.task.error = 'Connection failed!';
            }
            if (error) {
                state.task.error = error;
            } else {
                state.task.result = JSON.parse(body);
            }
        });

    },
};
  
export default {
    state,
    mutations,
}
  