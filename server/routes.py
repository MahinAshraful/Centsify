from flask import jsonify, request
from bson import ObjectId
from auth import requires_auth

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