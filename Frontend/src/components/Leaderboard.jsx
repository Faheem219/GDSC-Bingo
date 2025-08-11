import { useState, useEffect } from 'react'
import TopBar from './TopBar'
import { api, utils } from '../utils/api'

const Leaderboard = ({ playerData, onBack }) => {
    const [leaderboard, setLeaderboard] = useState([])
    const [gameStats, setGameStats] = useState({})
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

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

    // Fetch leaderboard data
    const fetchLeaderboard = async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true)
            else setRefreshing(true)

            const [leaderboardData, statsData] = await Promise.all([
                api.getLeaderboard(),
                api.getGameStats()
            ])

            setLeaderboard(leaderboardData.leaderboard || [])
            setGameStats(statsData)
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        fetchLeaderboard()

        // Auto-refresh every 10 seconds
        const interval = setInterval(() => {
            fetchLeaderboard(false)
        }, 10000)

        return () => clearInterval(interval)
    }, [])

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1: return '🥇'
            case 2: return '🥈'
            case 3: return '🥉'
            default: return `#${rank}`
        }
    }

    const getScoreColor = (score) => {
        if (score >= 100) return COLORS.yellow
        if (score >= 50) return COLORS.green
        if (score >= 25) return COLORS.blue
        return COLORS.red
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: COLORS.darkNavy }}>
            <TopBar playerData={playerData} />

            <div className="pt-20 pb-8 px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-white text-4xl font-bold mb-2">🏆 Leaderboard</h1>
                    <div className="text-white text-sm opacity-75">
                        Real-time rankings updated every 10 seconds
                    </div>
                </div>

                {/* Game Statistics */}
                <div className="max-w-md mx-auto mb-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 rounded-lg" style={{ backgroundColor: COLORS.secondaryDark }}>
                            <div className="text-white text-2xl font-bold">{gameStats.totalPlayers || 0}</div>
                            <div className="text-white text-sm opacity-75">Total Players</div>
                        </div>
                        <div className="text-center p-4 rounded-lg" style={{ backgroundColor: COLORS.secondaryDark }}>
                            <div className="text-white text-2xl font-bold">{gameStats.totalBingos || 0}</div>
                            <div className="text-white text-sm opacity-75">Total Bingos</div>
                        </div>
                        <div className="text-center p-4 rounded-lg" style={{ backgroundColor: COLORS.secondaryDark }}>
                            <div className="text-white text-2xl font-bold">{gameStats.totalTasksCompleted || 0}</div>
                            <div className="text-white text-sm opacity-75">Tasks Completed</div>
                        </div>
                        <div className="text-center p-4 rounded-lg" style={{ backgroundColor: COLORS.secondaryDark }}>
                            <div className="text-white text-2xl font-bold">{gameStats.fullHouseCount || 0}</div>
                            <div className="text-white text-sm opacity-75">Full Houses</div>
                        </div>
                    </div>
                </div>

                {/* Refresh Button */}
                <div className="text-center mb-6">
                    <button
                        onClick={() => fetchLeaderboard(false)}
                        disabled={refreshing}
                        className="px-6 py-2 rounded-lg text-white font-medium transition-all duration-200"
                        style={{
                            backgroundColor: refreshing ? COLORS.darkGray : COLORS.blue,
                            opacity: refreshing ? 0.5 : 1
                        }}
                    >
                        {refreshing ? 'Refreshing...' : 'Refresh Now'}
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-white text-xl">Loading leaderboard...</div>
                    </div>
                ) : (
                    <>
                        {/* Leaderboard List */}
                        <div className="max-w-md mx-auto space-y-3">
                            {leaderboard.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-white text-lg opacity-75">No players yet</div>
                                    <div className="text-white text-sm opacity-50">Be the first to complete a task!</div>
                                </div>
                            ) : (
                                leaderboard.map((player, index) => {
                                    const rank = index + 1
                                    const isCurrentPlayer = player.id === playerData?.id

                                    return (
                                        <div
                                            key={player.id}
                                            className={`p-4 rounded-lg border transition-all duration-200 ${isCurrentPlayer ? 'border-yellow-400 shadow-lg' : 'border-transparent'
                                                }`}
                                            style={{
                                                backgroundColor: isCurrentPlayer ? COLORS.darkGray : COLORS.secondaryDark
                                            }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="text-2xl">
                                                        {getRankIcon(rank)}
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-medium">
                                                            {player.name}
                                                            {isCurrentPlayer && <span className="ml-2 text-yellow-400">(You)</span>}
                                                        </div>
                                                        <div className="text-white text-sm opacity-75">
                                                            {player.tag} • {player.completedTasks || 0}/36 tasks
                                                        </div>
                                                        <div className="text-white text-xs opacity-50">
                                                            {player.bingos || 0} bingos • {utils.formatTime(player.elapsedTime || 0)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div
                                                        className="text-2xl font-bold"
                                                        style={{ color: getScoreColor(player.score || 0) }}
                                                    >
                                                        {player.score || 0}
                                                    </div>
                                                    <div className="text-white text-xs opacity-50">points</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>

                        {/* Full House Completions */}
                        {gameStats.fullHouseCompletions && gameStats.fullHouseCompletions.length > 0 && (
                            <div className="max-w-md mx-auto mt-8">
                                <h2 className="text-white text-xl font-bold mb-4 text-center">🎯 Full House Champions</h2>
                                <div className="space-y-2">
                                    {gameStats.fullHouseCompletions.map((completion, index) => (
                                        <div
                                            key={index}
                                            className="p-3 rounded-lg"
                                            style={{ backgroundColor: COLORS.yellow, color: COLORS.darkNavy }}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="font-medium">{completion.playerName}</div>
                                                <div className="text-sm">
                                                    {completion.finalScore} points in {utils.formatTime(completion.completionTime)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Back Button */}
                <div className="text-center mt-8">
                    <button
                        onClick={onBack}
                        className="px-8 py-3 rounded-lg text-white font-medium transition-all duration-200 hover:opacity-80"
                        style={{ backgroundColor: COLORS.red }}
                    >
                        Back to Game
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Leaderboard
