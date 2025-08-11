import { useState, useEffect, useRef } from 'react'
import TopBar from './TopBar'
import gdscLogo from '../assets/gdsc.png'
import { api, utils, GameWebSocket } from '../utils/api'

const GameBoard = ({ playerData, onWin, onShowLeaderboard }) => {
    const [gameTimer, setGameTimer] = useState(0) // Forward counting timer from game start
    const [bingoGrid, setBingoGrid] = useState([])
    const [completedTasks, setCompletedTasks] = useState(new Set())
    const [showCardModal, setShowCardModal] = useState(null)
    const [tagInput, setTagInput] = useState('')
    const [loading, setLoading] = useState(true)
    const [playerScore, setPlayerScore] = useState(0)
    const [bingos, setBingos] = useState([])
    const [isGameActive, setIsGameActive] = useState(true)
    const [realtimeUpdates, setRealtimeUpdates] = useState([])

    const wsRef = useRef(null)

    // Colors matching the exact UI palette
    const COLORS = {
        darkNavy: '#0B083F',
        secondaryDark: '#3C3C59',
        darkGray: '#33333C',
        blue: '#3399FF',
        green: '#00BD67',
        red: '#F35154',
        yellow: '#EED202'
    }

    const cardColors = [COLORS.blue, COLORS.green, COLORS.red, COLORS.yellow]

    // Initialize game grid, load player data, and setup WebSocket
    useEffect(() => {
        const initializeGame = async () => {
            try {
                setLoading(true)

                // Fetch tasks from API
                const tasks = await api.getTasks()
                const shuffled = utils.shuffleArray(tasks).slice(0, 36)
                setBingoGrid(shuffled)

                // Load player's board state
                if (playerData?.id) {
                    const boardState = await api.getPlayerBoard(playerData.id)
                    setCompletedTasks(new Set(boardState.completedTasks || []))
                    setPlayerScore(boardState.score || 0)
                    setBingos(boardState.bingos || [])
                    setGameTimer(boardState.elapsedTime || 0)

                    // Setup WebSocket for real-time updates
                    setupWebSocket()
                }
            } catch (error) {
                console.error('Failed to initialize game:', error)
            } finally {
                setLoading(false)
            }
        }

        initializeGame()

        // Cleanup WebSocket on unmount
        return () => {
            if (wsRef.current) {
                wsRef.current.disconnect()
            }
        }
    }, [playerData])

    // Setup WebSocket connection for real-time updates
    const setupWebSocket = () => {
        if (!playerData?.id) return

        wsRef.current = new GameWebSocket(playerData.id)

        // Handle real-time board updates
        wsRef.current.on('board_update', (data) => {
            setCompletedTasks(new Set(data.completedTasks || []))
            setPlayerScore(data.score || 0)
            setBingos(data.bingos || [])
        })

        // Handle real-time leaderboard updates
        wsRef.current.on('leaderboard_update', (data) => {
            setRealtimeUpdates(prev => [...prev, {
                type: 'leaderboard',
                message: `${data.playerName} scored ${data.score} points!`,
                timestamp: Date.now()
            }])
        })

        // Handle bingo achievements
        wsRef.current.on('bingo_achieved', (data) => {
            if (data.playerId === playerData.id) {
                setBingos(prev => [...prev, data.bingo])
                setRealtimeUpdates(prev => [...prev, {
                    type: 'bingo',
                    message: `You got a ${data.bingo.type}! +${data.scoreGained} points`,
                    timestamp: Date.now()
                }])
            } else {
                setRealtimeUpdates(prev => [...prev, {
                    type: 'other_bingo',
                    message: `${data.playerName} got a ${data.bingo.type}!`,
                    timestamp: Date.now()
                }])
            }
        })

        // Handle full house completions
        wsRef.current.on('full_house_completed', (data) => {
            if (data.playerId === playerData.id) {
                setIsGameActive(false)
                onWin('fullhouse')
            } else {
                setRealtimeUpdates(prev => [...prev, {
                    type: 'full_house',
                    message: `${data.playerName} completed Full House! Final score: ${data.finalScore}`,
                    timestamp: Date.now()
                }])
            }
        })

        wsRef.current.connect()
    }

    // Forward counting timer
    useEffect(() => {
        if (!isGameActive) return

        const timer = setInterval(() => {
            setGameTimer(prev => prev + 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [isGameActive])

    const formatTime = (seconds) => {
        return utils.formatTime(seconds)
    }

    const handleTaskClick = (index) => {
        if (completedTasks.has(index)) return
        setShowCardModal(index)
    }

    const handleSaveTask = async (index) => {
        if (tagInput.trim() && playerData?.id) {
            try {
                // Validate tag first
                const validation = await api.validateTag(playerData.id, tagInput.trim())
                if (!validation.valid) {
                    alert('This tag has already been used by you or is invalid. Please use a different tag.')
                    return
                }

                // Mark task via API
                const result = await api.markTask(playerData.id, index, tagInput.trim())

                // Update local state with backend response
                const newCompletedTasks = new Set([...completedTasks, index])
                setCompletedTasks(newCompletedTasks)
                setPlayerScore(result.score || playerScore + 5)

                // Handle new bingos
                if (result.newBingos && result.newBingos.length > 0) {
                    setBingos(prev => [...prev, ...result.newBingos])
                    result.newBingos.forEach(bingo => {
                        setRealtimeUpdates(prev => [...prev, {
                            type: 'bingo',
                            message: `You got a ${bingo.type}! +${bingo.scoreBonus} points`,
                            timestamp: Date.now()
                        }])
                    })
                }

                // Check for full house
                if (newCompletedTasks.size === 36) {
                    setIsGameActive(false)
                    onWin('fullhouse')
                }

                setShowCardModal(null)
                setTagInput('')

            } catch (error) {
                console.error('Failed to mark task:', error)
                alert('Failed to save task. Please try again.')
            }
        }
    }

    const getTaskColor = (index) => {
        return cardColors[index % cardColors.length]
    }

    const isTaskInBingo = (index) => {
        return bingos.some(bingo => bingo.indices.includes(index))
    }

    return (
        <div className="min-h-screen relative" style={{ backgroundColor: COLORS.darkNavy }}>
            <TopBar
                playerData={playerData}
                showLeaderboard={true}
                onShowLeaderboard={onShowLeaderboard}
            />

            {/* Header with Timer and Score */}
            <div className="text-center py-6 pt-20">
                <div className="text-white text-5xl font-light mb-2">{formatTime(gameTimer)}</div>
                <div className="text-white text-xl mb-2">Score: {playerScore}</div>
                <div className="text-white text-sm">
                    Bingos: {bingos.length} | Tasks: {completedTasks.size}/36
                </div>
            </div>

            {/* Real-time Updates */}
            {realtimeUpdates.length > 0 && (
                <div className="fixed top-20 right-4 z-50 max-w-xs space-y-2">
                    {realtimeUpdates.slice(-3).map((update, idx) => (
                        <div
                            key={idx}
                            className={`p-3 rounded-lg text-sm animate-pulse ${update.type === 'bingo' ? 'bg-green-600' :
                                    update.type === 'full_house' ? 'bg-yellow-600' :
                                        'bg-blue-600'
                                } text-white`}
                        >
                            {update.message}
                        </div>
                    ))}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="text-white text-xl">Loading tasks...</div>
                </div>
            ) : (
                <>
                    {/* Game Grid */}
                    <div className="flex justify-center px-4">
                        <div className="grid grid-cols-6 gap-1 max-w-sm">
                            {bingoGrid.map((task, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleTaskClick(index)}
                                    className={`relative aspect-square w-12 h-12 cursor-pointer transition-all duration-200 ${isTaskInBingo(index) ? 'ring-2 ring-yellow-400' : ''
                                        }`}
                                    style={{
                                        backgroundColor: completedTasks.has(index)
                                            ? COLORS.secondaryDark
                                            : COLORS.secondaryDark,
                                        border: completedTasks.has(index)
                                            ? `2px solid ${getTaskColor(index)}`
                                            : `1px solid ${COLORS.darkGray}`
                                    }}
                                >
                                    {/* Completed tasks show GDSC logo */}
                                    {completedTasks.has(index) && (
                                        <div className="flex items-center justify-center h-full">
                                            <img
                                                src={gdscLogo}
                                                alt="GDSC"
                                                className="w-5 h-5 object-contain"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Card Modal */}
                    {showCardModal !== null && (
                        <div
                            className="fixed inset-0 flex items-center justify-center p-4 z-50"
                            style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
                        >
                            <div
                                className="rounded-2xl p-8 w-full max-w-md text-center relative"
                                style={{ backgroundColor: getTaskColor(showCardModal) }}
                            >
                                {/* Back Button */}
                                <button
                                    onClick={() => {
                                        setShowCardModal(null)
                                        setTagInput('')
                                    }}
                                    className="absolute top-4 left-4 bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-30 transition-all"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        style={{ color: "black" }}
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>

                                </button>

                                <h3 className="text-white text-xl font-bold mb-6 leading-relaxed mt-4">
                                    {bingoGrid[showCardModal]}
                                </h3>

                                {/* Tag Input Field */}
                                <div className="mb-6">
                                    <input
                                        type="text"
                                        placeholder="Enter friend's tag"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-500 border-2 border-white focus:outline-none focus:border-gray-200"
                                    />
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => {
                                            setShowCardModal(null)
                                            setTagInput('')
                                        }}
                                        className="flex-1 bg-white bg-opacity-20 text-black py-3 px-6 rounded-xl font-medium hover:bg-opacity-30 transition-all"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={() => handleSaveTask(showCardModal)}
                                        disabled={!tagInput.trim()}
                                        className="flex-1 bg-white text-gray-800 py-3 px-6 rounded-xl font-medium hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Save Task
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default GameBoard
