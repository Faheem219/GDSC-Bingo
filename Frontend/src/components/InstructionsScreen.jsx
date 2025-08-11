import TopBar from './TopBar'

const InstructionsScreen = ({ onStartGame, playerData }) => {
    const COLORS = {
        darkNavy: '#0B083F',
        secondaryDark: '#3C3C59'
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4" style={{ backgroundColor: COLORS.darkNavy }}>
            <TopBar playerData={playerData} showInstructions={false} />

            <div className="rounded-3xl shadow-2xl p-8 w-full max-w-md" style={{ backgroundColor: COLORS.secondaryDark }}>
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">📜 Instructions for Gridmates</h1>
                </div>

                {/* Instructions List */}
                <div className="space-y-4 mb-8">
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
                            <strong>Speed matters!</strong> — The first player to hit full house gets extra points, while later submissions lose points.
                        </p>
                    </div>
                </div>

                {/* Start Game Button */}
                <button
                    onClick={onStartGame}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                    Let's Play!
                </button>
            </div>
        </div>
    )
}

export default InstructionsScreen
