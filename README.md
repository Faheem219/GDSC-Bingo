# GDSC Bingo Game

A real-time multiplayer bingo game built for Google Developer Student Clubs (GDSC) events. Features include real-time updates, advanced scoring system, tag validation, and continuous gameplay after first bingo.

## Features

### 🎮 Game Mechanics
- **6x6 Bingo Grid**: 36 engaging tasks for participants
- **Real-time Multiplayer**: Support for 100+ concurrent players
- **Tag Validation**: Each player tag can only be used once per player
- **Continuous Gameplay**: Game continues after first bingo for multiple wins
- **Full House**: Complete all 36 tasks for maximum points

### 🏆 Advanced Scoring System
- **+5 points** per completed task
- **+10 points** per bingo (row, column, diagonal)
- **+50 base points** for full house completion
- **Time-based bonuses** for faster completion
- **Real-time leaderboard** with live updates

### 🎨 Modern UI
- **Dark Theme**: Professional GDSC-themed interface
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Real-time Updates**: Live notifications for player achievements
- **Smooth Animations**: Engaging user experience

## Tech Stack

### Frontend
- **React 19** with Vite
- **Tailwind CSS** for styling
- **WebSocket** for real-time communication
- **Responsive design** for all devices

### Backend
- **FastAPI** with async support
- **WebSocket** for real-time multiplayer
- **Pydantic** for data validation
- **In-memory storage** for fast performance

## Installation & Setup

### Quick Start

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/GDSC-Bingo.git
cd GDSC-Bingo
```

### Backend Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Run the FastAPI server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Configure environment variables (optional):
```bash
# The .env file is already configured for local development
# For production, copy .env.production and update the URLs
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Session Persistence

The application now maintains user sessions across page refreshes using localStorage. Players won't lose their progress if they accidentally refresh the page or navigate away.

## Deployment

### Quick Deploy (Recommended)

Use the deployment scripts for easy setup:

**Windows (PowerShell):**
```powershell
.\deploy.ps1
```

**Linux/Mac (Bash):**
```bash
chmod +x deploy.sh
./deploy.sh
```

### Platform-Specific Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions including:
- Railway + Vercel (Recommended)
- Render (Full-stack)
- Heroku + Netlify
- Docker deployment
- Custom server setup

### Environment Variables

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000
```

**Production (.env.production):**
```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_WS_URL=wss://your-backend-domain.com
```

## Usage

### For Players

1. **Register**: Enter your name and mobile number
2. **Read Instructions**: Understand the game rules
3. **Play**: Click on tasks and enter partner tags to complete them
4. **Score**: Earn points for tasks, bingos, and full house
5. **Compete**: Check the real-time leaderboard

### For Organizers

1. **Deploy**: Set up the backend on your server
2. **Share**: Give players the frontend URL
3. **Monitor**: Watch real-time statistics and leaderboard
4. **Manage**: Game state is automatically managed

## Game Rules

### Objective
Complete bingo patterns (rows, columns, diagonals) by finding people who match the task descriptions and collecting their unique tags.

### How to Play
1. **Find Someone**: Look for a person who matches a task (e.g., "Find someone who can whistle")
2. **Get Their Tag**: Ask for their unique player tag
3. **Mark Task**: Click the task and enter their tag
4. **Score Points**: Earn points for completed tasks and bingos
5. **Continue Playing**: Keep playing even after your first bingo

### Scoring
- **Task Completion**: +5 points each
- **Bingo Achievement**: +10 points each (row, column, diagonal)
- **Full House Completion**: +50 base points + time bonus
- **Time Bonus**: Faster completion = higher bonus

### Rules
- Each player tag can only be used once per player
- You cannot use your own tag
- Game continues until full house completion
- Real-time leaderboard shows current rankings

## API Endpoints

### Player Management
- `POST /api/players/register` - Register a new player
- `GET /api/players/{player_id}/board` - Get player's board state
- `GET /api/players/{player_id}/validate-tag/{tag}` - Validate a tag

### Game Actions
- `POST /api/players/{player_id}/tasks/{task_index}` - Mark a task as completed
- `GET /api/tasks` - Get all game tasks
- `GET /api/leaderboard` - Get current leaderboard
- `GET /api/game/stats` - Get game statistics

### WebSocket Events
- `board_update` - Player's board state changed
- `leaderboard_update` - Leaderboard updated
- `bingo_achieved` - Player achieved a bingo
- `full_house_completed` - Player completed full house

## Development

### Project Structure
```
GDSC-Bingo/
├── Frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── utils/         # API and utility functions
│   │   └── assets/        # Images and static files
│   ├── package.json
│   └── .env              # Environment variables
├── Backend/
│   ├── main.py           # FastAPI server
│   ├── requirements.txt  # Python dependencies
│   └── README.md
└── README.md
```

### Key Components
- **WelcomeScreen**: Player registration
- **InstructionsScreen**: Game rules and setup
- **GameBoard**: Main game interface
- **Leaderboard**: Real-time rankings
- **TopBar**: Navigation and player info

### Backend Architecture
- **Player Model**: Manages player data and state
- **GameState**: Central game state management
- **WebSocketManager**: Real-time communication
- **Tag Validation**: Prevents duplicate tag usage
- **Scoring System**: Complex point calculations

## Customization

### Adding New Tasks
Edit the `FALLBACK_TASKS` array in `Frontend/src/utils/api.js` or implement a backend task management system.

### Styling
Modify the `COLORS` object in components to change the theme colors.

### Scoring Rules
Update the scoring logic in `Backend/main.py` in the `Player.mark_task()` method.

## Deployment

### Backend Deployment
1. Deploy to any cloud provider (AWS, Heroku, DigitalOcean)
2. Set up environment variables
3. Configure WebSocket support
4. Use production WSGI server (gunicorn + uvicorn)

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to static hosting (Vercel, Netlify, GitHub Pages)
3. Update environment variables for production URLs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or feature requests, please create an issue in the GitHub repository.

---

**Built with ❤️ for GDSC Events**
