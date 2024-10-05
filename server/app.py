from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from db import init_db
from routes import register_routes

# Load environment variables
load_dotenv()

def create_app():
    # Initialize Flask app
    app = Flask(__name__)
    
    # Enable CORS
    CORS(app)
    
    # Configure app
    app.config['SECRET_KEY'] = os.getenv('CLIENT_SECRET')
    app.config['DEBUG'] = True  # Set to False in production
    
    # Initialize database
    app.db = init_db()
    
    # Register routes
    register_routes(app)
    
    return app

app = create_app()

@app.route("/")
def index():
    # Check if app.db is None
    if app.db is not None:
        return "Connected to MongoDB Atlas!"
    else:
        return "Failed to connect to MongoDB Atlas"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)))
