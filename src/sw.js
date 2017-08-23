'use strict';
importScripts('/sexy-pwa/src/sw-toolbox.js');
toolbox.precache([
    '/sexy-pwa/index.html', '/sexy-pwa/styles/style.css'
]);
toolbox
    .router
    .get('/sexy-pwa/img/*', toolbox.cacheFirst); toolbox.router.get('/*', toolbox.networkFirst, { networkTimeoutSeconds: 5});
