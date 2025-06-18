-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS market_aggregation;
USE market_aggregation;

-- Create the websites table
CREATE TABLE IF NOT EXISTS websites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    url VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

-- Create the products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    website_id INT,
    product_url VARCHAR(255),
    FOREIGN KEY (website_id) REFERENCES websites(id)
) ENGINE=InnoDB;