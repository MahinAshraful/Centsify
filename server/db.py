import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("ATLAS_URI")

def init_db():
    try:
        client = MongoClient(MONGO_URI)
        client.admin.command('ping')
        print("Successfully connected to MongoDB Atlas!")
        db = client.get_database("users")
        return db
    except Exception as e:
        print(f"Error connecting to MongoDB Atlas: {e}")
        return None