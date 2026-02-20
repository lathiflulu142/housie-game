// ==========================================
// 🚨 PASTE THE EXACT SAME KEYS HERE 🚨
// ==========================================
 const firebaseConfig = {
    apiKey: "AIzaSyBaQyf99P3TEp34hhvPZqqPeQ9VCLSQ3N0",
    authDomain: "housieapp-3dc3e.firebaseapp.com",
    projectId: "housieapp-3dc3e",
    storageBucket: "housieapp-3dc3e.firebasestorage.app",
    messagingSenderId: "709288045803",
    databaseURL: "https://housieapp-3dc3e-default-rtdb.firebaseio.com",
    appId: "1:709288045803:web:3639d923c9461192aae2ae",
    measurementId: "G-YW7N4WMX3V"
  };
// ==========================================

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let currentRoomRef = null; 

// --- JOIN ROOM ---
function joinRoom() {
    const codeInput = document.getElementById('room-code-input').value;
    
    if (codeInput.length !== 4 || isNaN(codeInput)) {
        alert("Please enter a valid 4-digit Room Code.");
        return;
    }

    currentRoomRef = db.ref('rooms/' + codeInput);

    // 1. Listen for new numbers
    currentRoomRef.child('latestNumber').on('value', (snapshot) => {
        const num = snapshot.val();
        if (num) document.getElementById('latest-called-num').innerText = num;
    });

    // 2. Listen for resets
    currentRoomRef.child('resetTrigger').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) generatePlayerTicket(); // Make new ticket if host resets
    });

    // 3. Update UI
    document.getElementById('join-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('player-room-display').innerText = codeInput;

    generatePlayerTicket();
}

// --- GENERATE TICKET ---
function generatePlayerTicket() {
    const ticketDiv = document.getElementById('player-ticket');
    ticketDiv.innerHTML = ''; 
    
    const ticketLayouts = [
        [ [1, 0, 1, 0, 1, 1, 0, 1, 0], [0, 1, 0, 1, 0, 1, 1, 0, 1], [1, 1, 0, 0, 1, 0, 0, 1, 1] ],
        [ [0, 1, 1, 0, 1, 0, 1, 0, 1], [1, 0, 0, 1, 0, 1, 0, 1, 1], [1, 1, 1, 0, 0, 0, 1, 1, 0] ],
        [ [1, 1, 0, 1, 0, 1, 0, 0, 1], [1, 0, 1, 0, 1, 0, 1, 1, 0], [0, 1, 0, 1, 1, 0, 1, 0, 1] ],
        [ [1, 0, 0, 1, 1, 1, 0, 1, 0], [0, 1, 1, 0, 0, 1, 1, 0, 1], [1, 1, 0, 1, 1, 0, 0, 1, 0] ],
        [ [0, 1, 1, 0, 1, 0, 1, 1, 0], [1, 0, 0, 1, 0, 1, 0, 1, 1], [1, 0, 1, 1, 1, 0, 1, 0, 0] ]
    ];

    const ticketPattern = ticketLayouts[Math.floor(Math.random() * ticketLayouts.length)];
    const colRanges = [[1, 9], [10, 19], [20, 29], [30, 39], [40, 49], [50, 59], [60, 69], [70, 79], [80, 90]];
    let ticketNumbers = [[], [], []];

    for (let col = 0; col < 9; col++) {
        let numbersNeeded = (ticketPattern[0][col] + ticketPattern[1][col] + ticketPattern[2][col]);
        let possibleNumbers = [];
        for (let i = colRanges[col][0]; i <= colRanges[col][1]; i++) possibleNumbers.push(i);

        let selectedForCol = [];
        for (let n = 0; n < numbersNeeded; n++) {
            selectedForCol.push(possibleNumbers.splice(Math.floor(Math.random() * possibleNumbers.length), 1)[0]);
        }
        selectedForCol.sort((a, b) => a - b); 

        let numIndex = 0;
        for (let row = 0; row < 3; row++) {
            ticketNumbers[row][col] = (ticketPattern[row][col] === 1) ? selectedForCol[numIndex++] : null;
        }
    }

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (ticketNumbers[row][col] !== null) {
                cell.innerText = ticketNumbers[row][col];
                cell.addEventListener('pointerdown', function() { this.classList.toggle('marked'); });
            } else {
                cell.classList.add('empty');
            }
            ticketDiv.appendChild(cell);
        }
    }
}

function getNewTicket() {
    if (confirm("Clear ticket and get a new one?")) generatePlayerTicket();
}

function claimPrize(prizeName) {
    alert(`You are claiming: ${prizeName}!\nYell it out!`);
}