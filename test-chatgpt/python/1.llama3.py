import requests
import json


def llama3(prompt):
    url = 'http://localhost:11434/api/chat'
    data = {
        "model": "llama3",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "stream": False
    }

    headers = {
        "Content-Type": "application/json"
    }

    response = requests.post(url, headers=headers, json=data)
    return response


if __name__ == "__main__":
    #prompt = 'Give me an instruction to run llama3, simply several sentences'
    prompt = '你好'
    response = llama3(prompt)
    #print("here is the response: ", response.json())
    print("here is the response: ", response.json()["message"]["content"])