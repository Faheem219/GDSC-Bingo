# GDSC Bingo - Frontend

## Quick Start

```bash
npm install
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
Frontend/
├── src/
│   ├── components/          # React components
│   │   ├── WelcomeScreen.jsx
│   │   ├── InstructionsScreen.jsx
│   │   ├── GameBoard.jsx
│   │   └── WinScreen.jsx
│   ├── utils/              # Utility functions
│   │   └── api.js          # API integration
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── package.json
├── vite.config.js
└── README.md
```

## Features

✅ **Responsive Design** - Mobile-first approach  
✅ **Real-time Game State** - Live updates via WebSocket  
✅ **Task Verification** - Player-to-player verification  
✅ **Win Detection** - Automatic pattern recognition  
✅ **Timer System** - Game countdown  
✅ **Progress Tracking** - Visual completion indicators  

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **WebSocket** - Real-time communication

## API Integration

The frontend is designed to work with the RESTful API endpoints defined in the main README. Update `src/utils/api.js` with your backend URL.

## Responsive Breakpoints

- **Mobile**: < 640px (2 columns)
- **Tablet**: 640px - 1024px (3 columns)  
- **Desktop**: > 1024px (6 columns)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
