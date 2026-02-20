// --- GENERATE RANDOM PLAYER TICKET ---
function generatePlayerTicket() {
    const ticketDiv = document.getElementById('player-ticket');
    ticketDiv.innerHTML = ''; 
    
    // The library of valid layout patterns
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

    // Distribute random numbers into the columns
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

    // Draw the ticket on the screen
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            let num = ticketNumbers[row][col];
            
            if (num !== null) {
                cell.innerText = num;
                // Add touch event for marking
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

// --- BUTTON LOGIC ---
function getNewTicket() {
    if (confirm("Are you sure you want to clear your current ticket and get a new one?")) {
        generatePlayerTicket();
    }
}

function claimPrize(prizeName) {
    // Pop up an alert for the player
    alert(`You are claiming: ${prizeName}!\n\nYell it out to the host so they can verify your numbers on the main board!`);
}
// --- JOIN ROOM LOGIC ---
// --- JOIN ROOM LOGIC ---
function joinRoom() {
    // Get what the user typed (no need for uppercase anymore)
    const codeInput = document.getElementById('room-code-input').value;
    
    // Check if they typed exactly 4 characters AND that they are numbers
    if (codeInput.length !== 4 || isNaN(codeInput)) {
        alert("Please enter a valid 4-digit Room Code.");
        return;
    }

    // 1. Hide the Join Screen
    document.getElementById('join-screen').style.display = 'none';
    
    // 2. Show the Game Screen
    document.getElementById('game-screen').style.display = 'block';
    
    // 3. Update the badge at the top
    document.getElementById('player-room-display').innerText = codeInput;

    // 4. Generate their ticket
    generatePlayerTicket();
}