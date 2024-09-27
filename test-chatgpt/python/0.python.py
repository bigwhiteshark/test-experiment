import json
person = {
  'age': 30,
  'name': "John",
  'address': {
    'city': "New York",
    'state': "NY"
  }
}

# 将 Python 对象编码为 JSON 字符串
#person_json = json.dumps(person)
person_json = json.dumps(person, indent=4)

# 将 JSON 字符串解码为 Python 对象
person = json.loads(person_json)

#print(person['age'])
#print(person_json)

response = [
  {'message': 
   {'role': 'assistant', 'content': '', 'tool_calls': 
    [{'id': '0', 'type': 'function', 'function': 
      {'name': 'getTrain', 'arguments': '{"from":"上海","to":"北京"}'}}]},
        'finish_reason': 'tool_calls', 'index': 0}]
{'role': 'assistant', 'content': '', 'tool_calls': 
 [
   {'id': '0', 'type': 'function', 'function': 
    {'name': 'getTrain', 
    'arguments': '{"from":"上海","to":"北京"}'
                                                }}
  ]}


test = {'role': 'assistant', 'content': '', 'tool_calls': [{'id': '0', 'type': 'function', 'function': {'name': 'getTrain', 'arguments': '{"from":"上海","to":"北京"}'}}]}
print(test['tool_calls'])