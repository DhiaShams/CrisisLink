from flask import Flask
from flask_cors import CORS
from models.db import init_app, db
from auth.route import auth_bp 



app = Flask(__name__)
CORS(app)  

init_app(app)

app.register_blueprint(auth_bp, url_prefix="/")


if __name__ == "__main__":
    with app.app_context():
        db.create_all()  
    
    app.run(debug=True)
















