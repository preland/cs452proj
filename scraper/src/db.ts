import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'abcd1234',
    database: 'market_aggregation',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});