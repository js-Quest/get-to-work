DROP DATABASE IF EXISTS personnel_db;
CREATE DATABASE personnel_db;

USE personnel_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  id NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  FOREIGN KEY (department_id)
  REFERENCES department(id)
);

CREATE TABLE employee (
  id NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  FOREIGN KEY (role_id)
  REFERENCES role(title)
  ON DELETE SET NULL
);

ALTER TABLE employee 
  ADD CONSTRAINT fk_emp-mgr
  FOREIGN KEY (manager_id) 
  REFERENCES employee(employee_id)
  ON DELETE SET NULL
