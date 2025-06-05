// Game state
let gameState = {
    roomId: null,
    players: {},
    currentDrawer: null,
    currentWord: "",
    roundTime: 60,
    scores: {},
    gameStarted: false,
    timer: null
};

// Player configuration
let playerConfig = JSON.parse(sessionStorage.getItem('playerConfig')) || {
    id: generateId(),
    name: "Anonymous",
    avatar: {
        style: "simple",
        color: "#6a5acd",
        accessory: "none"
    },
    score: 0,
    isDrawing: false
};

const isHost = sessionStorage.getItem('isHost') === 'true';

// DOM elements
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
// ... (other DOM elements same as before)

// Initialize game
function initGame() {
    // Get room ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    gameState.roomId = urlParams.get('room');

    if (!gameState.roomId) {
        alert("No room specified! Returning to lobby.");
        window.location.href = "index.html";
        return;
    }

    initCanvas();
    setupEventListeners();
    setupRoomListeners();
    addPlayerToRoom();
}

// Rest of game.js remains the same as before for drawing, chat, etc.
// Just make sure to update the playerConfig with the one from sessionStorage
