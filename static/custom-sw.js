self.addEventListener('push', (event) => {
  console.log('push', event);
  const json = event.data.json();
  if (!json.validate) {
    console.log('Show notification', json);
    event.waitUntil(
      self.registration.showNotification(json.title,
        {
          'body': json.body,
          'icon': json.icon,
          'badge': json.badge,
          //'actions': json.actions,
          'url': json.url,
          'data': json,
        },
      ),
    );
  } else {
    console.log('Push message validation', json);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const data = event.notification.data;
  event.waitUntil(clients.matchAll({
    type: 'window',
  }).then(function(clientList) {
    for (let i = 0; i < clientList.length; i++) {
      const client = clientList[i];
      if (client.url == '/' && 'focus' in client) {
        return client.focus();
      }
    }
    if (clients.openWindow) {
      return clients.openWindow(data.url ? data.url : 'https://ms.knst.su');
    }
  }));
});

self.addEventListener('installed', (event) => {
  if (!event.isUpdate) {
    console.debug('The PWA is on the latest version.')
    return
  }

  console.debug('There is an update for the PWA, reloading...')
  window.location.reload()
})
