from flask import Flask, jsonify, request
from flask_cors import CORS
from typing import Any

app = Flask(__name__)
CORS(app)

players = {}
completed_tasks: dict[str, list[int]] = {} # { "playerId": [taskIndex1, taskIndex2] }
winners: list[dict[str, Any]] = []

BINGO_TASKS = [
    "Find someone who can whistle", "Find someone who knows Python", "Find someone from Delhi",
    "Find someone who plays guitar", "Find someone who loves coffee", "Find someone who can speak 3+ languages",
    "Find someone who has traveled abroad", "Find someone who is left-handed", "Find someone who loves reading",
    "Find someone who can cook well", "Find someone who plays sports", "Find someone who loves photography",
    "Find someone who is an early bird", "Find someone who loves movies", "Find someone who can dance",
    "Find someone who loves gaming", "Find someone who has a pet", "Find someone who loves hiking",
    "Find someone who knows AI/ML", "Find someone who loves art", "Find someone who can sing",
    "Find someone who loves music", "Find someone who is studying CS", "Find someone who loves memes",
    "Find someone who uses Linux", "Find someone who loves anime", "Find someone from Mumbai",
    "Find someone who codes daily", "Find someone who loves tea", "Find someone who can drive",
    "Find someone who loves nature", "Find someone who plays chess", "Find someone who loves books",
    "Find someone who knows React", "Find someone who loves writing", "Find someone who can swim"
]

@app.route('/api/players/register', methods=['POST'])
def register_player():
    data = request.get_json()
    player_id = data.get('id')

    if not player_id:
        return jsonify({"success": False, "message": "Player ID is required"}), 400

    players[player_id] = {
        "id": player_id,
        "name": data.get('name'),
        "mobile": data.get('mobile'),
        "tag": data.get('tag')
    }
    completed_tasks[player_id] = []

    print(f"Player registered: {players[player_id]}")
    return jsonify({"success": True, "player": players[player_id]})

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return jsonify({"tasks": BINGO_TASKS})

@app.route('/api/players/<string:player_id>/tasks/<int:task_index>', methods=['POST'])
def mark_task(player_id: str, task_index: int):
    data = request.get_json()
    partner_tag = data.get('partnerTag')

    if player_id not in players:
        return jsonify({"success": False, "message": "Player not found"}), 404

    if task_index < 0 or task_index >= len(BINGO_TASKS):
        return jsonify({"success": False, "message": "Invalid task index"}), 400

    if task_index not in completed_tasks.get(player_id, []):
        completed_tasks.setdefault(player_id, []).append(task_index)

    print(f"Task {task_index} marked for player {player_id} with partner {partner_tag}")
    return jsonify({"success": True, "taskIndex": task_index, "partnerTag": partner_tag})

@app.route('/api/players/<string:player_id>/board', methods=['GET'])
def get_player_board(player_id: str):
    if player_id not in players:
        return jsonify({"success": False, "message": "Player not found"}), 404

    return jsonify({"completedTasks": completed_tasks.get(player_id, [])})

@app.route('/api/players/<string:player_id>/win', methods=['POST'])
def announce_winner(player_id: str):
    data = request.get_json()
    win_info: dict[str, Any] = {
        "playerId": player_id,
        "winType": data.get('winType'),
        "winIndices": data.get('winIndices'),
        "timestamp": data.get('timestamp')
    }
    winners.append(win_info)

    print(f"Winner announced: {win_info}, {players[player_id]}")
    return jsonify({
        "success": True,
        "message": "Winner announced successfully",
        "winner": win_info
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)