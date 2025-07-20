import unittest
from unittest.mock import patch
from ai import input_agent

class MockPart:
    def __init__(self, text):
        self.text = text

class TestExtractInputInfo(unittest.TestCase):

    @patch("ai.input_agent.model.generate_content")
    def test_valid_response(self, mock_generate_content):
        mock_response = type("MockResponse", (), {
            "candidates": [type("MockCandidate", (), {
                "content": type("MockContent", (), {
                    "parts": [MockPart("""```json
{
  "user_type": "volunteer",
  "location": "Chennai",
  "category": "relief kits",
  "description": "Wants to volunteer for distributing relief kits"
}
```""")]
                })()
            })()]
        })()

        mock_generate_content.return_value = mock_response

        msg = "Hello, I want to volunteer for distributing relief kits in Chennai."
        result = input_agent.extract_input_info(msg)

        expected = {
            "user_type": "volunteer",
            "location": "Chennai",
            "category": "relief kits",
            "description": "Wants to volunteer for distributing relief kits"
        }

        self.assertEqual(result, expected)

    @patch("ai.input_agent.model.generate_content")
    def test_invalid_json(self, mock_generate_content):
        mock_response = type("MockResponse", (), {
            "candidates": [type("MockCandidate", (), {
                "content": type("MockContent", (), {
                    "parts": [MockPart("some invalid non-JSON response")]
                })()
            })()]
        })()

        mock_generate_content.return_value = mock_response

        msg = "Some confusing input"
        result = input_agent.extract_input_info(msg)
        self.assertEqual(result, {})  # Should gracefully fallback to empty dict


if __name__ == "__main__":
    unittest.main()
