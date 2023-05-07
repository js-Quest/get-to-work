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
      message: 'What is the name of the new Department?'
    }
  ])
  .then((answer) => {
    const { name } = answer;
    const sqlString = `INSERT INTO department (name) VALUES (?)`;
    db.query(sqlString, [name], (err, result) => {
      if (err) throw err;
      console.log('<<<//------successfully added new Department//------>>>');
      viewDepartments();
    })
  })
};

// add a role
function addRole() { 
  const sqlString = `SELECT department.name FROM department`;
  db.query(sqlString, (err, result) => {
    if (err) throw err;
    const departments = result.map((item) => `${item.name}`);
    inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'what is the title of the new Role?'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'what is the salary of this role?'
      },
      {
        type: 'list',
        name:'department',
        message: 'what department does this role belong to?',
        choices: [...departments]
      }
    ])
    .then((answer) => {
      const { title, salary, department } = answer;
      const sqlString = `
        INSERT INTO role (title, salary, department_id)
        SELECT ?, ?, department.id 
        FROM department WHERE department.name = ?`;
      db.query(sqlString, [title, salary, department], (err, result) => {
        if (err) throw err;
        console.log('<<<///------successfully added new Role///------>>>');
        viewRoles();
      })
    })
  })
};


// add an employee
function addEmployee() { 
  const sqlStr1 = `SELECT id, title FROM role WHERE title NOT LIKE '%manager%';`;
  let firstInquiry;
  Promise.resolve()
  .then(()=> {
    return new Promise((resolve,reject) => {
      db.query(sqlStr1, (err, result) => {
        if(err) reject(err)
        else resolve(result);
      })
    })
  })
  .then((rolesResult)=> {
    const roles = rolesResult.map((item)=> `${item.title}`)

    return inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'what is the first name of the new employee?'
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'what is the last name of the employee?'
      },
      {
        type: 'list',
        name: 'role',
        message: 'what is the role of the employee?',
        choices: [...roles]
      }
    ])
  })
  .then((answer) => {
    firstInquiry = answer;
    const sqlStr2 = `
      SELECT manager.id as manager, 
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM employee
      JOIN role ON employee.role_id = role.id
      LEFT JOIN employee AS manager ON manager.id = employee.manager_id
      WHERE manager.id IS NOT NULL
      GROUP BY manager_id;
      `;
    return new Promise((resolve,reject) => {
      db.query(sqlStr2, (err,result) => {
        if (err) reject(err)
        else resolve(result);
      })
    })
  })
  .then((managerResult) => {
    const managers = managerResult.map((item)=> `${item.manager_name} id:${item.manager_id}`);
    return inquirer.prompt([
      {
        type: 'list',
        name: 'manager',
        message:'Who is the manager for this employee?',
        choices: [...managers, 'none']
      }
    ])
  })
  .then((answer) => {
    const sqlString = `
      INSERT INTO employee (first_name, last_name, role_id, manager_id)
      VALUES (?,?,?,?);
    `;
    db.query(sqlString, [firstInquiry.first_name, firstInquiry.last_name, firstInquiry.role.split('id: ')[1], answer.manager.split('id: ')[2], (err,result) => {
      if (err) throw err;
      else console.log('<<<///------successfully added new Employee///------>>>')
    }])
  })
}

// update an employee's role
function updateRole() { }




