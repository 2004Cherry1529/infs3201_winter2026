const fs = require('fs').promises;

/**
 * Reads all employees from employees.json
 * @returns {Promise<Array>} Array of employee objects
 */
async function readEmployees() {
    let data = await fs.readFile('employees.json', 'utf8');
    return JSON.parse(data);
}

module.exports = {
    readEmployees
};