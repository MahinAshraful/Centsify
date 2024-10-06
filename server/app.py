from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from db import init_db
from routes import register_routes
from auth import AuthError, requires_auth, get_token_auth_header, get_user_info

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config['SECRET_KEY'] = os.getenv('CLIENT_SECRET')
    app.config['DEBUG'] = True  # Set to False in production
    app.db = init_db()

    register_routes(app)

    @app.errorhandler(AuthError)
    def handle_auth_error(ex):
        response = jsonify(ex.error)
        response.status_code = ex.status_code
        return response

    @app.route('/api/user', methods=['GET'])
    @requires_auth
    def get_current_user():
        token = get_token_auth_header()
        user_info = get_user_info(token)
        user = app.db.info.find_one({'auth0_id': user_info['auth0_id']})
        if not user:
            # Create user if not exists
            result = app.db.info.insert_one(user_info)
            user_info['_id'] = str(result.inserted_id)
            return jsonify(user_info), 201
        user['_id'] = str(user['_id'])
        return jsonify(user), 200

    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)))