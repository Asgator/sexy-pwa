'use strict';

importScripts('/sexy-pwa/src/sw-toolbox.js');

toolbox
    .precache([
        '/sexy-pwa/', '/sexy-pwa/index.html', '/sexy-pwa/styles/style.css'
    ]);
toolbox
    .router
    .get('/sexy-pwa/img/*', toolbox.cacheFirst);

toolbox
    .router
    .get('/*', toolbox.networkFirst, { networkTimeoutSeconds: 5 });


/* eslint-disable max-len */

const applicationServerPublicKey = 'BO7nT8JRgEK-0zMA8_KDLfxqxaCnj395vk6IWwMQH_K_9Ch7c1jmcFul8vIn8rpRX2jKhpuhzsjtTTuYLnKee70';

/* eslint-enable max-len */

function urlB64ToUint8Array(base64String) {
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
}

self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    const title = 'Push Sexy PWA';
    const options = {
        body: 'You so sexy',
        icon: '/sexy-pwa/img/favicon/android-icon-72x72.png',
        badge: '/sexy-pwa/img/favicon/android-icon-72x72.png'
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    event.waitUntil(
        clients.openWindow('https://zarplata.ru/')
    );
});

self.addEventListener('pushsubscriptionchange', function(event) {
    console.log('[Service Worker]: \'pushsubscriptionchange\' event fired.');
    
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);

    event.waitUntil(
        self.registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        })
        .then(function(newSubscription) {
            // TODO: Send to application server
            console.log('[Service Worker] New subscription: ', newSubscription);
        })
    );
});