import requests
import json

url = "https://api.360.cn/v1/chat/completions"

payload = json.dumps({
  "model": "360gpt-pro",
  "messages": [
    {
      "role": "user",
      "content": "你好"
    }
  ],
  "stream": False,
  "temperature": 0.9,
  "max_tokens": 2048,
  "top_p": 0.5,
  "top_k": 0,
  "repetition_penalty": 1.05,
  "num_beams": 1,
  "user": "andy"
})
headers = {
  'Authorization': 'Bearer fk231997482.zOkaYOrpGaOZ7tqEFMSPRh96dwCs0GVKcd0661df',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)