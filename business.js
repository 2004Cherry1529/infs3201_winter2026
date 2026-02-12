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

module.exports = {
    computeShiftDuration,
    getAllEmployees,
    findEmployee,
    getAllShifts,
    findShift,
    getEmployeeShifts,
    findAssignment
};

