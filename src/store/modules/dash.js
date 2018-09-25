const request = require('request');


const state = {
    api_url: 'http://localhost:3080',
    logged: false,
    session: '',
    tasks: [],
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
        let cmd = '';

        switch (task.id) {
            case "GSS": {
                cmd = '/status';
                break;
            }
            case "GSP": {
                cmd = '/proposals';
                break;
            }
            default:
            return -1;
        }
        
        var tasknum = state.tasks.length;

        state.tasks.push({
            action: task.id,
            ready: false,
            error: '',
            result: {},
        });
        
        task.register(tasknum);

        request({
            url: state.api_url+cmd,
        }, function(error, response, body){
            if (response) {
                if (response.statusCode != 200) {
                    state.tasks[tasknum].error = 'Connection failed!';
                }
            }
            if (body) {
                if (error) {
                    state.tasks[tasknum].error = error;
                } else {
                    state.tasks[tasknum].result = JSON.parse(body);
                }
            }
            state.tasks[tasknum].ready = true;
        });

    },
};
  
export default {
    state,
    mutations,
}
  