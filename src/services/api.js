// ---------------------------------------------------------------
// This file is the ONLY place that knows how data is stored.
// Right now it's backed by localStorage (so your data survives a
// page refresh). Later, when your backend is ready, you replace
// the *insides* of these functions with fetch('/api/...') calls.
// Every component only ever calls these functions — so the swap
// will require zero changes to your components.
// ---------------------------------------------------------------

const STUDENTS_KEY = 'attendance:students'
const RECORDS_KEY = 'attendance:records' // { [date]: { [studentId]: 'present' | 'absent' } }
const REMARKS_KEY = 'attendance:remarks'

function readJSON(key, fallback) {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
}

function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

// Seed a couple of students the first time the app runs, so the UI
// isn't empty on first load.
if (!localStorage.getItem(STUDENTS_KEY)) {
    writeJSON(STUDENTS_KEY, [
        { id: 1, studentId: 'STU-1001', name: 'Amina Yusuf', className: 'Grade 8A' },
        { id: 2, studentId: 'STU-1002', name: 'Brian Otieno', className: 'Grade 8A' },
        { id: 3, studentId: 'STU-1003', name: 'Grace Mwangi', className: 'Grade 8A' },
    ])
}
// --- Students ---------------------------------------------------

export function getStudents() {
    return readJSON(STUDENTS_KEY, [])
}

export function addStudent({ name, className, studentId }) {
    const students = getStudents()
    const nextId = students.length ? Math.max(...students.map((s) => s.id)) + 1 : 1
    const student = { id: nextId, studentId, name, className }
    students.push(student)
    writeJSON(STUDENTS_KEY, students)
    return student
}

export function deleteStudent(id) {
    const students = getStudents().filter((s) => s.id !== id)
    writeJSON(STUDENTS_KEY, students)
}

// --- Attendance ---------------------------------------------------

export function getAttendanceForDate(date) {
    const records = readJSON(RECORDS_KEY, {})
    return records[date] || {}
}

export function setAttendanceStatus(date, studentId, status) {
    const records = readJSON(RECORDS_KEY, {})
    if (!records[date]) records[date] = {}
    records[date][studentId] = status
    writeJSON(RECORDS_KEY, records)
}

export function getRemarksForDate(date) {
    const remarks = readJSON(REMARKS_KEY, {})
    return remarks[date] || {}
}

export function setRemark(date, studentId, remark) {
    const remarks = readJSON(REMARKS_KEY, {})
    if (!remarks[date]) remarks[date] = {}
    remarks[date][studentId] = remark
    writeJSON(REMARKS_KEY, remarks)
}
export function getAllRecords() {
    return readJSON(RECORDS_KEY, {})
}