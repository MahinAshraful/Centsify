from flask import jsonify, request
from bson import ObjectId
from auth import requires_auth
from werkzeug.security import generate_password_hash
import os
import requests

def register_routes(app):
    @app.route('/api/protected', methods=['GET'])
    @requires_auth
    def protected():
        return jsonify(message='You have access to this protected route'), 200

    @app.route('/api/items', methods=['POST'])
    @requires_auth
    def create_item():
        data = request.json
        if not data:
            return jsonify({'message': 'No input data provided'}), 400
        result = app.db.info.insert_one(data)
        return jsonify({'message': 'Item created successfully', 'id': str(result.inserted_id)}), 201

    @app.route('/api/items', methods=['GET'])
    @requires_auth
    def get_items():
        items = list(app.db.info.find())
        for item in items:
            item['_id'] = str(item['_id'])
        return jsonify(items), 200

    @app.route('/api/items/<item_id>', methods=['GET'])
    @requires_auth
    def get_item(item_id):
        item = app.db.info.find_one({'_id': ObjectId(item_id)})
        if item:
            item['_id'] = str(item['_id'])
            return jsonify(item), 200
        return jsonify({'message': 'Item not found'}), 404

    @app.route('/api/items/<item_id>', methods=['PUT'])
    @requires_auth
    def update_item(item_id):
        data = request.json
        if not data:
            return jsonify({'message': 'No input data provided'}), 400
        result = app.db.info.update_one({'_id': ObjectId(item_id)}, {'$set': data})
        if result.modified_count:
            return jsonify({'message': 'Item updated successfully'}), 200
        return jsonify({'message': 'Item not found'}), 404

    @app.route('/api/items/<item_id>', methods=['DELETE'])
    @requires_auth
    def delete_item(item_id):
        result = app.db.info.delete_one({'_id': ObjectId(item_id)})
        if result.deleted_count:
            return jsonify({'message': 'Item deleted successfully'}), 200
        return jsonify({'message': 'Item not found'}), 404

    @app.route('/api/signup', methods=['POST'])
    def signup():
        try:
            # Get user info from request
            user_info = request.json
            
            # Validate user input
            if not user_info or 'email' not in user_info or 'password' not in user_info:
                return jsonify({'error': 'Email and password are required'}), 400
            
            # Check if user already exists
            existing_user = app.db.info.find_one({'email': user_info['email']})
            if existing_user:
                return jsonify({'error': 'User with this email already exists'}), 409
            
            # Create user in Auth0
            auth0_token = get_auth0_token()
            auth0_user = create_user_in_auth0(user_info, auth0_token)
            
            if auth0_user:
                # Hash the password before storing
                hashed_password = generate_password_hash(user_info['password'])
                
                # Create user document
                user_doc = {
                    'auth0_id': auth0_user['user_id'],
                    'email': user_info['email'],
                    'name': user_info.get('name', ''),
                    'password': hashed_password
                }
                
                # Insert into MongoDB
                result = app.db.info.insert_one(user_doc)
                
                if result.inserted_id:
                    return jsonify({'message': 'User created successfully'}), 201
                else:
                    return jsonify({'error': 'Failed to create user in database'}), 500
            else:
                return jsonify({'error': 'Failed to create user in Auth0'}), 500
        
        except Exception as e:
            print(f"Signup error: {str(e)}")
            return jsonify({'error': 'An error occurred during signup'}), 500

def get_auth0_token():
    url = f"https://{os.getenv('AUTH0_DOMAIN')}/oauth/token"
    payload = {
        "client_id": os.getenv("AUTH0_CLIENT_ID"),
        "client_secret": os.getenv("AUTH0_CLIENT_SECRET"),
        "audience": f"https://{os.getenv('AUTH0_DOMAIN')}/api/v2/",
        "grant_type": "client_credentials"
    }
    response = requests.post(url, json=payload)
    return response.json()['access_token']

def create_user_in_auth0(user_info, token):
    url = f"https://{os.getenv('AUTH0_DOMAIN')}/api/v2/users"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    payload = {
        "email": user_info['email'],
        "password": user_info['password'],
        "connection": "Username-Password-Authentication"
    }
    response = requests.post(url, json=payload, headers=headers)
    return response.json() if response.status_code == 201 else None
