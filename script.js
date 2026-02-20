// ==========================================
// 🚨 PASTE YOUR FIREBASE KEYS HERE 🚨
// ==========================================
 const firebaseConfig = {
    apiKey: "AIzaSyBaQyf99P3TEp34hhvPZqqPeQ9VCLSQ3N0",
    authDomain: "housieapp-3dc3e.firebaseapp.com",
    projectId: "housieapp-3dc3e",
    storageBucket: "housieapp-3dc3e.firebasestorage.app",
    messagingSenderId: "709288045803",
    appId: "1:709288045803:web:3639d923c9461192aae2ae",
    measurementId: "G-YW7N4WMX3V"
  };
// ==========================================

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --- STATE & ROOM SETUP ---
let numberBag = Array.from({length: 90}, (_, i) => i + 1); 
const currentNumberDisplay = document.getElementById('current-number');

function generateRoomCode() {
    const numbers = '0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return code;
}

const myRoomCode = generateRoomCode();
document.getElementById('room-code-display').innerText = myRoomCode;

// Create Firebase Room
const roomRef = db.ref('rooms/' + myRoomCode);
roomRef.set({
    latestNumber: "Ready",
    resetTrigger: Date.now()
});

// --- BOARD & TICKET SETUP ---
function setupFullBoard() {
    const fullBoard = document.getElementById('full-board');
    fullBoard.innerHTML = ''; 
    for (let i = 1; i <= 90; i++) {
        const cell = document.createElement('div');
        cell.classList.add('board-cell');
        cell.id = `board-num-${i}`;
        cell.innerText = i;
        fullBoard.appendChild(cell);
    }
}

function generateHostTicket() {
    const ticketDiv = document.getElementById('host-ticket');
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

// --- ACTIONS ---
function drawNumber() {
    if (numberBag.length === 0) return;
    const drawnNum = numberBag.splice(Math.floor(Math.random() * numberBag.length), 1)[0];
    
    currentNumberDisplay.innerText = drawnNum;
    currentNumberDisplay.style.fontSize = "60px";

    const boardCell = document.getElementById(`board-num-${drawnNum}`);
    if (boardCell) boardCell.classList.add('called');

    // Send to Firebase
    roomRef.child('latestNumber').set(drawnNum);
}

function resetGame() {
    if (!confirm("Reset game?")) return; 
    
    numberBag = Array.from({length: 90}, (_, i) => i + 1);
    currentNumberDisplay.innerText = "Go!";
    document.querySelectorAll('.board-cell').forEach(cell => cell.classList.remove('called'));
    generateHostTicket();

    // Send reset signal to Firebase
    roomRef.child('resetTrigger').set(Date.now());
    roomRef.child('latestNumber').set("Ready");
}

// --- MODAL ---
const modal = document.getElementById('board-modal');
function openModal() { modal.style.display = "flex"; }
function closeModal() { modal.style.display = "none"; }
window.onclick = function(event) { if (event.target == modal) closeModal(); }

// Initialize
setupFullBoard();
generateHostTicket();