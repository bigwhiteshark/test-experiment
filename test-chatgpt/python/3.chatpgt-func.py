import requests
import json

url = "https://api.360.cn/v1/chat/completions"
messages = [
          {
              "content": "帮我查询从上海去北京的火车票",
              "role": "user"
          }
]
response_message = None

def getTrain(from_, to_):
  print(from_, to_)
  return '火车票查询函数'

def getSights(location):
  print(location)
  return '景点查询'

def getWeather(location):
  print(location)
  return '天气查询'

def run_conversation():
  print('开始会话')
  payload = json.dumps({
      "model": "360gpt-pro",
      "messages": messages,
      "tool_choice": "auto",
      "tools": [
          {
              "type": "function",
              "function": {
                  "name": "getTrain",
                  "description": "查询火车票",
                  "parameters": {
                      "type": "object",
                      "properties": {
                          "from": {
                              "type": "string",
                              "description": "出发地"
                          },
                          "to": {
                              "type": "string",
                              "description": "目的地"
                          }
                      },
                      "required": [
                          "from",
                          "to"
                      ]
                  }
              }
          },
          {
              "type": "function",
              "function": {
                  "name": "getSights",
                  "description": "查询景点",
                  "parameters": {
                      "type": "object",
                      "properties": {
                          "location": {
                              "type": "string",
                              "description": "查询景点的地名"
                          }
                      },
                      "required": [
                          "location"
                      ]
                  }
              }
          },
          {
              "type": "function",
              "function": {
                  "name": "getRestaurant",
                  "description": "查询某个地点的餐馆信息",
                  "parameters": {
                      "type": "object",
                      "properties": {
                          "location": {
                              "type": "string",
                              "description": "查询餐馆的地名"
                          }
                      },
                      "required": [
                          "location"
                      ]
                  }
              }
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
  #print(response.json()['choices'])
  response_message = response.json()['choices'][0]['message']
  output(response_message)
  #print(response_message)

 
def output(response_message):
    print(response_message)
    tool_calls = response_message['tool_calls']
    if tool_calls:
        available_functions = {
            "getTrain": getTrain,
            "getSights": getSights,
            "getWeather": getWeather,
        } 
        messages.append(response_message)  # 注意这里一定要将第一轮的调用加入到上下文中
        # Step 4: send the info for each function call and function response to the model
        for tool_call in tool_calls:
            function_name = tool_call['function']['name']
            function_to_call = available_functions[function_name]
            function_args = json.loads(tool_call['function']['arguments'])
            if(function_name == 'getTrain'):
                function_response = function_to_call(
                    from_=function_args.get("from"),
                    to_=function_args.get("to"),
                )
            if(function_name == 'getSights'):
                function_response = function_to_call(
                    location=function_args.get("location"),
                )
            if(function_name == 'getWeather'):
                function_response = function_to_call(
                    location=function_args.get("location"),
                )
            
            print('function_response==>',function_response)
            messages.append(
                {
                    "tool_call_id": tool_call['id'],
                    "role": "tool", #注意这里的角色不是user也不是assistant，而是tool
                    "name": function_name,
                    "content": function_response, #注意这里仅接收字符串，不接收字典等格式
                }
            )  # extend conversation with function response
          #汇总并输出结果
           

        headers = {
          'Authorization': 'Bearer fk231997482.zOkaYOrpGaOZ7tqEFMSPRh96dwCs0GVKcd0661df',
          'Content-Type': 'application/json'
        }

        payload = json.dumps({
            "model": "360gpt-pro",
            "messages": messages,
            "tool_choice": "auto",
            "stream": False,
        })

        second_response = requests.request("POST", url, headers=headers, data=payload)
        print(second_response.json())
        return second_response

 


run_conversation()

