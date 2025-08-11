import { useState, useEffect } from 'react'
import WelcomeScreen from './components/WelcomeScreen'
import InstructionsScreen from './components/InstructionsScreen'
import GameBoard from './components/GameBoard'
import WinScreen from './components/WinScreen'
import Leaderboard from './components/Leaderboard'

function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome') // welcome, instructions, game, leaderboard, win
  const [playerData, setPlayerData] = useState(null)
  const [gameData, setGameData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Session persistence - restore user session on page load
  useEffect(() => {
    const restoreSession = () => {
      try {
        const savedPlayerData = localStorage.getItem('gdsc_bingo_player')
        const savedScreen = localStorage.getItem('gdsc_bingo_screen')
        const savedGameData = localStorage.getItem('gdsc_bingo_game_data')

        if (savedPlayerData) {
          const playerInfo = JSON.parse(savedPlayerData)
          setPlayerData(playerInfo)

          // Restore the screen state, default to game if player data exists
          if (savedScreen && savedScreen !== 'welcome') {
            setCurrentScreen(savedScreen)
          } else {
            setCurrentScreen('game')
          }

          // Restore game data if exists
          if (savedGameData) {
            setGameData(JSON.parse(savedGameData))
          }
        }
      } catch (error) {
        console.error('Failed to restore session:', error)
        // Clear corrupted data
        localStorage.removeItem('gdsc_bingo_player')
        localStorage.removeItem('gdsc_bingo_screen')
        localStorage.removeItem('gdsc_bingo_game_data')
      } finally {
        setIsLoading(false)
      }
    }

    restoreSession()
  }, [])

  // Save session data whenever it changes
  useEffect(() => {
    if (playerData) {
      localStorage.setItem('gdsc_bingo_player', JSON.stringify(playerData))
    } else {
      localStorage.removeItem('gdsc_bingo_player')
    }
  }, [playerData])

  useEffect(() => {
    if (currentScreen && !isLoading) {
      localStorage.setItem('gdsc_bingo_screen', currentScreen)
    }
  }, [currentScreen, isLoading])

  useEffect(() => {
    if (gameData) {
      localStorage.setItem('gdsc_bingo_game_data', JSON.stringify(gameData))
    } else {
      localStorage.removeItem('gdsc_bingo_game_data')
    }
  }, [gameData])

  const handlePlayerRegistration = (data) => {
    setPlayerData(data)
    setCurrentScreen('instructions')
  }

  const handleStartGame = () => {
    setCurrentScreen('game')
  }

  const handleGameWin = (winType) => {
    setGameData({ winType })
    setCurrentScreen('win')
  }

  const handleShowLeaderboard = () => {
    setCurrentScreen('leaderboard')
  }

  const handleBackToGame = () => {
    setCurrentScreen('game')
  }

  const handleRestart = () => {
    setCurrentScreen('welcome')
    setPlayerData(null)
    setGameData(null)
    // Clear session data
    localStorage.removeItem('gdsc_bingo_player')
    localStorage.removeItem('gdsc_bingo_screen')
    localStorage.removeItem('gdsc_bingo_game_data')
  }

  // Show loading screen while restoring session
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0B083F' }}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0B083F' }}>
      {currentScreen === 'welcome' && (
        <WelcomeScreen onRegister={handlePlayerRegistration} />
      )}
      {currentScreen === 'instructions' && (
        <InstructionsScreen onStartGame={handleStartGame} playerData={playerData} />
      )}
      {currentScreen === 'game' && (
        <GameBoard
          playerData={playerData}
          onWin={handleGameWin}
          onShowLeaderboard={handleShowLeaderboard}
        />
      )}
      {currentScreen === 'leaderboard' && (
        <Leaderboard
          playerData={playerData}
          onBack={handleBackToGame}
        />
      )}
      {currentScreen === 'win' && (
        <WinScreen gameData={gameData} onRestart={handleRestart} playerData={playerData} />
      )}
    </div>
  )
}

export default App
