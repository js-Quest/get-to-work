
-- option VIEW ALL DEPARTMENTS
USE personnel_db;
SELECT * FROM department;

-- =======================================

-- option VIEW ALL EMPLOYEES
USE personnel_db;
SELECT 
-- specifying column names and values
employee.id AS id, 
employee.first_name AS first_name, 
employee.last_name AS last_name, 
role.title AS title, 
department.name AS department,
role.salary AS salary,

-- get the whole manager name
CONCAT(manager.first_name, ' ', manager.last_name) AS manager 

FROM employee

-- get role name
JOIN role ON employee.role_id = role.id

-- get department name
JOIN department on role.department_id = department.id

-- using alias 'manager' as the second instance of 'employee' table, to reference itself so that we can get the possible manager name for that employee.
JOIN employee manager ON manager.id = employee.manager_id;

-- =================================

-- option VIEW ALL ROLES
USE personnel_db;
SELECT
  role.id AS id,
  role.title AS title,
  department.name AS department,
  role.salary AS salary
  FROM role
  JOIN department ON role.department_id = department.id;


-- ===============================
-- option ADD A DEPARTMENT
USE personnel_db;
INSERT INTO department (name)
  VALUES ('anotherDepartment');

INSERT INTO department (name)
VALUES (?);

-- ===============================
-- option ADD A ROLE

-- need department choices
INSERT INTO role (title, salary, department_id)
SELECT ?, ?, department.id FROM department WHERE department.name = ?;

-- ===============================
-- option ADD EMPLOYEE
-- need choices for: existing managers, existing roles
INSERT INTO employee (first_name, last_name, role_id, manager_id)
SELECT ?, ?, role.id FROM role WHERE role.title = ?

-- ===============================
-- option UPDATE EMPLOYEE ROLE
UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?