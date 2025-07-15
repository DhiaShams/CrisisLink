import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def get_pg_connection():
    return psycopg2.connect(
        dbname="crisislink_db",
        user="crisislink_user",
        password=os.getenv("POSTGRES_PASSWORD"),
        host="localhost",
        port="5432"
    )
