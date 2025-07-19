from flask import Flask
from flask_cors import CORS
from models.db import init_app, db
from auth.route import auth_bp  # Blueprint for authentication-related routes

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for frontend-backend communication

# Initialize database configuration and SQLAlchemy
init_app(app)

# Register authentication blueprint
app.register_blueprint(auth_bp, url_prefix="/")

if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create tables if they don't exist
    
    app.run(debug=True)  # Start Flask server in debug mode
