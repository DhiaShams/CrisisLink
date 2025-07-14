from flask import Flask
from flask_cors import CORS
from models.db import users_collection
from auth.route import auth_bp 


app = Flask(__name__)
CORS(app)  


app.register_blueprint(auth_bp, url_prefix="/")


if __name__ == "__main__":
    app.run(debug=True)
















