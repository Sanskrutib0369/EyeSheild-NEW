import { auth } from './firebase-config.js';

// Test Firebase connection
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('User is signed in:', user.email);
    } else {
        console.log('No user is signed in');
        window.location.href = 'login.html';
    }
});
