import { useState } from 'react'

const TopBar = ({ playerData, showInstructions = true, showTag = true }) => {
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
                            className="w-10 h-10s rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all"
                        >
                            <span className="text-lg font-bold">ℹ️</span>
                        </button>
                    )}

                    {/* Spacer */}
                    <div className="flex-1"></div>

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
                            <h2 className="text-xl font-bold text-white mb-4">Instructions</h2>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-sm font-bold">1</span>
                                </div>
                                <p className="text-white text-sm leading-relaxed">
                                    Tap any box to reveal a challenge
                                </p>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-sm font-bold">2</span>
                                </div>
                                <p className="text-white text-sm leading-relaxed">
                                    Find someone who matches the description
                                </p>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-sm font-bold">3</span>
                                </div>
                                <p className="text-white text-sm leading-relaxed">
                                    Get their tag and save the task
                                </p>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-sm font-bold">4</span>
                                </div>
                                <p className="text-white text-sm leading-relaxed">
                                    Complete a line, column, or full grid to win!
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
