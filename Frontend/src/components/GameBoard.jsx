import { useState, useEffect } from 'react'
import TopBar from './TopBar'
import gdscLogo from '../assets/gdsc.png'

const GameBoard = ({ playerData, onWin }) => {
    const [gameTimer, setGameTimer] = useState(60) // 1 minute in seconds for demo
    const [bingoGrid, setBingoGrid] = useState([])
    const [completedTasks, setCompletedTasks] = useState(new Set())
    const [showCardModal, setShowCardModal] = useState(null)
    const [tagInput, setTagInput] = useState('')

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

    // Sample bingo tasks - in real app, fetch from API /api/tasks
    const sampleTasks = [
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

    // Initialize game grid
    useEffect(() => {
        // Shuffle and select 36 tasks for 6x6 grid
        const shuffled = [...sampleTasks].sort(() => Math.random() - 0.5).slice(0, 36)
        setBingoGrid(shuffled)
    }, [])

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

    const handleSaveTask = (index) => {
        if (tagInput.trim()) {
            // Here you would make API call to POST /api/games/:gameId/verify-completion
            const newCompletedTasks = new Set([...completedTasks, index])
            setCompletedTasks(newCompletedTasks)
            setShowCardModal(null)
            setTagInput('')

            // Check for win conditions with updated state
            checkWinConditions(newCompletedTasks)
        }
    }

    const getTaskColor = (index) => {
        return cardColors[index % cardColors.length]
    }

    const checkWinConditions = (currentCompletedTasks = completedTasks) => {
        const gridSize = 6
        const completed = Array.from(currentCompletedTasks)

        // Check rows
        for (let row = 0; row < gridSize; row++) {
            const rowIndices = Array.from({ length: gridSize }, (_, col) => row * gridSize + col)
            if (rowIndices.every(index => completed.includes(index))) {
                onWin('row')
                return
            }
        }

        // Check columns
        for (let col = 0; col < gridSize; col++) {
            const colIndices = Array.from({ length: gridSize }, (_, row) => row * gridSize + col)
            if (colIndices.every(index => completed.includes(index))) {
                onWin('column')
                return
            }
        }

        // Check diagonals
        const diagonal1 = Array.from({ length: gridSize }, (_, i) => i * gridSize + i)
        const diagonal2 = Array.from({ length: gridSize }, (_, i) => i * gridSize + (gridSize - 1 - i))

        if (diagonal1.every(index => completed.includes(index)) ||
            diagonal2.every(index => completed.includes(index))) {
            onWin('diagonal')
            return
        }

        // Check full house
        if (completed.length === 36) {
            onWin('fullhouse')
        }
    }

    return (
        <div className="min-h-screen relative" style={{ backgroundColor: COLORS.darkNavy }}>
            <TopBar playerData={playerData} />

            {/* Header with Timer */}
            <div className="text-center py-8 pt-20">
                <div className="text-white text-6xl font-light">{formatTime(gameTimer)}</div>
            </div>

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
        </div>
    )
}

export default GameBoard
