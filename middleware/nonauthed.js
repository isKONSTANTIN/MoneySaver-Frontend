export default async function ({app, context, redirect, store}) {
  const session = app.$cookies.get("auth_session");

  if (session == null || session === ""){
    return
  }

  var user = undefined

  await fetch(app.$axios.defaults.baseURL + "api/user?token=" + session)
    .then(response => {
      if (!response.ok)
        throw Error(response.statusText);

      return response
    })
    .then(response => response.json())
    .then(result => {
      store.commit("setUser", result);
      app.$cookies.set("auth_session", session,{maxAge: 60 * 60 * 24 * 7});
      user = result;
    }).catch(e => {
      console.log(e)
    })

  if (user !== undefined){
    redirect("/")
  }

}
