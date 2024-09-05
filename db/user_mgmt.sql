CREATE DATABASE user_mgmt;
USE user_mgmt;

CREATE TABLE users (
    user_id SMALLINT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL
);