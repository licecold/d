// mySQL 模块
const mysql = require('mysql')
const dbConfig = require('./DBConfig.js')
// sql池
const pool = mysql.createPool(dbConfig.mysql)

module.exports = pool
