import Vue from "vue";

export const actions = {

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  },

  notifications(context, session) {
    navigator.serviceWorker.ready
      .then((serviceWorkerRegistration) => {
        serviceWorkerRegistration.pushManager.getSubscription()
          .then(async (subscription) => {
            try {
              let subscribe = null;

              if (!subscription) {
                var publicKey = ""

                await fetch(context.$axios.defaults.baseURL + "api/pushing/publicKey?token=" + session)
                  .then(response => response.text())
                  .then(result => {
                    publicKey = result
                  })

                await serviceWorkerRegistration.pushManager
                  .subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: this.urlBase64ToUint8Array(publicKey),
                  }).then(async (s) => {
                    subscribe = s.toJSON();
                  });

                actions.apiPostRequest("pushing/setNotificationData?token=" + session, {endpoint: subscribe.endpoint, auth: subscribe.keys.auth, p256dh: subscribe.keys.p256dh}, context.$axios.defaults.baseURL)
                  .then(() => {})
              }
            } catch (e) {
              console.log(e)
            }
          });
      });
  },

  reloadAccounts(context, session){
    fetch(context.$axios.defaults.baseURL + "api/accounts?token=" + session)
      .then(response => response.json())
      .then(result => {
        context.$store.commit("setAccounts", result)
        var accountsMap = {}

        result.map((obj) => {
          accountsMap[obj.id] = obj
        })

        context.$store.commit("setAccountsMap", accountsMap)
      })
  },

  reloadTransactions(context, session){
    fetch(context.$axios.defaults.baseURL + "api/transactions?token=" + session + "&count=5")
      .then(response => response.json())
      .then(result => {
        context.$store.commit("setShortTransactions", result)
      })
  },

  reloadPlans(context, session) {
    fetch(context.$axios.defaults.baseURL + "api/plans?token=" + session)
      .then(response => response.json())
      .then(result => {
        context.$store.commit("setPlans", result)
      })
  },

  reloadUser(context, session) {
    fetch(context.$axios.defaults.baseURL + "api/user?token=" + session)
      .then(response => response.json())
      .then(result => {
        context.$store.commit("setUser", result);
      }).catch(e => {

      })
  },

  async preloadData(context, session) {
    this.reloadAccounts(context, session)
    this.reloadTransactions(context, session)
    this.reloadPlans(context, session)

    await fetch(context.$axios.defaults.baseURL + "api/info/monthChanges?token=" + session)
      .then(response => response.json())
      .then(result => {
        context.$store.commit("setMonthChanges", result)
      })

    await fetch(context.$axios.defaults.baseURL + "api/tags?token=" + session)
      .then(response => response.json())
      .then(result => {
        context.$store.commit("setTags", result)
      })

    var tagsMap = {}
    var costs = []

    context.$store.state.tags.map((obj) => {
      tagsMap[obj.id] = obj
    })

    context.$store.commit("setTagsMap", tagsMap)

    for (const [key, value] of Object.entries(context.$store.state.monthChanges)) {

      var tag = tagsMap[key];

      if (tag !== undefined && tag.kind === -1)
        costs.push({value: Math.abs(value), tag: tag, left: tag.limit - Math.abs(value)})
    }

    context.$store.commit("setCostsPrepared", costs)
  },

  apiPostRequest(path, args, baseURL){
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8"},
      body: JSON.stringify(args)
    };

    return fetch(baseURL + "api/" + path, requestOptions)
      .then(response => {
        if (!response.ok)
          throw Error(response.statusText);

        return response
      })
  },

  apiPostRequestRaw(url, args){
    const requestOptions = {
      method: "POST",
      body: args
    };

    return fetch(url, requestOptions)
      .then(response => {
        if (!response.ok)
          throw Error(response.statusText);

        return response
      })
  }
}

export const state = () => ({
  user: {},
  modals: {},
  accounts: {},
  accountsMap: {},
  tags: {},
  tagsMap: {},
  shortTransactions: {},

  monthChanges: {},
  costsPrepared: [],

  plans: {}
})

export const mutations = {
  setUser(state, user){
    state.user = user;
  },

  setAccounts(state, accounts) {
    state.accounts = accounts;
  },

  setAccountsMap(state, accountsMap) {
    state.accountsMap = accountsMap;
  },

  setTags(state, tags) {
    state.tags = tags;
  },

  setTagsMap(state, tagsMap) {
    state.tagsMap = tagsMap;
  },

  setMonthChanges(state, changes) {
    state.monthChanges = changes;
  },

  setCostsPrepared(state, costs) {
    state.costsPrepared = costs;
  },

  setPlans(state, plans){
    state.plans = plans
  },

  setShortTransactions(state, transactions) {
    state.shortTransactions = transactions;
  },

  createModal(state, name){
    if (state.modals[name] === undefined)
      Vue.set(state.modals, name, {
        showed: false,
        data: {}
      })
  },

  setModalShowEvent(state, args){
    if (state.modals[args.name] === undefined)
      Vue.set(state.modals, args.name, {
        showed: false,
        data: {},
        showEvent: args.func
      })
    else{
      Vue.set(state.modals[args.name], 'showEvent', args.func)
    }
  },

  setModalHideEvent(state, args){
    if (state.modals[args.name] === undefined)
      Vue.set(state.modals, args.name, {
        showed: false,
        data: {},
        showEvent: args.func
      })
    else{
      Vue.set(state.modals[args.name], 'hideEvent', args.func)
    }
  },

  showModal(state, args) {
    if (state.modals[args.name] === undefined)
      Vue.set(state.modals, args.name, {
        showed: true,
        data: {}
      })
    else {
      Vue.set(state.modals[args.name], 'showed', true)
      Vue.set(state.modals[args.name], 'data', args.data)

      var func = state.modals[args.name].showEvent;

      if (typeof func === 'function')
        func(args.data)
    }
  },

  hideModal(state, name) {
    if (state.modals[name] === undefined)
      Vue.set(state.modals, name, {
        showed: false,
        data: {}
      })
    else {
      Vue.set(state.modals[name], 'showed', false)
      Vue.set(state.modals[name], 'data', {})

      var func = state.modals[name].hideEvent;

      if (typeof func === 'function')
        func()
    }
  },
}
