from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Set, Optional
import asyncio
import json
import time
from datetime import datetime
import uuid

app = FastAPI(title="GDSC Bingo API", version="1.0.0")

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class PlayerRegistration(BaseModel):
    name: str
    mobile: str
    id: str
    tag: str

class TaskCompletion(BaseModel):
    partnerTag: str

class Player(BaseModel):
    id: str
    name: str
    mobile: str
    tag: str
    startTime: float
    completedTasks: Set[int] = set()
    usedTags: Set[str] = set()  # Tags this player has used
    score: int = 0
    bingos: List[Dict] = []  # List of completed bingos
    fullHouseTime: Optional[float] = None

# Game state
class GameState:
    def __init__(self):
        self.players: Dict[str, Player] = {}
        self.tasks: List[str] = [
            "Find someone who can whistle",
            "Find someone who knows Python",
            "Find someone from Delhi",
            "Find someone who plays guitar",
            "Find someone who loves coffee",
            "Find someone who can speak 3+ languages",
            "Find someone who has traveled abroad",
            "Find someone who is left-handed",
            "Find someone who loves reading",
            "Find someone who can cook well",
            "Find someone who plays sports",
            "Find someone who loves photography",
            "Find someone who is an early bird",
            "Find someone who loves movies",
            "Find someone who can dance",
            "Find someone who loves gaming",
            "Find someone who has a pet",
            "Find someone who loves hiking",
            "Find someone who knows AI/ML",
            "Find someone who loves art",
            "Find someone who can sing",
            "Find someone who loves music",
            "Find someone who is studying CS",
            "Find someone who loves memes",
            "Find someone who uses Mac",
            "Find someone who loves anime",
            "Find someone from Mumbai",
            "Find someone who codes daily",
            "Find someone who loves tea",
            "Find someone who can drive",
            "Find someone who loves nature",
            "Find someone who plays chess",
            "Find someone who loves books",
            "Find someone who knows React",
            "Find someone who loves writing",
            "Find someone who can swim"
        ]
        self.fullHouseCompletions: List[Dict] = []  # Track full house completion order
        self.connections: Dict[str, WebSocket] = {}

    def check_bingo_win(self, completedIndices: Set[int], gridSize: int = 6) -> List[Dict]:
        """Check for all possible bingo wins (can have multiple)"""
        wins = []
        completed = completedIndices

        # Check rows
        for row in range(gridSize):
            rowIndices = set(range(row * gridSize, (row + 1) * gridSize))
            if rowIndices.issubset(completed):
                wins.append({"type": "row", "indices": list(rowIndices), "id": f"row_{row}"})

        # Check columns
        for col in range(gridSize):
            colIndices = set(col + row * gridSize for row in range(gridSize))
            if colIndices.issubset(completed):
                wins.append({"type": "column", "indices": list(colIndices), "id": f"col_{col}"})

        # Check diagonals
        diagonal1 = set(i * gridSize + i for i in range(gridSize))
        diagonal2 = set(i * gridSize + (gridSize - 1 - i) for i in range(gridSize))

        if diagonal1.issubset(completed):
            wins.append({"type": "diagonal", "indices": list(diagonal1), "id": "diag_1"})

        if diagonal2.issubset(completed):
            wins.append({"type": "diagonal", "indices": list(diagonal2), "id": "diag_2"})

        # Check full house
        if len(completed) == gridSize * gridSize:
            wins.append({"type": "fullhouse", "indices": list(completed), "id": "fullhouse"})

        return wins

    def calculate_score(self, player: Player) -> int:
        """Calculate player's total score"""
        score = 0
        
        # Base points for completed tasks
        score += len(player.completedTasks) * 5
        
        # Bonus for bingos (excluding full house)
        bingo_count = len([b for b in player.bingos if b["type"] != "fullhouse"])
        score += bingo_count * 10
        
        # Full house bonus
        if player.fullHouseTime:
            # Base full house bonus
            score += 50
            
            # Time-based bonus (first gets 50, second gets 45, etc.)
            position = len([p for p in self.fullHouseCompletions if p["time"] < player.fullHouseTime])
            time_bonus = max(50 - (position * 5), 5)  # Minimum 5 points
            score += time_bonus
        
        return score

    async def broadcast_update(self, event_type: str, data: Dict):
        """Broadcast update to all connected clients"""
        message = json.dumps({"type": event_type, "data": data})
        disconnected = []
        
        for player_id, websocket in self.connections.items():
            try:
                await websocket.send_text(message)
            except:
                disconnected.append(player_id)
        
        # Clean up disconnected clients
        for player_id in disconnected:
            del self.connections[player_id]

# Global game state
game_state = GameState()

# WebSocket connection manager
@app.websocket("/ws/{player_id}")
async def websocket_endpoint(websocket: WebSocket, player_id: str):
    await websocket.accept()
    game_state.connections[player_id] = websocket
    
    try:
        # Send current game state to new connection
        await websocket.send_text(json.dumps({
            "type": "game_state",
            "data": {
                "tasks": game_state.tasks,
                "leaderboard": get_leaderboard_data()
            }
        }))
        
        # Keep connection alive
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        if player_id in game_state.connections:
            del game_state.connections[player_id]

def get_leaderboard_data() -> List[Dict]:
    """Get current leaderboard data"""
    leaderboard = []
    for player in game_state.players.values():
        leaderboard.append({
            "id": player.id,
            "name": player.name,
            "tag": player.tag,
            "score": game_state.calculate_score(player),
            "completedTasks": len(player.completedTasks),
            "bingos": len([b for b in player.bingos if b["type"] != "fullhouse"]),
            "fullHouse": player.fullHouseTime is not None,
            "elapsedTime": time.time() - player.startTime if player.startTime else 0
        })
    
    # Sort by score (descending), then by time (ascending)
    leaderboard.sort(key=lambda x: (-x["score"], x["elapsedTime"]))
    return leaderboard

# API Routes
@app.post("/api/players/register")
async def register_player(player_data: PlayerRegistration):
    """Register a new player"""
    if player_data.id in game_state.players:
        raise HTTPException(status_code=400, detail="Player already registered")
    
    # Check if tag is unique
    existing_tags = {p.tag for p in game_state.players.values()}
    if player_data.tag in existing_tags:
        raise HTTPException(status_code=400, detail="Player tag already exists")
    
    # Create player
    player = Player(
        id=player_data.id,
        name=player_data.name,
        mobile=player_data.mobile,
        tag=player_data.tag,
        startTime=time.time()
    )
    
    game_state.players[player_data.id] = player
    
    # Broadcast player joined
    await game_state.broadcast_update("player_joined", {
        "player": {"id": player.id, "name": player.name, "tag": player.tag},
        "leaderboard": get_leaderboard_data()
    })
    
    return {"success": True, "player": player_data.dict()}

@app.get("/api/tasks")
async def get_tasks():
    """Get all bingo tasks"""
    return {"tasks": game_state.tasks}

@app.post("/api/players/{player_id}/tasks/{task_index}")
async def mark_task(player_id: str, task_index: int, completion: TaskCompletion):
    """Mark a task as completed"""
    if player_id not in game_state.players:
        raise HTTPException(status_code=404, detail="Player not found")
    
    player = game_state.players[player_id]
    
    # Validate task index
    if task_index < 0 or task_index >= len(game_state.tasks):
        raise HTTPException(status_code=400, detail="Invalid task index")
    
    # Check if task already completed
    if task_index in player.completedTasks:
        raise HTTPException(status_code=400, detail="Task already completed")
    
    # Validate partner tag exists
    partner_tag = completion.partnerTag
    valid_tags = {p.tag for p in game_state.players.values() if p.id != player_id}
    if partner_tag not in valid_tags:
        raise HTTPException(status_code=400, detail="Invalid partner tag")
    
    # Check if player has already used this tag
    if partner_tag in player.usedTags:
        raise HTTPException(status_code=400, detail="You have already used this player's tag")
    
    # Mark task as completed
    player.completedTasks.add(task_index)
    player.usedTags.add(partner_tag)
    
    # Check for new bingos
    current_wins = game_state.check_bingo_win(player.completedTasks)
    existing_bingo_ids = {b["id"] for b in player.bingos}
    new_bingos = [w for w in current_wins if w["id"] not in existing_bingo_ids]
    
    # Add new bingos
    for bingo in new_bingos:
        bingo["timestamp"] = time.time()
        # Add score bonus information for frontend display
        if bingo["type"] == "fullhouse":
            bingo["scoreBonus"] = 50
        else:
            bingo["scoreBonus"] = 10
        player.bingos.append(bingo)
        
        # Handle full house
        if bingo["type"] == "fullhouse" and not player.fullHouseTime:
            player.fullHouseTime = time.time()
            game_state.fullHouseCompletions.append({
                "playerId": player_id,
                "playerName": player.name,
                "time": player.fullHouseTime
            })
    
    # Update score
    player.score = game_state.calculate_score(player)
    
    # Broadcast updates
    await game_state.broadcast_update("task_completed", {
        "playerId": player_id,
        "playerName": player.name,
        "taskIndex": task_index,
        "newBingos": new_bingos,
        "leaderboard": get_leaderboard_data()
    })
    
    return {
        "success": True,
        "taskIndex": task_index,
        "partnerTag": partner_tag,
        "newBingos": new_bingos,
        "score": player.score
    }

@app.get("/api/players/{player_id}/board")
async def get_player_board(player_id: str):
    """Get player's board state"""
    if player_id not in game_state.players:
        raise HTTPException(status_code=404, detail="Player not found")
    
    player = game_state.players[player_id]
    return {
        "completedTasks": list(player.completedTasks),
        "usedTags": list(player.usedTags),
        "bingos": player.bingos,
        "score": game_state.calculate_score(player),
        "elapsedTime": time.time() - player.startTime
    }

@app.get("/api/leaderboard")
async def get_leaderboard():
    """Get current leaderboard"""
    return {"leaderboard": get_leaderboard_data()}

@app.get("/api/players/{player_id}/validate-tag/{tag}")
async def validate_tag(player_id: str, tag: str):
    """Validate if a tag can be used by the player"""
    if player_id not in game_state.players:
        raise HTTPException(status_code=404, detail="Player not found")
    
    player = game_state.players[player_id]
    
    # Check if tag exists
    valid_tags = {p.tag for p in game_state.players.values() if p.id != player_id}
    if tag not in valid_tags:
        return {"valid": False, "reason": "Player tag does not exist"}
    
    # Check if already used
    if tag in player.usedTags:
        return {"valid": False, "reason": "You have already used this player's tag"}
    
    return {"valid": True}

@app.get("/api/game/stats")
async def get_game_stats():
    """Get overall game statistics"""
    total_players = len(game_state.players)
    total_tasks_completed = sum(len(p.completedTasks) for p in game_state.players.values())
    total_bingos = sum(len(p.bingos) for p in game_state.players.values())
    full_house_count = len(game_state.fullHouseCompletions)
    
    return {
        "totalPlayers": total_players,
        "totalTasksCompleted": total_tasks_completed,
        "totalBingos": total_bingos,
        "fullHouseCount": full_house_count,
        "fullHouseCompletions": game_state.fullHouseCompletions
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
