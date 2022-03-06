export default async function ({app, context, redirect, store}) {
  await store.dispatch("server/preloadData", {$store: store, $axios: app.$axios}, "", false)
    .finally(() => {
      if (store.state.server.version === undefined || store.state.server.version === ""){
        redirect("/serverUnavailable")
      }
    })
}
