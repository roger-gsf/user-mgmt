const API_URL = "http://localhost:3000/users"; // API URL for user management

// Function to add a user
function addUser() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!name || !email || !password) {
        alert("All fields are required.");
        return;
    }

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
    })
    .then((response) => response.text())
    .then((data) => {
        alert(data);
        cleanForm();
        getUsers();
    })
    .catch((error) => {
        alert("An error occurred: " + error.message);
    });
}

// Function to get all users
function getUsers() {
    fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
        const userList = document.getElementById("users");
        userList.innerHTML = "";

        data.forEach((user) => {
            const li = document.createElement("li");

            li.innerHTML = `
                <input type="text" value="${user.user_name}" id="name-${user.user_id}" onchange="updateUser(${user.user_id})" />
                <input type="email" value="${user.user_email}" id="email-${user.user_id}" onchange="updateUser(${user.user_id})" />
                <button style="width: 25%" onclick="deleteUser(${user.user_id})">Delete</button>
            `;

            userList.appendChild(li);
        });
    })
    .catch((error) => {
        alert("An error occurred: " + error.message);
    });
}

// Function to update a user
function updateUser(userId) {
    const name = document.getElementById(`name-${userId}`).value.trim();
    const email = document.getElementById(`email-${userId}`).value.trim();

    if (!name || !email) {
        alert("Name and email cannot be empty.");
        return;
    }

    fetch(`${API_URL}/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password: "" }),
    })
    .then((response) => response.text())
    .then((data) => {
        alert(data);
        getUsers();
    })
    .catch((error) => {
        alert("An error occurred: " + error.message);
    });
}

// Function to delete a user
function deleteUser(id) {
    fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    })
    .then((response) => response.text())
    .then((data) => {
        alert(data);
        getUsers();
    })
    .catch((error) => {
        alert("An error occurred: " + error.message);
    });
}

// Function to clear the form
function cleanForm() {
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
}

// Load users when the page is loaded
window.onload = getUsers;
