// const { viewDepartments, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateRole} = require('./lib/choices');

const inquirer = require('inquirer');
const mysql = require('mysql2');
// connect to database
const db = mysql.createConnection(

  {
    host: 'localhost',
    user: 'root',
    // enter your mySQL password
    password: 'roothere',
    database: 'personnel_db'
  },
  console.log('//connected to personnel_db database!//')
);




function init() {
  inquirer.prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      name: 'start',
      choices: [
        'View all departments', 
        'View all roles', 
        'View all employees', 
        'Add a department', 
        'Add a role', 
        'Add an employee', 
        'Update an employee role',
        'EXIT application'
      ],
    }
  ])
  .then((answer) => {
    console.log(answer);
    switch (answer.start) {
      case 'View all departments':
        viewDepartments();
        break;
      case 'View all roles':
        viewRoles();
        break;
      case 'View all employees':
        viewEmployees();
        break;
      case 'Add a department':
        addDepartment();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      case 'Update an employee role':
        updateRole();
        break;
      case 'EXIT application':
        exit();
        break;
      default:
        console.log("ERROR, somethin ain't right")

    }
  })
};

init();

// SEE MORE NOTES IN query.sql FILE

// exit app function
function exit() {
  console.log('Bye!');
  db.end();
}

// view all departments
function viewDepartments() {
  const sqlString = `
    SELECT department.id, 
    department.name FROM department;
    `;
  db.query(sqlString, (err, result) => {
    if (err) throw err;
    console.table(result);
    init();
  })
};

// view all roles
function viewRoles() {
  const sqlString = `
    SELECT role.id, 
    role.title, 
    department.name AS department, 
    role.salary 
    FROM role 
    JOIN department ON role.department_id = department.id;
    `;
  db.query(sqlString, (err, result) => {
    if (err) throw err;
    console.table(result);
    init();
  })
};

// view all employees
function viewEmployees() {
  const sqlString = `
    SELECT employee.id,  
    employee.first_name, 
    employee.last_name, 
    role.title, 
    department.name AS department,
    role.salary,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department on role.department_id = department.id
    LEFT JOIN employee manager ON manager.id = employee.manager_id;
    `;
  db.query(sqlString, (err, result) => {
    if (err) throw err;
    console.table(result);
    init();
  })
};

// add a department
function addDepartment() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of the new department?'
    }
  ])
  .then((answer) => {
    const { name } = answer;
    const sqlString = `INSERT INTO department (name) VALUES (?)`;
    db.query(sqlString, [name], (err, result) => {
      if (err) throw err;
      console.log('<<<//------successfully added new department\\------>>>');
      viewDepartments();
    })
  })
};

// add a role
function addRole() { }

// add an employee
function addEmployee() { }

// update an employee's role
function updateRole() { }




