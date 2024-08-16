const API_URL = 'http://localhost:3000/users'; // API URL for user management

// Function to add a user
function addUser() {
    const name = document.getElementById('name').value.trim(); // Get the value of the name field
    const email = document.getElementById('email').value.trim(); // Get the value of the email field
    const password = document.getElementById('password').value.trim(); // Get the value of the password field

    if (!name || !email || !password) {
        alert('All fields are required.'); // Display an alert if any field is empty
        return;
    }

    fetch(API_URL, {
        method: 'POST', // HTTP method for adding data
        headers: {
            'Content-Type': 'application/json' // Set the content type to JSON
        },
        body: JSON.stringify({ name, email, password }) // Convert the data to JSON
    })
        .then(response => response.text()) // Convert the response to text
        .then(data => {
            alert(data); // Display an alert message with the response
            cleanForm(); // Clear the form fields
            getUsers(); // Update the list of users
        })
        .catch(error => {
            alert('An error occurred: ' + error.message); // Display error messages to the user
        });
}

// Function to get all users
function getUsers() {
    fetch(API_URL) // Make a GET request to the API
        .then(response => response.json()) // Convert the response to JSON
        .then(data => {
            const userList = document.getElementById('users'); // Get the user list element
            userList.innerHTML = ''; // Clear the list content
            data.forEach(user => { // Iterate over each user
                const li = document.createElement('li'); // Create a new list item element
                li.innerHTML = `${user.user_name} - ${user.user_email} <button onclick="deleteUser(${user.user_id})">Delete</button>`; // Set the HTML content of the list item
                userList.appendChild(li); // Add the item to the list
            });
        })
        .catch(error => {
            alert('An error occurred: ' + error.message); // Display error messages to the user
        });
}

// Function to delete a user
function deleteUser(id) {
    fetch(`${API_URL}/${id}`, {
        method: 'DELETE' // HTTP method for deleting data
    })
        .then(response => response.text()) // Convert the response to text
        .then(data => {
            alert(data); // Display an alert message with the response
            getUsers(); // Update the list of users
        })
        .catch(error => {
            alert('An error occurred: ' + error.message); // Display error messages to the user
        });
}

// Function to clear the form
function cleanForm() {
    document.getElementById('name').value = ''; // Clear the name field
    document.getElementById('email').value = ''; // Clear the email field
    document.getElementById('password').value = ''; // Clear the password field
}

// Load users when the page is loaded
window.onload = getUsers; // Set the function to be called when the page is loaded
