const express = require('express');
const app = express();
const port = 3000;
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};
const mysql = require('mysql');
const connection = mysql.createConnection(config);

// Insert names into people table
const insertNamesQuery = `INSERT INTO people (name) VALUES ('Leandro Luna'), ('Full Cycle'), ('Beltrano'), ('Fulano')`;
connection.query(insertNamesQuery);

// Query to list all people names
const getNamesQuery = `SELECT name FROM people`;
connection.query(getNamesQuery, function (err, result, fields) {
    if (err) throw err;
    const names = result.map(row => row.name); // Extracting only the names from the result
    connection.end();
    startApp(names);
});

function startApp(names) {
    const listNames = names.map(name => `<li>${name}</li>`).join('');

    app.get('/', (req, res) => {
        res.send(`<h1>Full Cycle Rocks!</h1><ul>${listNames}</ul>`);
    });

    app.listen(port, () => {
        console.log(`Listening at http://localhost:${port}`);
    });
}