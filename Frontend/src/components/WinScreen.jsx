import TopBar from './TopBar'

const WinScreen = ({ gameData, onRestart, playerData }) => {
    const COLORS = {
        green: '#00BD67'
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center" style={{ backgroundColor: COLORS.green }}>
            <TopBar playerData={playerData} />

            <div className="text-center">
                {/* Large White Circle with Checkmark */}
                <div className="w-32 h-32 mx-auto mb-8 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-16 h-16" style={{ color: COLORS.green }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </div>

                {/* BINGO Text */}
                <h1 className="text-6xl font-bold text-white mb-8">BINGO!</h1>

                {/* Play Again Button */}
                <button
                    onClick={onRestart}
                    className="bg-white text-gray-800 py-4 px-8 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200"
                >
                    Play Again
                </button>
            </div>
        </div>
    )
}

export default WinScreen
