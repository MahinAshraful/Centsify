from flask import jsonify, request, g
from functools import wraps
from jose import jwt
from urllib.request import urlopen
import json
import os
from bson import ObjectId

# Auth0 configuration
AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
API_AUDIENCE = os.getenv("API_IDENTIFIER")
ALGORITHMS = ["RS256"]

# Error handler
class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code

def get_token_auth_header():
    """Obtains the Access Token from the Authorization Header"""
    auth = request.headers.get("Authorization", None)
    if not auth:
        raise AuthError({"code": "authorization_header_missing",
                         "description":
                         "Authorization header is expected"}, 401)

    parts = auth.split()

    if parts[0].lower() != "bearer":
        raise AuthError({"code": "invalid_header",
                         "description":
                         "Authorization header must start with Bearer"}, 401)
    elif len(parts) == 1:
        raise AuthError({"code": "invalid_header",
                         "description": "Token not found"}, 401)
    elif len(parts) > 2:
        raise AuthError({"code": "invalid_header",
                         "description":
                         "Authorization header must be Bearer token"}, 401)

    token = parts[1]
    return token

def requires_auth(f):
    """Determines if the Access Token is valid"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_auth_header()
        jsonurl = urlopen(f"https://{AUTH0_DOMAIN}/.well-known/jwks.json")
        jwks = json.loads(jsonurl.read())
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
        if rsa_key:
            try:
                payload = jwt.decode(
                    token,
                    rsa_key,
                    algorithms=ALGORITHMS,
                    audience=API_AUDIENCE,
                    issuer=f"https://{AUTH0_DOMAIN}/"
                )
            except jwt.ExpiredSignatureError:
                raise AuthError({"code": "token_expired",
                                 "description": "token is expired"}, 401)
            except jwt.JWTClaimsError:
                raise AuthError({"code": "invalid_claims",
                                 "description":
                                 "incorrect claims, please check the audience and issuer"}, 401)
            except Exception:
                raise AuthError({"code": "invalid_header",
                                 "description":
                                 "Unable to parse authentication token."}, 401)

            g.current_user = payload
            return f(*args, **kwargs)
        raise AuthError({"code": "invalid_header",
                         "description": "Unable to find appropriate key"}, 401)
    return decorated

def register_routes(app):
    # Protected route example
    @app.route('/api/protected', methods=['GET'])
    @requires_auth
    def protected():
        return jsonify(message='You have access to this protected route'), 200

    # Create a new item
    @app.route('/api/items', methods=['POST'])
    @requires_auth
    def create_item():
        data = request.json
        if not data:
            return jsonify({'message': 'No input data provided'}), 400
        
        # TODO: Add validation for required fields
        
        result = app.db.items.insert_one(data)
        return jsonify({'message': 'Item created successfully', 'id': str(result.inserted_id)}), 201

    # Get all items
    @app.route('/api/items', methods=['GET'])
    @requires_auth
    def get_items():
        items = list(app.db.items.find())
        # Convert ObjectId to string for JSON serialization
        for item in items:
            item['_id'] = str(item['_id'])
        return jsonify(items), 200

    # Get a specific item
    @app.route('/api/items/<item_id>', methods=['GET'])
    @requires_auth
    def get_item(item_id):
        item = app.db.items.find_one({'_id': ObjectId(item_id)})
        if item:
            item['_id'] = str(item['_id'])
            return jsonify(item), 200
        return jsonify({'message': 'Item not found'}), 404

    # Update an item
    @app.route('/api/items/<item_id>', methods=['PUT'])
    @requires_auth
    def update_item(item_id):
        data = request.json
        if not data:
            return jsonify({'message': 'No input data provided'}), 400
        
        result = app.db.items.update_one({'_id': ObjectId(item_id)}, {'$set': data})
        if result.modified_count:
            return jsonify({'message': 'Item updated successfully'}), 200
        return jsonify({'message': 'Item not found'}), 404

    # Delete an item
    @app.route('/api/items/<item_id>', methods=['DELETE'])
    @requires_auth
    def delete_item(item_id):
        result = app.db.items.delete_one({'_id': ObjectId(item_id)})
        if result.deleted_count:
            return jsonify({'message': 'Item deleted successfully'}), 200
        return jsonify({'message': 'Item not found'}), 404

    # Error handling
    @app.errorhandler(AuthError)
    def handle_auth_error(ex):
        response = jsonify(ex.error)
        response.status_code = ex.status_code
        return response

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'message': 'Resource not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'message': 'Internal server error'}), 500