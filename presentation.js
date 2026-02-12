const business = require('./business.js');
const prompt = require('prompt-sync')();

/**
 * Display all employees in a formatted table
 */
async function displayEmployees() {
    console.log('EMPLOYEE LIST');   
    const employees = await business.getAllEmployees();  
    if (employees.length === 0) {
        console.log('No employees found.');
        return;
    }   
    // Header
    console.log('ID'.padEnd(10) + 'Name'.padEnd(25) + 'Phone');   
    // Rows
    for (const emp of employees) {
        console.log(
            emp.employeeId.padEnd(10) + 
            emp.name.padEnd(25) + 
            emp.phone
        );
    }

}
/**
 * Display schedule for a specific employee in CSV-like format
 */
async function displayEmployeeSchedule() {
    console.log('VIEW EMPLOYEE SCHEDULE');   
    const empId = prompt('Enter employee ID: '); 
    // Check if employee exists
    const employee = await business.findEmployee(empId);
    if (!employee) {
        console.log('Error: Employee not found!');
        return;
    } 
    const shifts = await business.getEmployeeShifts(empId);   
    console.log(`\nSchedule for: ${employee.name} (${empId})`);
    
    if (shifts.length === 0) {
        console.log('No shifts assigned.');
    } else {
        // Header
        console.log('Date'.padEnd(15) + 'Start'.padEnd(10) + 'End'.padEnd(10) + 'Hours');
        
        // Rows
        for (const shift of shifts) {
            const hours = business.computeShiftDuration(shift.startTime, shift.endTime);
            console.log(
                shift.date.padEnd(15) + 
                shift.startTime.padEnd(10) + 
                shift.endTime.padEnd(10) + 
                hours.toFixed(1)
            );
        }
    }
}
displayEmployeeSchedule()

module.exports = {
    displayEmployees,
    displayEmployeeSchedule
};
