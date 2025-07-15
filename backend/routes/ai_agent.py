from flask import Blueprint, request, jsonify
from ai.input_agent import extract_input_info, save_to_db

ai_bp = Blueprint("ai", __name__)

@ai_bp.route("/process-input", methods=["POST"])
def process_input():
    message = request.json.get("message")
    if not message:
        return jsonify({"error": "Missing input message"}), 400

    result = extract_input_info(message)
    if not result:
        return jsonify({"error": "Failed to extract structured data"}), 500

    save_to_db(result)
    return jsonify(result), 200
