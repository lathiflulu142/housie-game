const firebaseConfig = {
  apiKey: "AIzaSyBaQyf99P3TEp34hhvPZqqPeQ9VCLSQ3N0",
  authDomain: "housieapp-3dc3e.firebaseapp.com",
  databaseURL: "https://housieapp-3dc3e-default-rtdb.firebaseio.com",
  projectId: "housieapp-3dc3e",
  storageBucket: "housieapp-3dc3e.firebasestorage.app",
  messagingSenderId: "709288045803",
  appId: "1:709288045803:web:3639d923c9461192aae2ae",
  measurementId: "G-YW7N4WMX3V"
};



// The rest of the game code starts down here...

// The rest of the game code starts down here...
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let currentRoomRef = null; 

function joinRoom() {
    const codeInput = document.getElementById('room-code-input').value;
    
    if (codeInput.length !== 4 || isNaN(codeInput)) {
        alert("Please enter a valid 4-digit Room Code.");
        return;
    }

    currentRoomRef = db.ref('rooms/' + codeInput);

    // Player Counting Magic
    const playerId = "player_" + Date.now();
    const myPlayerRef = currentRoomRef.child('players/' + playerId);
    myPlayerRef.set(true); 
    myPlayerRef.onDisconnect().remove(); 

    // Listen for Numbers
    currentRoomRef.child('latestNumber').on('value', (snapshot) => {
        const num = snapshot.val();
        if (num && num !== "Ready") {
            document.getElementById('latest-called-num').innerText = num;
            const boardCell = document.getElementById(`board-num-${num}`);
            if (boardCell) boardCell.classList.add('called');
        }
    });

    // Listen for Resets
    currentRoomRef.child('resetTrigger').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            generatePlayerTicket(); 
            document.getElementById('latest-called-num').innerText = "Waiting...";
            document.querySelectorAll('.board-cell').forEach(cell => cell.classList.remove('called'));
        }
    });

    // Switch Screens
    document.getElementById('join-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('player-room-display').innerText = codeInput;

    generatePlayerTicket();
}

function generatePlayerTicket() {
    const ticketDiv = document.getElementById('player-ticket');
    if (!ticketDiv) return;
    ticketDiv.innerHTML = ''; 
    
    const ticketLayouts = [
        [ [1, 0, 1, 0, 1, 1, 0, 1, 0], [0, 1, 0, 1, 0, 1, 1, 0, 1], [1, 1, 0, 0, 1, 0, 0, 1, 1] ],
        [ [0, 1, 1, 0, 1, 0, 1, 0, 1], [1, 0, 0, 1, 0, 1, 0, 1, 1], [1, 1, 1, 0, 0, 0, 1, 1, 0] ],
        [ [1, 1, 0, 1, 0, 1, 0, 0, 1], [1, 0, 1, 0, 1, 0, 1, 1, 0], [0, 1, 0, 1, 1, 0, 1, 0, 1] ],
        [ [1, 0, 0, 1, 1, 1, 0, 1, 0], [0, 1, 1, 0, 0, 1, 1, 0, 1], [1, 1, 0, 1, 1, 0, 0, 1, 0] ]
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

setupFullBoard();