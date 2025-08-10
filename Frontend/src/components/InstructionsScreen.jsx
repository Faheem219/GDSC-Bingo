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
                    <h1 className="text-2xl font-bold text-white mb-4">Instructions</h1>
                </div>

                {/* Instructions List */}
                <div className="space-y-4 mb-8">
                    <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-sm font-bold">1</span>
                        </div>
                        <p className="text-white text-sm leading-relaxed">
                            This is the first instruction
                        </p>
                    </div>

                    <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-sm font-bold">2</span>
                        </div>
                        <p className="text-white text-sm leading-relaxed">
                            This is the second instruction
                        </p>
                    </div>

                    <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-sm font-bold">3</span>
                        </div>
                        <p className="text-white text-sm leading-relaxed">
                            This is the third instruction
                        </p>
                    </div>

                    <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-sm font-bold">4</span>
                        </div>
                        <p className="text-white text-sm leading-relaxed">
                            This is the fourth instruction
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

                {/* Timer Icon */}
                <div className="flex justify-center mt-6">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            </div>
        </div>
    )
}

export default InstructionsScreen
