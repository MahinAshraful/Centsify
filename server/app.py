from flask import Flask, request, jsonify
from atlas import AtlasClient
from os import environ as env
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from email_validator import validate_email, EmailNotValidError
from bson import ObjectId 
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = env.get('JWT_SECRET_KEY', 'your-secret-key')  # Change this!
jwt = JWTManager(app)
CORS(app)

atlas_client = AtlasClient(env.get('ATLAS_URI'), "users")

def validate_user_input(data):
    errors = []
    if 'username' not in data or not data['username']:
        errors.append("username is required")
    if 'email' not in data or not data['email']:
        errors.append("email is required")
    else:
        try:
            validate_email(data['email'])
        except EmailNotValidError:
            errors.append("Invalid email format")
    if 'password' not in data or not data['password']:
        errors.append("password is required")
    elif len(data['password']) < 8:
        errors.append("password must be at least 8 characters long")
    return errors

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the API. Available endpoints: /api/register, /api/login, /api/user"}), 200

@app.route('/api/register', methods=['POST'])
def register_user():
    user_data = request.json
    
    errors = validate_user_input(user_data)
    if errors:
        return jsonify({"errors": errors}), 400

    users_collection = atlas_client.get_collection('info')
    
    # Check for existing user
    existing_user = users_collection.find_one({'$or': [{'username': user_data['username']}, {'email': user_data['email']}]})
    
    if existing_user:
        return jsonify({"message": "Username or email already exists"}), 400

    # Generate a unique user ID
    user_id = str(ObjectId())
    
    hashed_password = generate_password_hash(user_data['password'])
    new_user = {
        '_id': user_id,
        'username': user_data['username'],
        'email': user_data['email'],
        'password': hashed_password,
        'level' : 1
    }

    new_user_id = atlas_client.insert_one('info', new_user)
    
    return jsonify({"message": "User registered successfully", "user_id": user_id}), 201

@app.route('/api/login', methods=['POST'])
def login():
    login_data = request.json
    if not login_data or 'username' not in login_data or 'password' not in login_data:
        return jsonify({"message": "Missing username or password"}), 400

    user = atlas_client.find('info', {'username': login_data['username']}, limit=1)
    if not user or not check_password_hash(user[0]['password'], login_data['password']):
        return jsonify({"message": "Invalid username or password"}), 401

    access_token = create_access_token(identity=str(user[0]['_id']))
    return jsonify(access_token=access_token), 200

# @app.route('/api/user', methods=['GET'])
# @jwt_required()
# def get_user():
#     current_user_id = get_jwt_identity()
#     user = atlas_client.find('info', {'_id': current_user_id}, limit=1)
#     if user:
#         user_data = user[0]
#         del user_data['password']  # Don't send the password hash
#         return jsonify(user_data), 200
#     return jsonify({"message": "User not found"}), 404

@app.route('/api/user/<user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    user = atlas_client.find('info', {'_id': user_id}, limit=1)
    if user:
        user_data = user[0]
        del user_data['password']  # Don't send the password hash
        return jsonify(user_data), 200
    return jsonify({"message": "User not found"}), 40

@app.route('/api/user', methods=['PUT'])
@jwt_required()
def update_user():
    current_user_id = get_jwt_identity()
    update_data = request.json

    errors = validate_user_input(update_data)
    if errors:
        return jsonify({"errors": errors}), 400

    if 'password' in update_data:
        update_data['password'] = generate_password_hash(update_data['password'])

    result = atlas_client.update_one('info', {'_id': current_user_id}, {'$set': update_data})
    if result:
        return jsonify({"message": "User updated successfully"}), 200
    return jsonify({"message": "User not found"}), 404

@app.route('/api/delete_user', methods=['DELETE'])
def delete_user():
    user_data = request.json  # Expecting user email or username in request

    users_collection = atlas_client.get_collection('info')
    result = users_collection.delete_one({'email': user_data['email']})

    if result.deleted_count > 0:
        return jsonify({"message": "User deleted successfully"}), 200
    else:
        return jsonify({"message": "User not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)