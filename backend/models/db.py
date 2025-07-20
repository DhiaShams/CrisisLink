from flask_sqlalchemy import SQLAlchemy
from flask import Flask
import psycopg2
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# SQLAlchemy instance
db = SQLAlchemy()

def init_app(app):
    app.config['SQLALCHEMY_DATABASE_URI'] = (
        f"postgresql://crisislink_user:{os.getenv('DB_PASSWORD')}@localhost:5432/crisislink_db"
    )
    db.init_app(app)


def get_db_connection():
    """
    Returns a raw psycopg2 connection for direct SQL queries (e.g., for AI agent).
    """
    return psycopg2.connect(
        dbname=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        host=os.getenv("POSTGRES_HOST"),
        port=os.getenv("POSTGRES_PORT", 5432)
    )
