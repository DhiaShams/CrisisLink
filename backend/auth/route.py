from flask import Blueprint, request, jsonify
from models.db import db
from models.user import User
import bcrypt
from ai.input_agent import extract_input_info


auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'error': 'Missing fields'}), 400

    
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 409

   
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    user=User(name=name, email=email, password=hashed_pw)
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Missing email or password'}), 400

    user=User.query.filter_by(email=email).first()

    if not user or not bcrypt.checkpw(password.encode('utf-8'), user.password):
        return jsonify({'error': 'Invalid email or password'}), 401

   
    

    return jsonify({'message': 'Login successful'}), 200

@auth_bp.route('/ai/extract', methods=['POST'] )
def extract_info():
    data=request.get_json()
    message = data.get('message')

    if not message:
        return jsonify({'error':'Missing message'}), 400
    try:
        result= extract_input_info(message)
        return jsonify({'result': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



