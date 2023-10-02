const mysql = require('mysql2/promise');
const dbConf = require('./DBConf');

// Funcion para conectarnos a la BD
async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection(dbConf);
        return connection;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    connectToDatabase
};