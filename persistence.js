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
    return employees.find(emp => emp.employeeId === empId) || null;
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
    return shifts.find(shift => shift.shiftId == shiftId);
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
    return assignments.find(a => a.employeeId === empId && a.shiftId === shiftId);
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
    findAssignment
};