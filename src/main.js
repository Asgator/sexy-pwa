'use strict';

// Handle  to save PWA
window.addEventListener('beforeinstallprompt', function(e) {
    e.userChoice.then(function(choiceResult) {
        if(choiceResult.outcome == 'dismissed') {
            console.log('User cancelled home screen install');

            return;
        }
        
        console.log('User added to home screen');
    });
});


const applicationServerPublicKey = 'BO7nT8JRgEK-0zMA8_KDLfxqxaCnj395vk6IWwMQH_K_9Ch7c1jmcFul8vIn8rpRX2jKhpuhzsjtTTuYLnKee70';

const pushButton = document.querySelector('.js-push-btn');

let isSubscribed = false;
let swRegistration = null;

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

function updateSubscriptionOnServer(subscription) {
    const subscriptionJson = document.querySelector('.js-subscription-json');
    const subscriptionDetails =
        document.querySelector('.js-subscription-details');

    if (subscription) {
        subscriptionJson.textContent = JSON.stringify(subscription);
        subscriptionDetails.classList.remove('is-invisible');
    } else {
        subscriptionDetails.classList.add('is-invisible');
    }
}

function updateBtn() {
    if (Notification.permission === 'denied') {
        pushButton.textContent = 'Push Messaging Blocked.';
        pushButton.disabled = true;
        updateSubscriptionOnServer(null);
        return;
    }

    if (isSubscribed) {
        pushButton.textContent = 'Disable Push Messaging';
    } else {
        pushButton.textContent = 'Enable Push Messaging';
    }

    pushButton.disabled = false;
}

function subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    
    swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    })
    .then(function(subscription) {
        console.log('User is subscribed.');

        isSubscribed = true;

        updateSubscriptionOnServer(subscription);

        updateBtn();
    })
    .catch(function(err) {
        console.log('Failed to subscribe the user: ', err);
        updateBtn();
    });
}

function unsubscribeUser() {
    swRegistration.pushManager.getSubscription()
    .then(function(subscription) {
        if (subscription) {
        return subscription.unsubscribe();
        }
    })
    .catch(function(error) {
        console.log('Error unsubscribing', error);
    })
    .then(function() {
        console.log('User is unsubscribed.');
        isSubscribed = false;

        updateSubscriptionOnServer(null);

        updateBtn();
    });
}

function initialiseUI() {
    pushButton.addEventListener('click', function() {
        pushButton.disabled = true;

        if (isSubscribed) {
            unsubscribeUser();
        } else {
            subscribeUser();
        }
    });

    // Set the initial subscription value
    swRegistration.pushManager.getSubscription()
    .then(function(subscription) {
        isSubscribed = !(subscription === null);

        updateSubscriptionOnServer(subscription);

        if (isSubscribed) {
            console.log('User IS subscribed.');
        } else {
            console.log('User is NOT subscribed.');
        }

        updateBtn();
    });
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');

    navigator.serviceWorker.register('/sexy-pwa/sw.js', { scope: '/sexy-pwa/' })
    .then(function(swReg) {
        console.log('Service Worker is registered', swReg);

        swRegistration = swReg;
        initialiseUI();
    })
    .catch(function(error) {
        console.error('Service Worker Error', error);
    });
} else {
    console.warn('Push messaging is not supported');
    pushButton.textContent = 'Push Not Supported';
}
