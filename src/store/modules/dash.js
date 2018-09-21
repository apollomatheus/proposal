


const state = {
    logged: false,
    session: null,
};

const mutations = {
    GenerateSession(state) {
        const sx = ['z','V','1','3','y','5','x','4','Z','P','9','8','7'];
        let sy = '';
        let salts = 8;
        for (let y = 0; y < (salts/2); y++) {
            let round = '';
            for (let x = 0; x < (salts/2); x++) {
                let n = Math.floor(Math.random() * sx.length);
                if (n <= 4) {
                    n = Math.floor(Math.random() * sx.length);
                }
                round = `${round}${sx[n]}`; 
            }
            sy = `${sy}${round}`; 
        }
        state.session = sy;
    },
    ClearSession(state) {
        state.logged = false;
        state.session = '';
    },
    CheckSession(state, session) {
        if (session !== null) {
            state.logged = (session.length > 0);
            state.session = session;
        } else {
            state.logged = false;
            state.session = '';
        }
    },
    TryLogin(state, stored) {
        if (stored.user === 'x' && stored.password === 'y') {
            state.logged = true;
        }
    },

};
  
export default {
    state,
    mutations,
}
  