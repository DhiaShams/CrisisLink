from fastapi import FastAPI, Request
from pydantic import BaseModel
from ai.input_agent import extract_input_info, save_to_db

app = FastAPI()

class InputMessage(BaseModel):
    message: str

@app.post("/process-message/")
def process_message(input: InputMessage):
    structured_data = extract_input_info(input.message)
    if not structured_data:
        return {"status": "error", "message": "Could not parse input."}

    save_to_db(structured_data)
    return {"status": "success", "data": structured_data}
