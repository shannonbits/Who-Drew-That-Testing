// Player configuration
let playerConfig = {
    id: generateId(),
    name: "Anonymous",
    avatar: {
        style: "simple",
        color: "#6a5acd",
        accessory: "none"
    }
};

// DOM elements
const usernameInput = document.getElementById('usernameInput');
const avatarStyle = document.getElementById('avatarStyle');
const avatarColor = document.getElementById('avatarColor');
const avatarAccessory = document.getElementById('avatarAccessory');
const avatarPreview = document.getElementById('avatarPreview');
const joinRoomBtn = document.getElementById('joinRoomBtn');
const createRoomBtn = document.getElementById('createRoomBtn');
const roomCodeInput = document.getElementById('roomCodeInput');
const roomInfo = document.getElementById('roomInfo');
const roomCodeDisplay = document.getElementById('roomCodeDisplay');
const startGameBtn = document.getElementById('startGameBtn');

// Initialize lobby
function initLobby() {
    initCustomization();
    setupEventListeners();
    
    // Check for room ID in URL
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room');
    if (roomId) {
        roomCodeInput.value = roomId;
    }
}

function initCustomization() {
    // Event listeners for changes
    usernameInput.addEventListener('input', updatePlayerConfig);
    avatarStyle.addEventListener('change', updatePlayerConfig);
    avatarColor.addEventListener('input', updatePlayerConfig);
    avatarAccessory.addEventListener('change', updatePlayerConfig);
    
    // Initial render
    updatePlayerConfig();
}

function updatePlayerConfig() {
    playerConfig = {
        ...playerConfig,
        name: usernameInput.value.trim() || "Anonymous",
        avatar: {
            style: avatarStyle.value,
            color: avatarColor.value,
            accessory: avatarAccessory.value
        }
    };
    renderAvatar();
}

function renderAvatar() {
    // Clear previous avatar
    avatarPreview.innerHTML = '';
    
    // Create canvas for avatar
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    // Draw avatar based on configuration
    drawAvatar(ctx, playerConfig.avatar);
    
    // Add to preview
    avatarPreview.appendChild(canvas);
}

function drawAvatar(ctx, avatar) {
    // Same avatar drawing code as before
    // ...
}

function setupEventListeners() {
    joinRoomBtn.addEventListener('click', joinRoom);
    createRoomBtn.addEventListener('click', createRoom);
    startGameBtn.addEventListener('click', startGame);
}

function createRoom() {
    if (!playerConfig.name) {
        alert("Please enter your name first!");
        return;
    }

    const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
    roomCodeDisplay.textContent = roomCode;
    document.querySelector('.room-options').style.display = 'none';
    roomInfo.style.display = 'block';

    // Store player config in session storage for game page
    sessionStorage.setItem('playerConfig', JSON.stringify(playerConfig));
    sessionStorage.setItem('isHost', 'true');
    sessionStorage.setItem('roomCode', roomCode);

    // Initialize room in Firebase
    database.ref(`rooms/${roomCode}`).set({
        gameState: {
            gameStarted: false,
            currentDrawer: null,
            currentWord: "",
            roundTime: 60
        },
        players: {},
        drawing: null,
        chat: null
    }).then(() => {
        // Add the host to the room
        addPlayerToRoom(roomCode);
    }).catch(error => {
        console.error("Error creating room:", error);
        alert("Error creating room. Please try again.");
    });
}

function joinRoom() {
    if (!playerConfig.name) {
        alert("Please enter your name first!");
        return;
    }

    const roomCode = roomCodeInput.value.trim();
    if (!roomCode) {
        alert("Please enter a room code!");
        return;
    }

    // Store player config in session storage for game page
    sessionStorage.setItem('playerConfig', JSON.stringify(playerConfig));
    sessionStorage.setItem('isHost', 'false');
    sessionStorage.setItem('roomCode', roomCode);

    // Check if room exists
    database.ref(`rooms/${roomCode}`).once('value').then(snapshot => {
        if (snapshot.exists()) {
            // Redirect to game page
            window.location.href = `game.html?room=${roomCode}`;
        } else {
            alert("Room not found! Please check the code and try again.");
        }
    }).catch(error => {
        console.error("Error joining room:", error);
        alert("Error joining room. Please try again.");
    });
}

function addPlayerToRoom(roomCode) {
    const playerRef = database.ref(`rooms/${roomCode}/players/${playerConfig.id}`);
    
    playerRef.set({
        name: playerConfig.name,
        avatar: playerConfig.avatar,
        score: 0,
        isDrawing: false
    });

    // Remove player when they disconnect
    playerRef.onDisconnect().remove();
}

function startGame() {
    const roomCode = sessionStorage.getItem('roomCode');
    if (!roomCode) return;

    // Update game state to started
    database.ref(`rooms/${roomCode}/gameState`).update({
        gameStarted: true
    }).then(() => {
        // Redirect to game page
        window.location.href = `game.html?room=${roomCode}`;
    });
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Start the lobby
initLobby();
