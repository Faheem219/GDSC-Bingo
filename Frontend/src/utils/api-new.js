// API base URL - configure according to your backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001'

// Fallback tasks for development when API fails
const FALLBACK_TASKS = [
    "Find someone who can whistle",
    "Find someone who knows Python",
    "Find someone from Delhi",
    "Find someone who plays guitar",
    "Find someone who loves coffee",
    "Find someone who can speak 3+ languages",
    "Find someone who has traveled abroad",
    "Find someone who is left-handed",
    "Find someone who loves reading",
    "Find someone who can cook well",
    "Find someone who plays sports",
    "Find someone who loves photography",
    "Find someone who is an early bird",
    "Find someone who loves movies",
    "Find someone who can dance",
    "Find someone who loves gaming",
    "Find someone who has a pet",
    "Find someone who loves hiking",
    "Find someone who knows AI/ML",
    "Find someone who loves art",
    "Find someone who can sing",
    "Find someone who loves music",
    "Find someone who is studying CS",
    "Find someone who loves memes",
    "Find someone who uses Linux",
    "Find someone who loves anime",
    "Find someone from Mumbai",
    "Find someone who codes daily",
    "Find someone who loves tea",
    "Find someone who can drive",
    "Find someone who loves nature",
    "Find someone who plays chess",
    "Find someone who loves books",
    "Find someone who knows React",
    "Find someone who loves writing",
    "Find someone who can swim"
]

// WebSocket manager for real-time updates
class GameWebSocket {
    constructor(playerId) {
        this.playerId = playerId
        this.socket = null
        this.eventHandlers = {}
        this.reconnectAttempts = 0
        this.maxReconnectAttempts = 5
    }

    connect() {
        try {
            this.socket = new WebSocket(`${WS_BASE_URL}/ws/${this.playerId}`)

            this.socket.onopen = () => {
                console.log('Connected to game WebSocket')
                this.reconnectAttempts = 0
                this.emit('connected')
            }

            this.socket.onmessage = (event) => {
                const data = JSON.parse(event.data)
                this.emit(data.type, data.data)
            }

            this.socket.onclose = () => {
                console.log('Disconnected from game WebSocket')
                this.emit('disconnected')
                this.handleReconnect()
            }

            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error)
                this.emit('error', error)
            }
        } catch (error) {
            console.error('Failed to connect WebSocket:', error)
        }
    }

    handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++
            setTimeout(() => {
                console.log(`Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
                this.connect()
            }, 2000 * this.reconnectAttempts)
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close()
            this.socket = null
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

// Enhanced API functions
export const api = {
    // Register player for the session
    registerPlayer: async (playerData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/players/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(playerData),
            })
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.detail || 'Registration failed')
            }
            return await response.json()
        } catch (error) {
            console.warn('Registration API failed, using local data:', error)
            return { success: true, player: playerData }
        }
    },

    // Get the 36 bingo tasks (same for all players)
    getTasks: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks`)
            if (!response.ok) throw new Error('Tasks fetch failed')
            const data = await response.json()
            return data.tasks || data
        } catch (error) {
            console.warn('Tasks API failed, using fallback tasks:', error)
            return FALLBACK_TASKS
        }
    },

    // Validate a tag before using it
    validateTag: async (playerId, tag) => {
        try {
            const response = await fetch(`${API_BASE_URL}/players/${playerId}/validate-tag/${encodeURIComponent(tag)}`)
            if (!response.ok) throw new Error('Tag validation failed')
            return await response.json()
        } catch (error) {
            console.warn('Tag validation API failed:', error)
            return { valid: true } // Assume valid if API fails
        }
    },

    // Mark a task as completed for the player
    markTask: async (playerId, taskIndex, partnerTag) => {
        try {
            const response = await fetch(`${API_BASE_URL}/players/${playerId}/tasks/${taskIndex}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ partnerTag }),
            })
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.detail || 'Mark task failed')
            }
            return await response.json()
        } catch (error) {
            console.warn('Mark task API failed, using local storage:', error)
            // Store locally as fallback
            const completed = JSON.parse(localStorage.getItem(`completed_${playerId}`) || '[]')
            if (!completed.includes(taskIndex)) {
                completed.push(taskIndex)
                localStorage.setItem(`completed_${playerId}`, JSON.stringify(completed))
            }
            return { success: true, taskIndex, partnerTag, newBingos: [], score: 0 }
        }
    },

    // Get player's board state
    getPlayerBoard: async (playerId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/players/${playerId}/board`)
            if (!response.ok) throw new Error('Get board failed')
            return await response.json()
        } catch (error) {
            console.warn('Get board API failed, using local storage:', error)
            return {
                completedTasks: JSON.parse(localStorage.getItem(`completed_${playerId}`) || '[]'),
                usedTags: [],
                bingos: [],
                score: 0,
                elapsedTime: 0
            }
        }
    },

    // Get current leaderboard
    getLeaderboard: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/leaderboard`)
            if (!response.ok) throw new Error('Leaderboard fetch failed')
            return await response.json()
        } catch (error) {
            console.warn('Leaderboard API failed:', error)
            return { leaderboard: [] }
        }
    },

    // Get game statistics
    getGameStats: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/game/stats`)
            if (!response.ok) throw new Error('Game stats fetch failed')
            return await response.json()
        } catch (error) {
            console.warn('Game stats API failed:', error)
            return {
                totalPlayers: 0,
                totalTasksCompleted: 0,
                totalBingos: 0,
                fullHouseCount: 0,
                fullHouseCompletions: []
            }
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
        const hours = Math.floor(seconds / 3600)
        const mins = Math.floor((seconds % 3600) / 60)
        const secs = Math.floor(seconds % 60)

        if (hours > 0) {
            return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`
    },

    checkBingoWin: (completedIndices, gridSize = 6) => {
        const completed = new Set(completedIndices)
        const wins = []

        // Check rows
        for (let row = 0; row < gridSize; row++) {
            const rowIndices = Array.from({ length: gridSize }, (_, col) => row * gridSize + col)
            if (rowIndices.every(index => completed.has(index))) {
                wins.push({ type: 'row', indices: rowIndices })
            }
        }

        // Check columns
        for (let col = 0; col < gridSize; col++) {
            const colIndices = Array.from({ length: gridSize }, (_, row) => row * gridSize + col)
            if (colIndices.every(index => completed.has(index))) {
                wins.push({ type: 'column', indices: colIndices })
            }
        }

        // Check diagonals
        const diagonal1 = Array.from({ length: gridSize }, (_, i) => i * gridSize + i)
        const diagonal2 = Array.from({ length: gridSize }, (_, i) => i * gridSize + (gridSize - 1 - i))

        if (diagonal1.every(index => completed.has(index))) {
            wins.push({ type: 'diagonal', indices: diagonal1 })
        }

        if (diagonal2.every(index => completed.has(index))) {
            wins.push({ type: 'diagonal', indices: diagonal2 })
        }

        // Check full house
        if (completed.size === gridSize * gridSize) {
            wins.push({ type: 'fullhouse', indices: Array.from(completed) })
        }

        return wins
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

export { GameWebSocket }
export default { api, utils, GameWebSocket }
