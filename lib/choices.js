
// view all departments
function viewDepartments(){
  db.query('SELECT * FROM department', function (err, result) {
  if (err) {
    console.log(err);
  }
  console.table(result)
  init()
  })
};

// view all roles
function viewRoles() {
  db.query(`SELECT
  role.id AS id,
  role.title AS title,
  department.name AS department,
  role.salary AS salary
  FROM role
  JOIN department ON role.department_id = department.id`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result)
    init()
  })
};

// view all employees
function viewEmployees() { }

// add a department
function addDepartment() { }

// add a role
function addRole() { }

// add an employee
function addEmployee() { }

// update an employee's role
function updateRole() { }






module.exports = { viewDepartments, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateRole };