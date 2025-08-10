// API base URL - configure according to your backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api'

// API helper functions
export const api = {
    // Authentication & User Management
    registerPlayer: async (playerData) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerData),
        })
        return response.json()
    },

    verifyPlayer: async (token) => {
        const response = await fetch(`${API_BASE_URL}/auth/verify/${token}`)
        return response.json()
    },

    getPlayer: async (playerId) => {
        const response = await fetch(`${API_BASE_URL}/players/${playerId}`)
        return response.json()
    },

    // Game Management
    getGames: async () => {
        const response = await fetch(`${API_BASE_URL}/games`)
        return response.json()
    },

    createGame: async (gameData) => {
        const response = await fetch(`${API_BASE_URL}/games`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gameData),
        })
        return response.json()
    },

    getGame: async (gameId) => {
        const response = await fetch(`${API_BASE_URL}/games/${gameId}`)
        return response.json()
    },

    joinGame: async (gameId, playerData) => {
        const response = await fetch(`${API_BASE_URL}/games/${gameId}/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerData),
        })
        return response.json()
    },

    leaveGame: async (gameId, playerId) => {
        const response = await fetch(`${API_BASE_URL}/games/${gameId}/leave`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ playerId }),
        })
        return response.json()
    },

    // Bingo Cards & Tasks
    getCardTemplates: async () => {
        const response = await fetch(`${API_BASE_URL}/cards/templates`)
        return response.json()
    },

    getCard: async (cardId) => {
        const response = await fetch(`${API_BASE_URL}/cards/${cardId}`)
        return response.json()
    },

    generateCard: async (playerData) => {
        const response = await fetch(`${API_BASE_URL}/cards/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerData),
        })
        return response.json()
    },

    getTasks: async () => {
        const response = await fetch(`${API_BASE_URL}/tasks`)
        return response.json()
    },

    // Game Actions
    markTask: async (gameId, taskData) => {
        const response = await fetch(`${API_BASE_URL}/games/${gameId}/mark-task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        })
        return response.json()
    },

    getPlayerBoard: async (gameId, playerId) => {
        const response = await fetch(`${API_BASE_URL}/games/${gameId}/board/${playerId}`)
        return response.json()
    },

    verifyTaskCompletion: async (gameId, verificationData) => {
        const response = await fetch(`${API_BASE_URL}/games/${gameId}/verify-completion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(verificationData),
        })
        return response.json()
    },

    getLeaderboard: async (gameId) => {
        const response = await fetch(`${API_BASE_URL}/games/${gameId}/leaderboard`)
        return response.json()
    },
}

// WebSocket helper for real-time updates
export class GameWebSocket {
    constructor(gameId) {
        this.gameId = gameId
        this.socket = null
        this.eventHandlers = {}
    }

    connect() {
        const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:3001'
        this.socket = new WebSocket(`${WS_BASE_URL}/ws/games/${this.gameId}`)

        this.socket.onopen = () => {
            console.log('Connected to game WebSocket')
            this.emit('connected')
        }

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data)
            this.emit(data.type, data.payload)
        }

        this.socket.onclose = () => {
            console.log('Disconnected from game WebSocket')
            this.emit('disconnected')
        }

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error)
            this.emit('error', error)
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close()
            this.socket = null
        }
    }

    send(type, payload) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type, payload }))
        }
    }

    on(event, handler) {
        if (!this.eventHandlers[event]) {
            this.eventHandlers[event] = []
        }
        this.eventHandlers[event].push(handler)
    }

    off(event, handler) {
        if (this.eventHandlers[event]) {
            this.eventHandlers[event] = this.eventHandlers[event].filter(h => h !== handler)
        }
    }

    emit(event, data) {
        if (this.eventHandlers[event]) {
            this.eventHandlers[event].forEach(handler => handler(data))
        }
    }
}

// Utility functions
export const utils = {
    generatePlayerTag: (name) => {
        const firstName = name.split(' ')[0]
        const randomSuffix = Math.random().toString(36).substr(2, 4).toUpperCase()
        return `${firstName}-${randomSuffix}`
    },

    generatePlayerId: () => {
        return `GDSC${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    },

    formatTime: (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    },

    checkBingoWin: (completedIndices, gridSize = 6) => {
        const completed = new Set(completedIndices)

        // Check rows
        for (let row = 0; row < gridSize; row++) {
            const rowIndices = Array.from({ length: gridSize }, (_, col) => row * gridSize + col)
            if (rowIndices.every(index => completed.has(index))) {
                return { type: 'row', indices: rowIndices }
            }
        }

        // Check columns
        for (let col = 0; col < gridSize; col++) {
            const colIndices = Array.from({ length: gridSize }, (_, row) => row * gridSize + col)
            if (colIndices.every(index => completed.has(index))) {
                return { type: 'column', indices: colIndices }
            }
        }

        // Check diagonals
        const diagonal1 = Array.from({ length: gridSize }, (_, i) => i * gridSize + i)
        const diagonal2 = Array.from({ length: gridSize }, (_, i) => i * gridSize + (gridSize - 1 - i))

        if (diagonal1.every(index => completed.has(index))) {
            return { type: 'diagonal', indices: diagonal1 }
        }

        if (diagonal2.every(index => completed.has(index))) {
            return { type: 'diagonal', indices: diagonal2 }
        }

        // Check full house
        if (completed.size === gridSize * gridSize) {
            return { type: 'fullhouse', indices: Array.from(completed) }
        }

        return null
    },

    shuffleArray: (array) => {
        const shuffled = [...array]
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        return shuffled
    },

    validateMobileNumber: (mobile) => {
        const mobileRegex = /^[6-9]\d{9}$/
        return mobileRegex.test(mobile)
    },

    validatePlayerName: (name) => {
        return name.trim().length >= 2 && name.trim().length <= 50
    }
}

export default { api, GameWebSocket, utils }
