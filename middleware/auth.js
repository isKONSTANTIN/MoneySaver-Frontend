export default async function ({app, context, redirect, store}) {
  const session = app.$cookies.get("auth_session");

  if (session == null || session === ""){
    redirect("/auth")
    return
  }
  var user = undefined

  await app.$axios.get("/user?token=" + session)
    .then(result => {
      store.commit("setUser", result.data);
      app.$cookies.set("auth_session", session,{maxAge: 60 * 60 * 24 * 7});
      user = result;
    }).catch(e => {

    })

  if (user === undefined){
    redirect("/auth")
  }

}
