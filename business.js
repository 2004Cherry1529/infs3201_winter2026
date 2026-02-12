const persistence = require('./persistence.js');
/**
 * Calculates hours between start and end times
 * 
 * LLM: ChatGPT
 * Prompt: "Write a JavaScript function called computeShiftDuration that takes startTime and endTime 
 * in HH:MM format and returns the number of hours as a decimal (e.g., 2.5 for 2 hours 30 minutes)"
 * 
 * @param {string} startTime - Format "HH:MM"
 * @param {string} endTime - Format "HH:MM"
 * @returns {number} Hours as decimal
 */
// SCHEDULE LIMITATIONS FEATURE - maxDailyHours validation
function computeShiftDuration(startTime, endTime) {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    return (endMinutes - startMinutes) / 60;
}
// Employee passthrough
async function getAllEmployees() {
    return await persistence.readEmployees();
}

async function findEmployee(empId) {
    return await persistence.findEmployee(empId);
}
// Shift passthrough
async function getAllShifts() {
    return await persistence.readShifts();
}

async function findShift(shiftId) {
    return await persistence.findShift(shiftId);
}

// Assignment passthrough
async function getEmployeeShifts(empId) {
    return await persistence.getEmployeeShifts(empId);
}

async function findAssignment(empId, shiftId) {
    return await persistence.findAssignment(empId, shiftId);
}

// Config passthrough
async function getConfig() {
    return await persistence.readConfig();
}
// ----- BUSINESS LOGIC: ADD EMPLOYEE -----
async function addEmployee(employeeData) {
    let employees = await persistence.readEmployees();
    
    let maxId = 0;
    for (let e of employees) {
        let eid = Number(e.employeeId.slice(1));
        if (eid > maxId) maxId = eid;
    }
    
    let newEmployee = {
        name: employeeData.name,
        phone: employeeData.phone,
        employeeId: `E${String(maxId + 1).padStart(3, '0')}`
    };
    
    employees.push(newEmployee);
    await persistence.writeEmployees(employees);
    return newEmployee;
}
// ----- BUSINESS LOGIC: SCHEDULE VALIDATION (NEW FEATURE) -----
async function canScheduleEmployee(empId, date, startTime, endTime) {
    const config = await persistence.readConfig();
    const maxHours = config.maxDailyHours;
    
    const shifts = await persistence.getEmployeeShifts(empId);
    const shiftsOnDate = shifts.filter(shift => shift.date === date);
    
    let totalHours = 0;
    for (let shift of shiftsOnDate) {
        totalHours += computeShiftDuration(shift.startTime, shift.endTime);
    }
    
    totalHours += computeShiftDuration(startTime, endTime);
    return totalHours <= maxHours;
}
// ----- BUSINESS LOGIC: ASSIGN SHIFT WITH VALIDATION -----
async function assignShift(empId, shiftId) {
    let employee = await persistence.findEmployee(empId);
    if (!employee) return "Employee does not exist";
    
    let shift = await persistence.findShift(shiftId);
    if (!shift) return "Shift does not exist";
    
    let assignment = await persistence.findAssignment(empId, shiftId);
    if (assignment) return "Employee already assigned to shift";
    
    let canSchedule = await canScheduleEmployee(
        empId, 
        shift.date, 
        shift.startTime, 
        shift.endTime
    );
    
    if (!canSchedule) return "Cannot assign - exceeds maximum daily hours";
    
    await persistence.addAssignment(empId, shiftId);
    return "Ok";
}
module.exports = {
    computeShiftDuration,
    getAllEmployees,
    findEmployee,
    getAllShifts,
    findShift,
    getEmployeeShifts,
    findAssignment,
    getConfig,
    addEmployee,
    canScheduleEmployee,
    assignShift
};
