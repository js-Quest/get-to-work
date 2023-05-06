const express = require('express');
const mysql= require('mysql2');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

// express middleware
app.use(express.urlencoded({extended: false}));
app,use(express.json());

// connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'roothere',
    database: 'personnel_db'
  },
  console.log('connected to personnel_db database!')
);
