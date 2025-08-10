// API base URL - configure according to your backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api'

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

// Simplified API functions
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
            if (!response.ok) throw new Error('Registration failed')
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
            if (!response.ok) throw new Error('Mark task failed')
            return await response.json()
        } catch (error) {
            console.warn('Mark task API failed, using local storage:', error)
            // Store locally as fallback
            const completed = JSON.parse(localStorage.getItem(`completed_${playerId}`) || '[]')
            if (!completed.includes(taskIndex)) {
                completed.push(taskIndex)
                localStorage.setItem(`completed_${playerId}`, JSON.stringify(completed))
            }
            return { success: true, taskIndex, partnerTag }
        }
    },

    // Get player's completed tasks
    getPlayerBoard: async (playerId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/players/${playerId}/board`)
            if (!response.ok) throw new Error('Get board failed')
            const data = await response.json()
            return data.completedTasks || data
        } catch (error) {
            console.warn('Get board API failed, using local storage:', error)
            return JSON.parse(localStorage.getItem(`completed_${playerId}`) || '[]')
        }
    },

    // Announce winner to backend
    announceWinner: async (playerId, winType, winIndices) => {
        try {
            const response = await fetch(`${API_BASE_URL}/players/${playerId}/win`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ winType, winIndices, timestamp: Date.now() }),
            })
            if (!response.ok) throw new Error('Announce winner failed')
            return await response.json()
        } catch (error) {
            console.warn('Announce winner API failed:', error)
            return { success: true, message: 'Winner announced locally' }
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

export default { api, utils }
