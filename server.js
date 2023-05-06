
const mysql= require('mysql2');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();


// connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'roothere',
    database: 'personnel_db'
  },
  console.log('//connected to personnel_db database!//')
);
