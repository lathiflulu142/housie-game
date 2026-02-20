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

function joinRoom() {
    // 1. Listen for new numbers & highlight them on the popup board
    currentRoomRef.child('latestNumber').on('value', (snapshot) => {
        const num = snapshot.val();
        if (num && num !== "Ready") {
            // Show the big number
            document.getElementById('latest-called-num').innerText = num;
            
            // Highlight it green on the 1-90 board
            const boardCell = document.getElementById(`board-num-${num}`);
            if (boardCell) boardCell.classList.add('called');
        }
    });

    // 2. Listen for resets
    currentRoomRef.child('resetTrigger').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            generatePlayerTicket(); // Give them a fresh ticket
            
            // Clear the "Host Called" text
            document.getElementById('latest-called-num').innerText = "Waiting...";
            
            // Remove all green highlights from the 1-90 board
            document.querySelectorAll('.board-cell').forEach(cell => cell.classList.remove('called'));
        }
    });
    }

    currentRoomRef = db.ref('rooms/' + codeInput);

    // --- NEW: PLAYER COUNTING LOGIC ---
    // 1. Create a unique random ID for this specific player
    const playerId = "player_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    const myPlayerRef = currentRoomRef.child('players/' + playerId);

    // 2. Add them to the room in Firebase
    myPlayerRef.set(true);

    // 3. MAGIC: Tell Firebase to delete them automatically if they close the app!
    myPlayerRef.onDisconnect().remove();
    // ----------------------------------

    // (Keep your existing listeners below this...)
    currentRoomRef.child('latestNumber').on('value', (snapshot) => {
        const num = snapshot.val();
        if (num) document.getElementById('latest-called-num').innerText = num;
    });

    currentRoomRef.child('resetTrigger').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) generatePlayerTicket(); 
    });

    document.getElementById('join-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('player-room-display').innerText = codeInput;

    generatePlayerTicket();


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

function claimPrize(prizeName) {
    alert(`You are claiming: ${prizeName}!\nYell it out!`);
}
// --- FULL BOARD & MODAL LOGIC ---
function setupFullBoard() {
    const fullBoard = document.getElementById('full-board');
    if (!fullBoard) return;
    fullBoard.innerHTML = ''; 
    for (let i = 1; i <= 90; i++) {
        const cell = document.createElement('div');
        cell.classList.add('board-cell');
        cell.id = `board-num-${i}`;
        cell.innerText = i;
        fullBoard.appendChild(cell);
    }
}

const modal = document.getElementById('board-modal');
function openModal() { modal.style.display = "flex"; }
function closeModal() { modal.style.display = "none"; }
window.onclick = function(event) { if (event.target == modal) closeModal(); }

// Initialize the board as soon as the file loads
setupFullBoard();