'use strict';
importScripts('./src/sw-toolbox.js');
toolbox.precache([
    'index.html', 'styles/style.css'
]);
toolbox
    .router
    .get('/img/*', toolbox.cacheFirst); toolbox.router.get('/*', toolbox.networkFirst, { networkTimeoutSeconds: 5});