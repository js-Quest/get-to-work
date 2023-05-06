// GIVEN a command - line application that accepts user input
// WHEN I start the application 
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

// WHEN I choose to VIEW ALL DEPARTMENTS
// THEN I am presented with a formatted table showing department names and department ids
    // !enumerate department IDs
    // !departments:  FOH, BOH, Accounting, Legal, Owner

// WHEN I choose to VIEW ALL ROLES
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// !enumerate role IDs
// !Job Title
// !department
// !salary

// WHEN I choose to VIEW ALL EMPLOYEES
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
  // !enumerate employee IDs 
  // !First Name
  // !Last Name
  // !Job Title
  // !department
  //  !Salary
  //! Manager (that the employee reports to)

// WHEN I choose to ADD A DEPARTMENT
// THEN I am prompted to enter the name of the department and that department is added to the database
  // prompt
    // name of department

// WHEN I choose to ADD A ROLE
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
  // prompts
    // name of role
    // salary
    // department (list of available ones already there)

// WHEN I choose to ADD AN EMPLOYEE
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
  // prompts
    // first name
    // last name
    // role (list of ones already there)
    // manager (list of already there, make 'none' an option)

// WHEN I choose to UPDATE AN EMPLOYEE ROLE
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
  // prompts
    // choose employee from existing list
    // choose role from existing list