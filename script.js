// --- 1. GENERATE NUMERIC ROOM CODE ---
function generateRoomCode() {
    const numbers = '0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return code;
}

// Automatically generate and display the code when the page loads
const myRoomCode = generateRoomCode();
document.getElementById('room-code-display').innerText = myRoomCode;

// ... (Keep the rest of your state variables, setupFullBoard, drawNumber, etc. below this)
let numberBag = Array.from({length: 90}, (_, i) => i + 1); 
const currentNumberDisplay = document.getElementById('current-number');

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

    const randomLayoutIndex = Math.floor(Math.random() * ticketLayouts.length);
    const ticketPattern = ticketLayouts[randomLayoutIndex];

    const colRanges = [
        [1, 9], [10, 19], [20, 29], [30, 39], [40, 49], 
        [50, 59], [60, 69], [70, 79], [80, 90]
    ];

    let ticketNumbers = [[], [], []];

    for (let col = 0; col < 9; col++) {
        let numbersNeeded = 0;
        if (ticketPattern[0][col] === 1) numbersNeeded++;
        if (ticketPattern[1][col] === 1) numbersNeeded++;
        if (ticketPattern[2][col] === 1) numbersNeeded++;

        let min = colRanges[col][0];
        let max = colRanges[col][1];
        let possibleNumbers = [];
        for (let i = min; i <= max; i++) possibleNumbers.push(i);

        let selectedForCol = [];
        for (let n = 0; n < numbersNeeded; n++) {
            let randomIndex = Math.floor(Math.random() * possibleNumbers.length);
            selectedForCol.push(possibleNumbers.splice(randomIndex, 1)[0]);
        }
        selectedForCol.sort((a, b) => a - b); 

        let numIndex = 0;
        for (let row = 0; row < 3; row++) {
            if (ticketPattern[row][col] === 1) {
                ticketNumbers[row][col] = selectedForCol[numIndex];
                numIndex++;
            } else {
                ticketNumbers[row][col] = null; 
            }
        }
    }

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            let num = ticketNumbers[row][col];
            if (num !== null) {
                cell.innerText = num;
                // Add touch event for faster mobile response
                cell.addEventListener('pointerdown', function() {
                    this.classList.toggle('marked');
                });
            } else {
                cell.classList.add('empty');
            }
            ticketDiv.appendChild(cell);
        }
    }
}

function drawNumber() {
    if (numberBag.length === 0) {
        currentNumberDisplay.innerText = "Done";
        currentNumberDisplay.style.fontSize = "40px"; // Shrink text to fit
        return;
    }

    const randomIndex = Math.floor(Math.random() * numberBag.length);
    const drawnNum = numberBag.splice(randomIndex, 1)[0];

    currentNumberDisplay.innerText = drawnNum;
    currentNumberDisplay.style.fontSize = "60px";

    const boardCell = document.getElementById(`board-num-${drawnNum}`);
    if (boardCell) {
        boardCell.classList.add('called');
    }
}

const modal = document.getElementById('board-modal');
function openModal() { modal.style.display = "flex"; }
function closeModal() { modal.style.display = "none"; }
window.onclick = function(event) { if (event.target == modal) closeModal(); }

function resetGame() {
    if (!confirm("Reset game?")) return; 
    numberBag = Array.from({length: 90}, (_, i) => i + 1);
    currentNumberDisplay.innerText = "Go!";
    currentNumberDisplay.style.fontSize = "60px";
    
    document.querySelectorAll('.board-cell').forEach(cell => cell.classList.remove('called'));
    generateHostTicket();
}

setupFullBoard();
generateHostTicket();