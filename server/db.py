import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get MongoDB connection string from environment variable
MONGO_URI = os.getenv("ATLAS_URI")

def init_db():
    """
    Initialize the MongoDB connection
    """
    try:
        # Create a new client and connect to the server
        client = MongoClient(MONGO_URI)
        
        # Send a ping to confirm a successful connection
        client.admin.command('ping')
        print("Successfully connected to MongoDB Atlas!")
        
        # Get the database
        db = client.get_database("finance0")  # Using the database name from your URI
        
        return db
    except Exception as e:
        print(f"Error connecting to MongoDB Atlas: {e}")
        return None

# You can add more database-related functions here if needed