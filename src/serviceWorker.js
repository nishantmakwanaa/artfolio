const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||

    window.location.hostname === '[::1]' ||

    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export function register(config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {

    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {

      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {

        checkValidServiceWorker(swUrl, config);

        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This Web App Is Being Served Cache-First By A Service ' +
              'Worker. To Learn More, Visit https://www.nishantworldwide.in'
          );
        });
      } else {

        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {

              console.log(
                'New Content Is Available And Will Be Used When All ' +
                  'Tabs For This Page Are Closed. See https://www.nishantworldwide.in'
              );

              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {

              console.log('Content Is Cached For Offline Use.');

              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Error During Service Worker Registration :', error);
    });
}

function checkValidServiceWorker(swUrl, config) {

  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then(response => {

      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {

        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {

        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        'No Internet Connection Found. App Is Running In Offline Mode.'
      );
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
}