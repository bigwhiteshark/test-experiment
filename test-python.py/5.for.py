#%%
names = ['Bill', 'Bob', 'Joe']
# for name in range(1,13):
#   print(name)

count = 10
while True:
  if(count == 0):
    break
  count = count - 1
  print(count)

for name in names:
  if(name == 'Joe'):
    continue
  print(name)
else:
  print('Done')

# %%
