
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Handle form submission
const rsvpForm = document.getElementById('rsvpForm');
const successMessage = document.getElementById('successMessage');

rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(rsvpForm);
    const name = formData.get('name');
    const party1 = formData.get('party1');
    const party2 = formData.get('party2');
    const message = formData.get('message');

    // Create a new post reference with an auto-generated id
    const rsvpRef = ref(database, 'rsvps');

    push(rsvpRef, {
        name: name,
        party1_attendance: party1, // 'attend' or 'absent'
        party2_attendance: party2, // 'attend' or 'absent'
        message: message,
        timestamp: serverTimestamp()
    })
        .then(() => {
            // Success
            rsvpForm.classList.add('hidden');
            successMessage.classList.remove('hidden');
            console.log("RSVP submitted successfully");
        })
        .catch((error) => {
            // Error
            console.error("Error writing new message to Firebase Database", error);
            alert("送信に失敗しました。もう一度お試しください。\n" + error.message);
        });
});
