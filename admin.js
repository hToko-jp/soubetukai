
import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const attendeeList = document.getElementById('attendeeList');
const count1 = document.getElementById('count1');
const count2 = document.getElementById('count2');
const loading = document.getElementById('loading');
const attendeeTable = document.getElementById('attendeeTable');

const rsvpRef = ref(database, 'rsvps');

onValue(rsvpRef, (snapshot) => {
    loading.classList.add('hidden');
    attendeeTable.classList.remove('hidden');

    attendeeList.innerHTML = '';
    let party1Count = 0;
    let party2Count = 0;

    if (snapshot.exists()) {
        const data = snapshot.val();
        // Convert object to array and reverse to show newest first (optional)
        const entries = Object.entries(data).reverse();

        entries.forEach(([key, value]) => {
            const row = document.createElement('tr');

            const isAttend1 = value.party1_attendance === 'attend';
            const isAttend2 = value.party2_attendance === 'attend';

            if (isAttend1) party1Count++;
            if (isAttend2) party2Count++;

            row.innerHTML = `
                <td><strong>${escapeHtml(value.name)}</strong></td>
                <td><span class="${isAttend1 ? 'status-attend' : 'status-absent'}">${isAttend1 ? '出席' : '欠席'}</span></td>
                <td><span class="${isAttend2 ? 'status-attend' : 'status-absent'}">${isAttend2 ? '出席' : '欠席'}</span></td>
                <td style="color: #666; font-size: 0.9em;">${escapeHtml(value.message || '-')}</td>
            `;
            attendeeList.appendChild(row);
        });
    } else {
        attendeeList.innerHTML = '<tr><td colspan="4" style="text-align: center;">まだ回答はありません</td></tr>';
    }

    count1.textContent = `${party1Count} 名`;
    count2.textContent = `${party2Count} 名`;
});

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
