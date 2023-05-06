USE personnel_db;
-- option VIEW ALL DEPARTMENTS
USE personnel_db;
SELECT * FROM department;

-- option VIEW ALL EMPLOYEES
USE personnel_db;

SELECT 
employee.id AS id, 
employee.first_name AS first_name, 
employee.last_name AS last_name, 
role.title AS title, 
department.name AS department,
role.salary AS salary,
CONCAT(manager.first_name, ' ', manager.last_name) AS manager 

FROM employee

JOIN role ON employee.role_id = role.id
JOIN department on role.department_id = department.id
JOIN employee manager ON manager.id = employee.manager_id;


