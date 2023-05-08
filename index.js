const figlet = require("figlet");
const inquirer = require('inquirer');
const mysql = require('mysql2');
// connect to database
const db = mysql.createConnection(

  {
    host: 'localhost',
    user: 'root',

    // !enter your mySQL password!
    password: 'roothere',
    database: 'personnel_db'
  },
  console.log('//connected to personnel_db database!//')
);

figlet("Employee Database", function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(data);
  init();
});

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
        'Delete an employee',
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
        case 'Delete an employee':
          deleteEmployee();
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

// SEE EVEN MORE NOTES IN query.sql FILE

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
      db.query(sqlString, name, (err, result) => {
        if (err) throw err;
        console.log(`\n<<<//------successfully added new Department: ${name}//------>>>`);
        viewDepartments();
      })
    })
};

// add a role
function addRole() {
  const sqlString = `SELECT department.name FROM department`;
  db.query(sqlString, (err, result) => {
    if (err) throw err;

    // get array of departments to throw into the choices
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
        name: 'department',
        message: 'what department does this role belong to?',
        choices: departments
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
          console.log('\n<<<///------successfully added new Role///------>>>');
          viewRoles();
        })
      })
  })
};


// add an employee - Michael Reagan suggested promises would be very helpful in this project, so I researched more about promises.
function addEmployee() {
  const sqlStr1 = `SELECT id, title FROM role;`;
  let firstInquiry;
  Promise.resolve()
    .then(() => {
      return new Promise((resolve, reject) => {
        db.query(sqlStr1, (err, result) => {
          if (err) reject(err)
          else resolve(result);
        })
      })
    })
    .then((rolesResult) => {

      // get array of roles to throw in choices, need ID listed to get the title name later when inserted to table
      const roles = rolesResult.map((item) => `Title: ${item.title}, ID: ${item.id}`)

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
          choices: roles
        }
      ])
    })
    .then((answer) => {
      firstInquiry = answer;
      const sqlStr2 = `
      SELECT manager.id as manager_id, 
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
      FROM employee
      JOIN role ON employee.role_id = role.id
      LEFT JOIN employee AS manager ON manager.id = employee.manager_id
      WHERE manager.id IS NOT NULL
      GROUP BY manager_id;
      `;
      return new Promise((resolve, reject) => {
        db.query(sqlStr2, (err, result) => {
          if (err) reject(err)
          else resolve(result);
        })
      })
    })
    .then((managerResult) => {
      // get array of managers to throw in choices, need ID listed to get the manager name later when inserted to table
      const managers = managerResult.map((item) => `Manager: ${item.manager_name}, ID: ${item.manager_id}`);
      // console.log(managers);
      return inquirer.prompt([
        {
          type: 'list',
          name: 'manager',
          message: 'Who is the manager for this employee? The manager must be within the same department for proper reporting.',
          choices: [...managers, 'none']
        }
      ])
    })
    .then((answer) => {
      const sqlString = `
      INSERT INTO employee (first_name, last_name, role_id, manager_id)
      VALUES (?,?,?,?);
    `;

      // need to get the ID numbers to get the keys to match role title and manager name
      db.query(sqlString, [firstInquiry.first_name, firstInquiry.last_name, firstInquiry.role.split("ID: ")[1], answer.manager.split("ID: ")[1]], (err, result) => {
        if (err) throw err;
        console.log(`\n <<<///------successfully added new Employee ${firstInquiry.first_name} ${firstInquiry.last_name}///------>>>`);
        viewEmployees();
      })
    })
};

// update an employee's role
function updateRole() {
  const sqlStr1 = `SELECT first_name, last_name FROM employee`;
  Promise.resolve()
    .then(() => {
      return new Promise((resolve, reject) => {
        db.query(sqlStr1, (err, result) => {
          if (err) throw err;
          else resolve(result);
        })
      })
    })
    .then((employeeResult) => {
      // get array of existing employees for the prompt choices
      const employee = employeeResult.map((item) =>
        `${item.first_name} ${item.last_name}`);
      return inquirer.prompt([
        {
          type: 'list',
          name: 'employee',
          message: 'Which employee needs their role updated?',
          choices: employee
        }
      ])
    })
    .then((answer) => {
      const thisEmployee = answer.employee.split(' ');
      const firstName = thisEmployee[0];
      const lastName = thisEmployee[1];
      const sqlStr2 = `SELECT title FROM role`;
      return new Promise((resolve, reject) => {
        db.query(sqlStr2, (err, result) => {
          if (err) reject(err)
          else resolve(result);
        })
      })
        .then((rolesResult) => {
          const roles = rolesResult.map((item) => item.title)
          inquirer.prompt([
            {
              type: 'list',
              name: 'role',
              message: 'What role would you like to assign?',
              choices: roles
            }
          ])
            .then((answer) => {
              const sqlString3 = `SELECT id FROM role WHERE title = ?`;
              db.query(sqlString3, answer.role, (err, result) => {
                if (err) throw err;
                const roleId = result[0].id;
                const sqlString = `UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?`
                db.query(sqlString, [roleId, firstName, lastName], (err, result) => {
                  if (err) throw err;
                  console.log(`\n <<<///------successfully updated ${firstName} ${lastName}'s Role to ${answer.role}///------>>>`)
                  viewEmployees();
                })
              })
            })
        })
    })
};


function deleteEmployee() {
  sqlString = `SELECT id, first_name, last_name FROM employee WHERE manager_id NOT LIKE '%null%'`;
  Promise.resolve()
    .then(() => {
      return new Promise((resolve, reject) => {
        db.query(sqlString, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        })
      })
    })
    .then((employeeResult) => {
      const employees = employeeResult.map((item) => `${item.first_name} ${item.last_name} ID: ${item.id}`);
      return inquirer.prompt([
        {
          type: 'list',
          name: 'employee',
          message: 'Which employee would you like to Delete?',
          choices: employees
        }
      ])
        .then((answer) => {
          const sqlStr = `DELETE FROM employee WHERE id = ?;`;
          db.query(sqlStr, answer.employee.split('ID: ')[1], (err, result) => {
            if (err) throw err;
            console.log(`\n<<<///------successfully Deleted Employee ${answer.employee.split('ID: ')[0]}///------>>>`);
            viewEmployees();
          })
        })
    })
}




