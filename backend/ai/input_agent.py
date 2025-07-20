import os
from dotenv import load_dotenv
import google.generativeai as genai

from models.postgres_db import get_pg_connection
import json

# Load your Gemini API key from .env
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# ✅ Use a currently supported model
model = genai.GenerativeModel(model_name="gemini-1.5-flash")


def extract_input_info(message: str) -> dict:
    prompt = f"""
You are an AI that extracts structured data from messages during a disaster relief operation.

Given this message: "{message}"

Return ONLY a JSON object with the following fields:
- user_type: "donor", "requester", or "volunteer"
- location: city or place mentioned
- category: type of item/help (like food, water, medicine, clothes, shelter)
- description: one-line summary of what they want or offer

Respond with only a valid JSON object.
"""
    response = model.generate_content([prompt])
    try:
        content = response.candidates[0].content.parts[0].text.strip()

        # Remove Markdown code block if present
        if content.startswith("```"):
            content = content.split("```")[1].strip()
            if content.lower().startswith("json"):
                content = content[len("json"):].strip()

        return json.loads(content)
    except Exception as e:
        print("Error parsing response:", e)
        print("Raw response:", response)
        return {}

def save_to_db(data):
    try:
        conn = get_pg_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO input_requests (user_type, location, category, description)
            VALUES (%s, %s, %s, %s)
        """, (data['user_type'], data['location'], data['category'], data['description']))
        conn.commit()
    except Exception as e:
        print("❌ DB Error:", e)
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()


# 🧪 Test
if __name__ == "__main__":
    test_msg = "We are in need of 500 baby cloth sets at Thodupuzha."
    print("Input:", test_msg)
    result = extract_input_info(test_msg)
    print("Structured Output:\n", result)
