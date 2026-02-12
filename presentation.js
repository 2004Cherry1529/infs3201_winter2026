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
async function addNewEmployee() {
    console.log('ADD NEW EMPLOYEE');
    const name = prompt('Enter employee name: ');
    if (!name) {
        console.log('Error: Name cannot be empty!');
        return;
    }
    
    const phone = prompt('Enter phone number: ');
    if (!phone) {
        console.log('Error: Phone cannot be empty!');
        return;
    }
    
    const newEmployee = await business.addEmployee({ name, phone });
    
    console.log(' Employee added successfully!');
    console.log(`   ID: ${newEmployee.employeeId}`);
    console.log(`   Name: ${newEmployee.name}`);
    console.log(`   Phone: ${newEmployee.phone}`);
}
async function assignEmployeeToShift() {
    console.log('ASSIGN EMPLOYEE TO SHIFT');
    
    const empId = prompt('Enter employee ID: ');
    
    const employee = await business.findEmployee(empId);
    if (!employee) {
        console.log(' Error: Employee does not exist!');
        return;
    }
    
    const shiftId = prompt('Enter shift ID: ');
    
    const shift = await business.findShift(shiftId);
    if (!shift) {
        console.log(' Error: Shift does not exist!');
        return;
    }
    
    console.log('\nShift Details:');
    console.log(`   Date: ${shift.date}`);
    console.log(`   Time: ${shift.startTime} - ${shift.endTime}`);
    
    const confirm = prompt('\nConfirm assignment? (y/n): ');
    if (confirm.toLowerCase() !== 'y') {
        console.log(' Assignment cancelled.');
        return;
    }
    
    const result = await business.assignShift(empId, shiftId);
    
    if (result === 'Ok') {
        console.log(' Shift Recorded Successfully!');
    } else {
        console.log(`${result}`); // Shows hours limit error message
    }

}
function showMenu() {
    console.log('EMPLOYEE SCHEDULING SYSTEM');
    console.log('1. Show all employees');
    console.log('2. Add new employee');
    console.log('3. Assign employee to shift');
    console.log('4. View employee schedule');
    console.log('5. Exit');
}

async function main() {
    console.log('Welcome to Employee Scheduling System');
    
    let running = true;
    while (running) {
        showMenu();
        const choice = prompt('What is your choice > ');
        
        switch (choice) {
            case '1':
                await displayEmployees();
                break;
            case '2':
                await addNewEmployee();
                break;
            case '3':
                await assignEmployeeToShift();
                break;
            case '4':
                await displayEmployeeSchedule();
                break;
            case '5':
                running = false;
                break;
            default:
                console.log(' Error: Invalid selection. Please enter 1-5.\n');
        }
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    displayEmployees,
    displayEmployeeSchedule,
    addNewEmployee,
    assignEmployeeToShift,
    main
}
