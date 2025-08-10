import { useState } from 'react'
import WelcomeScreen from './components/WelcomeScreen'
import InstructionsScreen from './components/InstructionsScreen'
import GameBoard from './components/GameBoard'
import WinScreen from './components/WinScreen'

function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome') // welcome, instructions, game, win
  const [playerData, setPlayerData] = useState(null)
  const [gameData, setGameData] = useState(null)

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

  const handleRestart = () => {
    setCurrentScreen('welcome')
    setPlayerData(null)
    setGameData(null)
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
        <GameBoard playerData={playerData} onWin={handleGameWin} />
      )}
      {currentScreen === 'win' && (
        <WinScreen gameData={gameData} onRestart={handleRestart} playerData={playerData} />
      )}
    </div>
  )
}

export default App
