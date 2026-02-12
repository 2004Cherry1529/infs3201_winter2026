const fs = require('fs').promises;

/**
 * Reads all employees from employees.json
 * @returns {Promise<Array>} Array of employee objects
 */
async function readEmployees() {
    let data = await fs.readFile('employees.json', 'utf8');
    return JSON.parse(data);
}

/**
 * Writes employees array to employees.json
 * @param {Array} employees - Array of employee objects
 */
async function writeEmployees(employees) {
    await fs.writeFile('employees.json', JSON.stringify(employees, null, 4));
}
module.exports = {
    readEmployees,
    writeEmployees
};