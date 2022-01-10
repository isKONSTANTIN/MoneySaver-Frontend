export default async function ({app, context, redirect, store}) {
  const session = app.$cookies.get("auth_session");

  if (session == null){
    redirect("/auth")
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
      user = result;
    }).catch(e => {

    })

}
