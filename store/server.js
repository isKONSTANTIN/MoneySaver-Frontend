import Vue from "vue";

export const actions = {
  async reloadOptions(store, context, force = false){
    if (!force && context.$store.state.server.version !== undefined)
      return

    var r

    await context.$axios.get("/server")
      .then(response => response.data)
      .then(result => {
        context.$store.commit("server/setVersion", result.version)
        context.$store.commit("server/setRegistrationStatus", result.registration)
        r = result
      })

    return r
  },

  async preloadData(store, context, session, force = false) {
    await Promise.all([
      context.$store.dispatch("server/reloadOptions", context, force),
    ]).catch(e => {
      console.log(e)
    })

  },
}

export const state = () => ({
  version: undefined,
  registration: false,
})

export const mutations = {
  setVersion(state, version){
    state.version = version;
  },

  setRegistrationStatus(state, registration){
    state.registration = registration;
  },
}
