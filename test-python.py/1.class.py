class Employee:
  employeeCount = 0
  employSalary = 0
  def __init__(self, name, age, salary):
    self.name = name
    self.age = age
    self.salary = salary
    Employee.employeeCount += 1
    Employee.employSalary += salary

  def displayEmployee(self):
    print("Name: ", self.name, ", Age: ", self.age, ", Salary: ", self.salary)

  def displayCount(self):
    print("Total Employee %d" % Employee.employeeCount)
  
  def displaySalary(self):
    print("Total Salary %d" % Employee.employSalary)

if __name__ == "__main__":
  emp1 = Employee("Zara", 8, 2000)
  emp1.displayEmployee()
  emp1.displayCount()
  emp1.displaySalary()