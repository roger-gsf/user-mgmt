const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Database connection configuration
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'user_mgmt'
});

connection.connect(error => {
    if (error) {
        console.error('Error connecting to the database: ' + error.stack);
        return;
    }
    console.log('Connected to the database with ID ' + connection.threadId);
});

// Endpoint to add a user (POST)
app.post('/users', (req, res) => {
    const { name, email, password } = req.body;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            res.status(500).send('Error hashing password.');
            return;
        }
        const sql = 'INSERT INTO users (user_name, user_email, user_password) VALUES (?, ?, ?)';
        connection.query(sql, [name, email, hashedPassword], (error, results) => {
            if (error) {
                res.status(500).send('Error adding user.');
                return;
            }
            res.status(201).send('User added successfully.');
        });
    });
});

// Endpoint to get all users (GET)
app.get('/users', (req, res) => {
    connection.query('SELECT * FROM users', (error, results) => {
        if (error) {
            res.status(500).send('Error fetching users.');
            return;
        }
        res.json(results);
    });
});

// Endpoint to get a user by ID (GET)
app.get('/users/:user_id', (req, res) => {
    const { user_id } = req.params;
    connection.query('SELECT * FROM users WHERE user_id = ?', [user_id], (error, results) => {
        if (error) {
            res.status(500).send('Error fetching user.');
            return;
        }
        res.json(results[0]);
    });
});

// Endpoint to update a user (PUT)
app.put('/users/:user_id', (req, res) => {
    const { user_id } = req.params;
    const { name, email, password } = req.body;

    if (password) {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                res.status(500).send('Error hashing password.');
                return;
            }
            const sql = 'UPDATE users SET user_name = ?, user_email = ?, user_password = ? WHERE user_id = ?';
            connection.query(sql, [name, email, hashedPassword, user_id], handleUpdate);
        });
    } else {
        const sql = 'UPDATE users SET user_name = ?, user_email = ? WHERE user_id = ?';
        connection.query(sql, [name, email, user_id], handleUpdate);
    }

    function handleUpdate(error, results) {
        if (error) {
            res.status(500).send('Error updating user.');
            return;
        }
        res.send('User updated successfully.');
    }
});

// Endpoint to delete a user (DELETE)
app.delete('/users/:user_id', (req, res) => {
    const { user_id } = req.params;
    connection.query('DELETE FROM users WHERE user_id = ?', [user_id], (error, results) => {
        if (error) {
            res.status(500).send('Error deleting user.');
            return;
        }
        res.send('User deleted successfully.');
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
