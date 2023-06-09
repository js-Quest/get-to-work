USE personnel_db;

INSERT INTO department (name)
VALUES  
  ('FOH'), 
  ('BOH'), 
  ('Accounting'), 
  ('Legal'),
  ('Partner Management');

INSERT INTO role (title, salary, department_id) 
VALUES  
  ('Expo', 45000, 1),
  ('Server', 48000, 1),
  ('Bartender', 52000, 1),
  ('Manager', 62000, 1),
  ('Cook', 42000, 2),
  ('Kitchen Manager', 56000, 2),
  ('Bookkeeper', 35000, 3),
  ('Lawyer', 18000, 4),
  ('Owner', 70000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
  ('Jasper', 'Sanderson', 9, NULL),
  ('Shawna', 'Welton', 4, NULL),
  ('Clifton', 'Rodriguez', 6, NULL),
  ('Nick', 'Harris', 1, 2),
  ('Gabe', 'Wilson', 2, 2),
  ('Michelle', 'Ellis', 2, 2),
  ('Joseph', 'Gil', 3, 2),
  ('Eric', 'Sellar', 3, 2),
  ('Jennifer', 'Castro', 5, 3),
  ('Stacy', 'Randall', 5, 3),
  ('Daniel', 'Johnson', 5, 3),
  ('Kim', 'Smith', 7, NULL),
  ('Matthew', 'Carson', 8, NULL)
