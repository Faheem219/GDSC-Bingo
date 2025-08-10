# GDSC Bingo API Documentation

## Overview
This document outlines the simplified API endpoints that the backend needs to implement for the GDSC Bingo game.

## Base URL
```
http://localhost:3001/api
```

## API Endpoints

### 1. Register Player
**Endpoint:** `POST /players/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "mobile": "9876543210",
  "id": "GDSCABC123",
  "tag": "John-XY12"
}
```

**Response:**
```json
{
  "success": true,
  "player": {
    "id": "GDSCABC123",
    "name": "John Doe",
    "mobile": "9876543210",
    "tag": "John-XY12"
  }
}
```

### 2. Get Tasks
**Endpoint:** `GET /tasks`

**Response:**
```json
{
  "tasks": [
    "Find someone who can whistle",
    "Find someone who knows Python",
    // ... 34 more tasks (36 total)
  ]
}
```

### 3. Mark Task as Completed
**Endpoint:** `POST /players/{playerId}/tasks/{taskIndex}`

**Request Body:**
```json
{
  "partnerTag": "Jane-AB34"
}
```

**Response:**
```json
{
  "success": true,
  "taskIndex": 5,
  "partnerTag": "Jane-AB34"
}
```

### 4. Get Player Board
**Endpoint:** `GET /players/{playerId}/board`

**Response:**
```json
{
  "completedTasks": [0, 5, 12, 18, 23, 30]
}
```

### 5. Announce Winner
**Endpoint:** `POST /players/{playerId}/win`

**Request Body:**
```json
{
  "winType": "row",
  "winIndices": [0, 1, 2, 3, 4, 5],
  "timestamp": 1691234567890
}
```

**Response:**
```json
{
  "success": true,
  "message": "Winner announced successfully",
  "winner": {
    "playerId": "GDSCABC123",
    "winType": "row",
    "timestamp": 1691234567890
  }
}
```

## Frontend Behavior

### Fallback Strategy
The frontend is designed to work even when the backend is not available:

1. **Tasks**: Falls back to a predefined list of 36 tasks
2. **Player Registration**: Uses local data generation
3. **Task Completion**: Stores in localStorage
4. **Player Board**: Reads from localStorage
5. **Winner Announcement**: Continues locally

### Error Handling
All API calls are wrapped in try-catch blocks and will gracefully degrade to local functionality if the backend is unavailable.

## Game Rules

- **Grid Size**: 6x6 (36 tasks total)
- **Win Conditions**: Complete any row, column, diagonal, or full house
- **Task Assignment**: All players get the same 36 tasks from the backend
- **Task Completion**: Players must enter another player's tag to mark a task complete

## Development Notes

- The frontend validates mobile numbers (Indian format: starts with 6-9, 10 digits)
- Player names must be 2-50 characters
- All API failures log warnings to console but don't break the game flow
- The game works entirely offline using fallback data when needed
