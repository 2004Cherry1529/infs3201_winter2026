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

/**
 * Finds a single employee by their ID
 * @param {string} empId - Employee ID to find (e.g., 'E001')
 * @returns {Promise<Object|null>} Employee object or null if not found
 */
async function findEmployee(empId) {
    const employees = await readEmployees();
    // ❌ REMOVED .find() - replaced with for loop
    for (let emp of employees) {
        if (emp.employeeId === empId) {
            return emp;
        }
    }
    return null;
}

// ----- SHIFTS -----
async function readShifts() {
    let data = await fs.readFile('shifts.json', 'utf8');
    return JSON.parse(data);
}

async function writeShifts(shifts) {
    await fs.writeFile('shifts.json', JSON.stringify(shifts, null, 4));
}

async function findShift(shiftId) {
    let shifts = await readShifts();
    // ❌ REMOVED .find() - replaced with for loop
    for (let shift of shifts) {
        if (shift.shiftId == shiftId) {
            return shift;
        }
    }
    return null;
}

// ----- ASSIGNMENTS (Bridge) -----
async function readAssignments() {
    let data = await fs.readFile('assignments.json', 'utf8');
    return JSON.parse(data);
}

async function writeAssignments(assignments) {
    await fs.writeFile('assignments.json', JSON.stringify(assignments, null, 4));
}

async function findAssignment(empId, shiftId) {
    let assignments = await readAssignments();
    // ❌ REMOVED .find() - replaced with for loop
    for (let a of assignments) {
        if (a.employeeId === empId && a.shiftId === shiftId) {
            return a;
        }
    }
    return null;
}

async function getEmployeeShifts(empId) {
    let assignments = await readAssignments();
    let shifts = await readShifts();
    
    // ❌ REMOVED .filter() and .map() - replaced with for loops
    // Get shift IDs for this employee
    let shiftIds = [];
    for (let a of assignments) {
        if (a.employeeId === empId) {
            shiftIds.push(a.shiftId);
        }
    }
    
    // ❌ REMOVED .filter() - replaced with for loop
    // Return full shift details
    let employeeShifts = [];
    for (let shift of shifts) {
        for (let id of shiftIds) {
            if (shift.shiftId === id) {
                employeeShifts.push(shift);
                break;
            }
        }
    }
    
    return employeeShifts;
}

async function addAssignment(empId, shiftId) {
    let assignments = await readAssignments();
    assignments.push({ employeeId: empId, shiftId: shiftId });
    await writeAssignments(assignments);
}

// ----- CONFIG (NEW) -----
async function readConfig() {
    try {
        let data = await fs.readFile('config.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { maxDailyHours: 9 };
    }
}

module.exports = {
    readEmployees,
    writeEmployees,
    findEmployee,
    readShifts,
    writeShifts,
    findShift,
    readAssignments,
    writeAssignments,
    findAssignment,
    getEmployeeShifts,
    addAssignment,
    readConfig
};