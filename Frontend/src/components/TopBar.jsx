import { useState } from 'react'

const TopBar = ({ playerData, showInstructions = true, showTag = true, showLeaderboard = false, onShowLeaderboard }) => {
    const [showTagModal, setShowTagModal] = useState(false)
    const [showInstructionsModal, setShowInstructionsModal] = useState(false)

    const COLORS = {
        darkNavy: '#0B083F',
        secondaryDark: '#3C3C59'
    }

    return (
        <>
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 z-40">
                <div className="flex justify-between items-center p-4">
                    {/* Instructions Button */}
                    {showInstructions && (
                        <button
                            onClick={() => setShowInstructionsModal(true)}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all"
                        >
                            <span className="text-lg font-bold">ℹ️</span>
                        </button>
                    )}

                    {/* Spacer */}
                    <div className="flex-1"></div>

                    {/* Leaderboard Button */}
                    {showLeaderboard && onShowLeaderboard && (
                        <button
                            onClick={onShowLeaderboard}
                            className="bg-yellow-500 bg-opacity-20 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-30 transition-all mr-2"
                        >
                            🏆 Leaderboard
                        </button>
                    )}

                    {/* Tag Button */}
                    {showTag && playerData && (
                        <button
                            onClick={() => setShowTagModal(true)}
                            className="bg-white bg-opacity-20 text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-30 transition-all"
                        >
                            My Tag
                        </button>
                    )}
                </div>
            </div>

            {/* Instructions Modal */}
            {showInstructionsModal && (
                <div
                    className="fixed inset-0 flex items-center justify-center p-4 z-50"
                    style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
                >
                    <div
                        className="rounded-2xl p-6 w-full max-w-md"
                        style={{ backgroundColor: COLORS.secondaryDark }}
                    >
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-bold text-white mb-4">📜 Instructions for Gridmates</h2>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-sm font-bold">1️⃣</span>
                                </div>
                                <p className="text-white text-sm leading-relaxed">
                                    <strong>Mark a square</strong> when you find a matching friend — tap on a box and enter their tag number to claim it.
                                </p>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-sm font-bold">2️⃣</span>
                                </div>
                                <p className="text-white text-sm leading-relaxed">
                                    <strong>Scoring</strong> — Earn +5 points for every box you complete.
                                </p>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-sm font-bold">3️⃣</span>
                                </div>
                                <p className="text-white text-sm leading-relaxed">
                                    <strong>Bonus points</strong> — Get +10 points instantly for completing a row, and +50 points for a full house.
                                </p>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-sm font-bold">4️⃣</span>
                                </div>
                                <p className="text-white text-sm leading-relaxed">
                                    <strong>Speed matters!</strong> — The first player to hit full house gets an extra +50 points, while later submissions lose 1 point for every slower turn.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowInstructionsModal(false)}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-colors"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            )}

            {/* Tag Modal */}
            {showTagModal && playerData && (
                <div
                    className="fixed inset-0 flex items-center justify-center p-4 z-50"
                    style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
                >
                    <div
                        className="rounded-2xl p-6 w-full max-w-md text-center"
                        style={{ backgroundColor: COLORS.secondaryDark }}
                    >
                        <h3 className="text-lg font-bold text-white mb-4">Your Player Tag</h3>
                        <div className="bg-blue-500 rounded-xl p-6 mb-6">
                            <p className="text-white text-sm mb-2">Share this with others:</p>
                            <p className="text-white text-2xl font-bold">{playerData.tag}</p>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(playerData.tag)
                                    // Could add a toast notification here
                                }}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-colors"
                            >
                                Copy Tag
                            </button>
                            <button
                                onClick={() => setShowTagModal(false)}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default TopBar
