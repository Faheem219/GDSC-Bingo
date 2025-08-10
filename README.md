# GDSC Bingo Game

A responsive web application for playing Bingo with GDSC (Google Developer Student Clubs) members. The game involves finding people who match specific descriptions in a 6x6 grid format.

## 🎮 Game Flow

1. **Registration**: Players enter their name and mobile number to get a unique tag
2. **Instructions**: Brief explanation of game rules
3. **Game Board**: 6x6 grid with challenges like "Find someone who can whistle"
4. **Task Completion**: Players find others who match descriptions and enter their tags
5. **Win Conditions**: First to complete a line, column, diagonal, or full house wins

## 🏗️ Architecture

### Frontend
- **React 19** with Vite
- **Tailwind CSS** for styling
- **Responsive Design** (Mobile-first approach)
- **PWA Ready** (can be extended)

### Backend API Routes

#### Authentication & User Management
```
POST   /api/auth/register          # Register new player
GET    /api/auth/verify/:token     # Verify player registration  
GET    /api/players/:playerId      # Get player details
```

#### Game Management
```
GET    /api/games                  # Get list of active games
POST   /api/games                  # Create new game session
GET    /api/games/:gameId          # Get specific game details
POST   /api/games/:gameId/join     # Join a game session
DELETE /api/games/:gameId/leave    # Leave a game session
```

#### Bingo Cards & Tasks
```
GET    /api/cards/templates        # Get available card templates
GET    /api/cards/:cardId          # Get specific bingo card
POST   /api/cards/generate         # Generate randomized card
GET    /api/tasks                  # Get all available tasks
```

#### Game Actions
```
POST   /api/games/:gameId/mark-task           # Mark task as completed
GET    /api/games/:gameId/board/:playerId     # Get player's board state
POST   /api/games/:gameId/verify-completion   # Verify task completion
GET    /api/games/:gameId/leaderboard         # Get game standings
```

#### Real-time Updates (WebSocket)
```
WS     /ws/games/:gameId           # Real-time game updates
WS     /ws/games/:gameId/chat      # Game chat functionality
```

## 📱 Features

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Desktop Compatible**: Scales beautifully on larger screens
- **Touch Friendly**: Large tap targets and intuitive gestures

### Game Features
- **Real-time Updates**: Live game state synchronization
- **Timer**: Countdown timer for game sessions
- **Progress Tracking**: Visual progress indicators
- **Win Detection**: Automatic detection of winning patterns
- **Tag System**: Unique player identification
- **Task Verification**: Player-to-player verification system

### UI/UX
- **Modern Design**: Clean, colorful interface
- **Smooth Animations**: CSS transitions and hover effects
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages
- **Accessibility**: Screen reader friendly

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

### Environment Variables
Create a `.env` file in the Frontend directory:
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_WS_URL=ws://localhost:3001
```

## 🎨 Design System

### Colors
- **Primary**: Blue to Purple gradient
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B) 
- **Danger**: Red (#EF4444)
- **Task Colors**: Blue, Green, Red, Yellow, Purple, Pink rotation

### Typography
- **Font**: Inter (system fallback)
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Components
- **Cards**: Rounded corners (12px-24px)
- **Buttons**: Gradient backgrounds, hover effects
- **Grid**: Responsive 2/3/6 column layout
- **Modals**: Overlay with backdrop blur

## 📊 Game Mechanics

### Grid System
- **Size**: 6x6 (36 total tasks)
- **Layout**: Responsive grid that adapts to screen size
- **Colors**: Rotating color scheme for visual appeal

### Win Conditions
1. **Line**: Complete any horizontal row
2. **Column**: Complete any vertical column  
3. **Diagonal**: Complete main or anti-diagonal
4. **Full House**: Complete entire grid

### Task Categories
- Programming skills (Python, React, etc.)
- Personal traits (can whistle, left-handed)
- Geographic (from specific cities)
- Hobbies (guitar, photography, etc.)
- Lifestyle (early bird, coffee lover)

## 🔧 API Integration

### Player Registration
```javascript
const playerData = await api.registerPlayer({
  name: "John Doe",
  mobile: "9876543210"
});
```

### Task Completion
```javascript
const result = await api.verifyTaskCompletion(gameId, {
  taskId: "task_123",
  playerTag: "John-ABC4",
  verifiedBy: "Jane-XYZ8"
});
```

### Real-time Updates
```javascript
const gameWS = new GameWebSocket(gameId);
gameWS.connect();
gameWS.on('taskCompleted', (data) => {
  updateGameBoard(data);
});
```

## 🎯 Future Enhancements

### Planned Features
- [ ] **Chat System**: In-game messaging
- [ ] **Leaderboards**: Global and game-specific rankings
- [ ] **Achievements**: Badge system for milestones
- [ ] **Themes**: Customizable visual themes
- [ ] **Tournaments**: Multi-round competitions
- [ ] **Analytics**: Game statistics and insights
- [ ] **PWA**: Offline support and app installation
- [ ] **Social**: Share wins on social media

### Technical Improvements
- [ ] **State Management**: Redux/Zustand integration
- [ ] **Testing**: Unit and integration tests
- [ ] **Performance**: Code splitting and lazy loading
- [ ] **Security**: Input validation and sanitization
- [ ] **Monitoring**: Error tracking and analytics
- [ ] **CI/CD**: Automated deployment pipeline

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express (to be implemented)
- **Database**: MongoDB/PostgreSQL (to be implemented)
- **Real-time**: Socket.io (to be implemented)

## 📞 Support

For support and questions, please open an issue in the GitHub repository or contact the GDSC team.

---

Built with ❤️ for the GDSC community
