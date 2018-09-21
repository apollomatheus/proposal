
const state = {
  pages: [
    {
      url: '/',
      private: true,
      sectors: [
        {sector: 'home', title: 'Home'},
        {sector: 'list', title: 'Proposal List'},
        {sector: 'status', title: 'System status'},
      ],
    },
  ],
  current: {
    page: {
      url: '/',
      redirect: { url: '', sector: '', trigger: false },
      default: {sector: 'home', title: 'Home'},
      head: {},
      cache: {},
    },
    alert: {
      enabled: false,
      message: '',
      level: '',
    }
  },
};

const mutations = {
  SavePage(state, payload) {
    const url = payload.url;
    const sector = payload.sector;

    let found = false;
    //find url
    for (let i = 0; i < state.pages.length; i++) {
      if (state.pages[i].url === url) {
        //find sector
        state.current.page.url = state.pages[i].url;
        for (let n = 0; n < state.pages[i].sectors.length; n++) {
          if (state.pages[i].sectors[n].sector === sector) {
            state.current.page.head = state.pages[i].sectors[n];
            state.current.page.cache = payload.cache;
            found = true;
            break;
          }
        }
        if (found) {
          break;
        }
      }
    }
    if (!found) {
      state.current.page.head = state.current.page.default;
      state.current.page.url = '/';
    }
  },
  EMIT_REDIRECT(state, payload) {
    if (payload.trigger) {
      state.current.page.redirect.url = payload.url;
      state.current.page.redirect.sector = payload.sector;
      state.current.page.redirect.trigger = true;
    } else {
      state.current.page.redirect.trigger = false;
      state.current.page.redirect.url = '';
      state.current.page.redirect.sector = '';
    }
  },
  EMIT_ALERT_ON(state, payload) {
    state.current.alert = payload;
  },
  EMIT_ALERT_OFF(state) {
    state.current.alert.enabled = false;
    state.current.alert.message = '';
    state.current.alert.level = '';
  },
  RESET_DB(state) {
    state.pages = [
      {
        url: '/',
        private: false,
        sectors: [
          {sector: 'home', title: 'Home'},
          {sector: 'list', title: 'Proposal List'},
          {sector: 'status', title: 'System status'},
        ],
      },
    ];
    state.current = {
      page: {
        url: '/',
        redirect: { url: '', sector: '', trigger: false },
        default: {sector: 'home', title: 'Home'},
        head: {},
        cache: {},
      },
      alert: {
        enabled: false,
        message: '',
        level: '',
      }
    };
  },
};

export default {
  state,
  mutations,
};
