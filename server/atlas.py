from pymongo import MongoClient

class AtlasClient():
    def __init__(self, atlas_uri, dbname):
        self.mongodb_client = MongoClient(atlas_uri)
        self.database = self.mongodb_client[dbname]

    # A quick way to test if we can connect to Atlas instance
    def ping(self):
        self.mongodb_client.admin.command('ping')

    def get_collection(self, collection_name):
        collection = self.database[collection_name]
        return collection

    def find(self, collection_name, filter={}, limit=0):
        collection = self.database[collection_name]
        items = list(collection.find(filter=filter, limit=limit))
        return items

    # Additional methods for CRUD operations
    def insert_one(self, collection_name, document):
        collection = self.database[collection_name]
        result = collection.insert_one(document)
        return result.inserted_id

    def update_one(self, collection_name, filter, update):
        collection = self.database[collection_name]
        result = collection.update_one(filter, update)
        return result.modified_count

    def delete_one(self, collection_name, filter):
        collection = self.database[collection_name]
        result = collection.delete_one(filter)
        return result.deleted_count