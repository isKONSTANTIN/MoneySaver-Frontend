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

                await context.$axios.get("/pushing/publicKey?token=" + session)
                  .then(result => {
                    publicKey = result.data
                  })

                await serviceWorkerRegistration.pushManager
                  .subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: this.urlBase64ToUint8Array(publicKey),
                  }).then(async (s) => {
                    subscribe = s.toJSON();
                  });

                actions.apiPostRequest("pushing/setNotificationData?token=" + session, {endpoint: subscribe.endpoint, auth: subscribe.keys.auth, p256dh: subscribe.keys.p256dh}, context)
                  .then(() => {})
              }
            } catch (e) {
              console.log(e)
            }
          });
      });
  },

  async reloadAccounts(context, session, force = false){
    var r

    if (!force && Object.keys(context.$store.state.accounts).length !== 0)
      return

    await context.$axios.get("/accounts?token=" + session)
      .then(response => response.data)
      .then(result => {
        context.$store.commit("setAccounts", result)
        r = result
      })

    var accountsMap = {}

    r.map((obj) => {
      accountsMap[obj.id] = obj
    })

    context.$store.commit("setAccountsMap", accountsMap)
    return {a: r, am: accountsMap}
  },

  async reloadTransactions(context, session, force = false){
    if (!force && !Object.keys(context.$store.state.accounts).length === 0)
      return

    return await context.$axios.get("/transactions?token=" + session + "&count=5")
      .then(response => response.data)
      .then(result => {
        context.$store.commit("setShortTransactions", result)
        return result
      })
  },

  async reloadPlans(context, session, force = false){
    if (!force && Object.keys(context.$store.state.plans).length !== 0)
      return

    return await context.$axios.get("/plans?token=" + session)
      .then(response => response.data)
      .then(result => {
        context.$store.commit("setPlans", result)
        return result
      })
  },

  async reloadUser(context, session, force = false){
    if (!force && Object.keys(context.$store.state.user).length !== 0)
      return

    return await context.$axios.get("/user?token=" + session)
      .then(response => response.data)
      .then(result => {
        context.$store.commit("setUser", result);
        return result
      }).catch(e => {

      })
  },

  async reloadGenericStatistics(context, session, force = false){
    if (!force && Object.keys(context.$store.state.genericStatistics).length !== 0)
      return

    var date = new Date()

    const tyear = date.getFullYear()
    const tmonth = date.getMonth() + 1
    const tday = date.getDate()

    date.setDate(date.getDate() - 1);

    const yyear = date.getFullYear()
    const ymonth = date.getMonth() + 1
    const yday = date.getDate()

    const changesToday = await this.getCostsAtDay(context, session, tyear, tmonth, tday)
    const changesYesterday = await this.getCostsAtDay(context, session, yyear, ymonth, yday)

    var costsTodaySum = 0
    var costsYesterdaySum = 0
    var costsMonthSum = 0

    var incomeTodaySum = 0
    var incomeYesterdaySum = 0
    var incomeMonthSum = 0

    for (const [key, value] of Object.entries(changesToday))
      if (value < 0) costsTodaySum += value
      else incomeTodaySum += value

    for (const [key, value] of Object.entries(changesYesterday))
      if (value < 0) costsYesterdaySum += value
      else incomeYesterdaySum += value

    if (context.$store.state.monthChanges !== undefined)
      for (const [key, value] of Object.entries(context.$store.state.monthChanges))
        if (value < 0) costsMonthSum += value
        else incomeMonthSum += value

    var result = {}

    result.costsYesterdaySum = Number(costsYesterdaySum.toFixed(2));
    result.costsTodaySum = Number(costsTodaySum.toFixed(2));
    result.costsMonthSum = Number(costsMonthSum.toFixed(2));

    result.incomeTodaySum = Number(incomeTodaySum.toFixed(2));
    result.incomeYesterdaySum = Number(incomeYesterdaySum.toFixed(2));
    result.incomeMonthSum = Number(incomeMonthSum.toFixed(2));

    context.$store.commit("setGenericStatistics", result);

    return result
  },

  async getCostsAtDay(context, session,year, month, day) {
    return await context.$axios.get("/info/dayChanges?token=" + session + "&year=" + year + "&month=" + month + "&day=" + day)
      .then(response => response.data)
      .then(r => {
        return r
      })
      .catch((e) => {
        console.log(e)
      })
  },

  async reloadMonthChanges(context, session, force = false){
    if (!force && Object.keys(context.$store.state.monthChanges).length !== 0)
      return

    var r = undefined

    await context.$axios.get("/info/monthChanges?token=" + session)
        .then(response => response.data)
        .then(result => {
          context.$store.commit("setMonthChanges", result)
          r = result
        })

    var costs = []
    var tagsMap = context.$store.state.tagsMap

    for (const [key, value] of Object.entries(r)) {
      var tag = tagsMap[key];

      if (tag !== undefined && tag.kind === -1)
        costs.push({value: Math.abs(value), tag: tag, left: tag.limit - Math.abs(value)})
    }

    context.$store.commit("setCostsPrepared", costs)

    return {ms: r, cp: costs}
  },

  async reloadTags(context, session, force = false){
    if (!force && Object.keys(context.$store.state.tags).length !== 0)
      return

    var r

    await context.$axios.get("/tags?token=" + session)
      .then(response => response.data)
      .then(result => {
        context.$store.commit("setTags", result)
        r = result
      })

    var tagsMap = {}

    r.map((obj) => {
      tagsMap[obj.id] = obj
    })

    context.$store.commit("setTagsMap", tagsMap)

    return {t: r, tm: tagsMap}
  },

  async preloadData(context, session, force = false) {
    if (new Date().getTime() - context.$store.state.lastUpdate > 1000 * 60) {
      force = true;
    }

    context.$store.commit("lastTimeUpdate");

    await Promise.all([
      context.$store.dispatch("server/preloadData", context, session, force),
      this.reloadAccounts(context, session, force),
      this.reloadTransactions(context, session, force),
      this.reloadPlans(context, session, force),
      this.reloadTags(context, session, force)
    ]).then((r) => {

    }).catch(e => {
      console.log(e)
    })

    await this.reloadMonthChanges(context, session, force)
    await this.reloadGenericStatistics(context, session, force)
  },

  apiPostRequest(path, args, context){
    return context.$axios.post("/" + path, JSON.stringify(args), {
      headers: {"Content-Type": "application/json; charset=utf-8"}
    })
  },
}

export const state = () => ({
  lastUpdate: 0,

  user: {},
  modals: {},
  accounts: {},
  accountsMap: {},
  tags: {},
  tagsMap: {},
  shortTransactions: {},

  monthChanges: {},
  genericStatistics: {},
  costsPrepared: [],

  plans: {}
})

export const mutations = {
  lastTimeUpdate(state) {
    state.lastUpdate = new Date().getTime();
  },

  setGenericStatistics(state, statistics){
    state.genericStatistics = statistics;
  },

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
