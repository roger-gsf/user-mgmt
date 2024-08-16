const express = require('express'); // Import the Express package
const mysql = require('mysql2'); // Import the MySQL2 package
const bodyParser = require('body-parser'); // Import the Body-Parser package
const cors = require('cors'); // Import the CORS package
const bcrypt = require('bcrypt'); // Import the bcrypt package

const app = express(); // Create a new Express application
app.use(bodyParser.json()); // Use Body-Parser to handle JSON data
app.use(cors()); // Use CORS to allow requests from other origins

// Database connection configuration
const connection = mysql.createConnection({
    host: 'localhost', // MySQL server address
    user: 'root', // MySQL username
    password: '', // MySQL password (empty for XAMPP default configuration)
    database: 'user_mgmt' // Database name
});

// Connect to the database
connection.connect(error => {
    if (error) {
        console.error('Error connecting to the database: ' + error.stack); // Display an error if the connection fails
        return;
    }
    console.log('Connected to the database with ID ' + connection.threadId); // Confirm a successful connection
});

// Endpoint to add a user (POST)
app.post('/users', (req, res) => {
    const { name, email, password } = req.body; // Get the user data from the request body
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            res.status(500).send('Error hashing password.'); // Respond with an error if hashing fails
            return;
        }
        const sql = 'INSERT INTO users (user_name, user_email, user_password) VALUES (?, ?, ?)'; // SQL to insert a new user
        connection.query(sql, [name, email, hashedPassword], (error, results) => {
            if (error) {
                res.status(500).send('Error adding user.'); // Respond with an error if the insertion fails
                return;
            }
            res.status(201).send('User added successfully.'); // Respond with success if the insertion is successful
        });
    });
});

// Endpoint to get all users (GET)
app.get('/users', (req, res) => {
    connection.query('SELECT * FROM users', (error, results) => {
        if (error) {
            res.status(500).send('Error fetching users.'); // Respond with an error if the query fails
            return;
        }
        res.json(results); // Respond with the query results in JSON format
    });
});

// Endpoint to get a user by ID (GET)
app.get('/users/:user_id', (req, res) => {
    const { user_id } = req.params; // Get the user ID from the URL parameters
    connection.query('SELECT * FROM users WHERE user_id = ?', [user_id], (error, results) => {
        if (error) {
            res.status(500).send('Error fetching user.'); // Respond with an error if the query fails
            return;
        }
        res.json(results[0]); // Respond with the found user in JSON format
    });
});

// Endpoint to update a user (PUT)
app.put('/users/:user_id', (req, res) => {
    const { user_id } = req.params; // Get the user ID from the URL parameters
    const { name, email, password } = req.body; // Get the new user data from the request body
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            res.status(500).send('Error hashing password.'); // Respond with an error if hashing fails
            return;
        }
        const sql = 'UPDATE users SET user_name = ?, user_email = ?, user_password = ? WHERE user_id = ?'; // SQL to update a user
        connection.query(sql, [name, email, hashedPassword, user_id], (error, results) => {
            if (error) {
                res.status(500).send('Error updating user.'); // Respond with an error if the update fails
                return;
            }
            res.send('User updated successfully.'); // Respond with success if the update is successful
        });
    });
});

// Endpoint to delete a user (DELETE)
app.delete('/users/:user_id', (req, res) => {
    const { user_id } = req.params; // Get the user ID from the URL parameters
    connection.query('DELETE FROM users WHERE user_id = ?', [user_id], (error, results) => {
        if (error) {
            res.status(500).send('Error deleting user.'); // Respond with an error if the deletion fails
            return;
        }
        res.send('User deleted successfully.'); // Respond with success if the deletion is successful
    });
});

// Start the server
const PORT = 3000; // Define the port on which the server will run
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); // Confirm that the server is running
});
