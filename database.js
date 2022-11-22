const { Pool } = require('pg');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    port: "5432",
    password: "password",
    database: "myecomm"
});

pool.on("connect", () => {
    console.log("databse connection");
})
pool.on("end", () => {
    console.log("databse connection end");
})

module.exports = pool;
