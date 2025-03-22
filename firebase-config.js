<script type="module">
  // Import Firebase modules
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAaMekZ92zvn3ifO79RXraZQGhu3dmKEVU",
    authDomain: "eyeshield-admin.firebaseapp.com",
    projectId: "eyeshield-admin",
    storageBucket: "eyeshield-admin.firebasestorage.app",
    messagingSenderId: "837501923255",
    appId: "1:837501923255:web:89b398f584439525a7c232"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  export { auth, db };
</script>