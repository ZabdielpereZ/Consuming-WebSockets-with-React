from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins='*')
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    if username:
        return jsonify({'message': f'Welcome, {username}!', 'username': username})
    return jsonify({'error': 'Username is required!'}), 400

@socketio.on('connect')
def connect_handler():
    print('Client connected!')

@socketio.on('disconnect')
def disconnect_handler():
    print('Client disconnected!')

@socketio.on('message')
def handle_message(data):
    print(f'Message received: {data}')
    emit('message', data, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
