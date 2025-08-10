import { useState, useEffect } from 'react'
import TopBar from './TopBar'
import gdscLogo from '../assets/gdsc.png'
import { api, utils } from '../utils/api'

const GameBoard = ({ playerData, onWin }) => {
    const [gameTimer, setGameTimer] = useState(60) // 1 minute in seconds for demo
    const [bingoGrid, setBingoGrid] = useState([])
    const [completedTasks, setCompletedTasks] = useState(new Set())
    const [showCardModal, setShowCardModal] = useState(null)
    const [tagInput, setTagInput] = useState('')
    const [loading, setLoading] = useState(true)

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

    // Initialize game grid and load player data
    useEffect(() => {
        const initializeGame = async () => {
            try {
                setLoading(true)

                // Fetch tasks from API
                const tasks = await api.getTasks()
                const shuffled = utils.shuffleArray(tasks).slice(0, 36)
                setBingoGrid(shuffled)

                // Load player's completed tasks
                if (playerData?.id) {
                    const completedTaskIndices = await api.getPlayerBoard(playerData.id)
                    setCompletedTasks(new Set(completedTaskIndices))
                }
            } catch (error) {
                console.error('Failed to initialize game:', error)
            } finally {
                setLoading(false)
            }
        }

        initializeGame()
    }, [playerData])

    // Timer countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setGameTimer(prev => {
                if (prev <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handleTaskClick = (index) => {
        if (completedTasks.has(index)) return
        setShowCardModal(index)
    }

    const handleSaveTask = async (index) => {
        if (tagInput.trim() && playerData?.id) {
            try {
                // Mark task via API
                await api.markTask(playerData.id, index, tagInput.trim())

                // Update local state
                const newCompletedTasks = new Set([...completedTasks, index])
                setCompletedTasks(newCompletedTasks)
                setShowCardModal(null)
                setTagInput('')

                // Check for win conditions with updated state
                checkWinConditions(newCompletedTasks)
            } catch (error) {
                console.error('Failed to mark task:', error)
                alert('Failed to save task. Please try again.')
            }
        }
    }

    const getTaskColor = (index) => {
        return cardColors[index % cardColors.length]
    }

    const checkWinConditions = async (currentCompletedTasks = completedTasks) => {
        const gridSize = 6
        const completed = Array.from(currentCompletedTasks)

        // Use utils function to check for wins
        const winResult = utils.checkBingoWin(completed, gridSize)

        if (winResult) {
            try {
                // Announce winner to backend
                if (playerData?.id) {
                    await api.announceWinner(playerData.id, winResult.type, winResult.indices)
                }
                onWin(winResult.type)
            } catch (error) {
                console.error('Failed to announce winner:', error)
                // Still trigger win locally even if API fails
                onWin(winResult.type)
            }
        }
    }

    return (
        <div className="min-h-screen relative" style={{ backgroundColor: COLORS.darkNavy }}>
            <TopBar playerData={playerData} />

            {/* Header with Timer */}
            <div className="text-center py-8 pt-20">
                <div className="text-white text-6xl font-light">{formatTime(gameTimer)}</div>
            </div>

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
                                    className="relative aspect-square w-12 h-12 cursor-pointer transition-all duration-200"
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
