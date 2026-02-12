const business = require('./business.js');
const prompt = require('prompt-sync')();

/**
 * Display all employees in a formatted table
 */
async function displayEmployees() {
    console.log('\n' + '='.repeat(60));
    console.log('EMPLOYEE LIST');
    console.log('='.repeat(60));
    
    const employees = await business.getAllEmployees();
    
    if (employees.length === 0) {
        console.log('No employees found.');
        return;
    }
    
    // Header
    console.log('ID'.padEnd(10) + 'Name'.padEnd(25) + 'Phone');
    console.log('-'.repeat(60));
    
    // Rows
    for (const emp of employees) {
        console.log(
            emp.employeeId.padEnd(10) + 
            emp.name.padEnd(25) + 
            emp.phone
        );
    }
    console.log('='.repeat(60) + '\n');
}

module.exports = {
    displayEmployees
};