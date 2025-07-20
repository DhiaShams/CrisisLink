from flask import Blueprint, request, jsonify
from ai.input_agent import extract_input_info, save_to_db

ai_bp = Blueprint("ai_bp", __name__)

@ai_bp.route("/", methods=["GET"])
def root():
    return jsonify({"message": "Welcome to CrisisLink Input Agent API"}), 200

@ai_bp.route("/process-input", methods=["POST"])
def process_input():
    try:
        data = request.get_json()
        if not data or "message" not in data:
            return jsonify({"error": "Missing input message"}), 400

        message = data["message"]
        result = extract_input_info(message)

        if not result:
            return jsonify({"error": "Failed to extract structured data"}), 500

        save_to_db(result)

        return jsonify({
            "status": "success",
            "data": result
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
