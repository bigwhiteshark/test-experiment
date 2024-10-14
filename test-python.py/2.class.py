class Employee:
  '''所有员工的基类'''
  employeeCount = 0

  def __init__(self, name, age, salary):
    self.name = name
    self.age = age
    self.salary = salary

  def displayEmployee(self):
    print("Name: ", self.name, ", Age: ", self.age, ", Salary: ", self.salary)
  

print ("Employee.__doc__:", Employee.__doc__)
print ("Employee.__name__:", Employee.__name__)
print ("Employee.__module__:", Employee.__module__)
print ("Employee.__bases__:", Employee.__bases__)
print ("Employee.__dict__:", Employee.__dict__)