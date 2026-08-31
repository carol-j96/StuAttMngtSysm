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
const TEACHERS_KEY = 'attendance:teachers'
const SESSION_KEY = 'attendance:session'
const CLASSES_KEY = 'attendance:classes'

function readJSON(key, fallback) {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
}

function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function currentTeacherId() {
    const session = getCurrentTeacher()
    return session ? session.id : 'guest'
}

function scopedKey(base) {
    return `${base}:${currentTeacherId()}`
}

// --- Students ---------------------------------------------------

export function getStudents() {
    const key = scopedKey(STUDENTS_KEY)
    if (!localStorage.getItem(key)) {
        writeJSON(key, [
            { id: 1, studentId: 'STU-1001', name: 'Amina Yusuf', classId: 1 },
            { id: 2, studentId: 'STU-1002', name: 'Brian Otieno', classId: 1 },
            { id: 3, studentId: 'STU-1003', name: 'Grace Mwangi', classId: 1 },
        ])
    }
    return readJSON(STUDENTS_KEY, [])
}

export function getClassName(classId) {
    const match = getClasses().find((c) => c.id === classId)
    return match ? match.name : 'Unknown class'
}

export function addStudent({ name, className, studentId }) {
    const students = getStudents()
    const nextId = students.length ? Math.max(...students.map((s) => s.id)) + 1 : 1
    const student = { id: nextId, studentId, name, className }
    students.push(student)
    writeJSON(scopedKey(STUDENTS_KEY), students)
    return student
}

export function deleteStudent(id) {
    const students = getStudents().filter((s) => s.id !== id)
    writeJSON(scopedKey(STUDENTS_KEY), students)
}

// --- Attendance ---------------------------------------------------

export function getAttendanceForDate(date) {
    const records = readJSON(scopedKey(RECORDS_KEY), {})
    return records[date] || {}
}

export function setAttendanceStatus(date, studentId, status) {
    const records = readJSON(scopedKey(RECORDS_KEY), {})
    if (!records[date]) records[date] = {}
    records[date][studentId] = status.writeJSON(scopedKey(RECORDS_KEY), records)
}

export function getRemarksForDate(date) {
    const remarks = readJSON(scopedKey(REMARKS_KEY), {})
    return remarks[date] || {}
}

export function setRemark(date, studentId, remark) {
    const remarks = readJSON(scopedKey(REMARKS_KEY), {})
    if (!remarks[date]) remarks[date] = {}
    remarks[date][studentId] = remark.writeJSON(scopedKey(REMARKS_KEY), remarks)
}

export function getAllRecords() {
    return readJSON(scopedKey(RECORDS_KEY), {})
}

export function getTeachers() {
    return readJSON(TEACHERS_KEY, [])
}

export function registerTeacher({ name, email, password }) {
    const teachers = getTeachers()
    const exists = teachers.some((t) => t.email.toLowerCase() === email.toLowerCase())
    if (exists) {
        throw new Error('An account with this email already exists.')
    }
    const nextId = teachers.length ? Math.max(...teachers.map((t) => t.id)) + 1 : 1
    const teacher = { id: nextId, name, email, password }
    teachers.push(teacher)
    writeJSON(TEACHERS_KEY, teachers)
    return teacher
}

const SESSION_DURATION = 36 * 60 * 60 * 1000

export function loginTeacher(email, password, rememberMe) {
    const teachers = getTeachers()
    const match = teachers.find(
        (t) => t.email.toLowerCase() === email.toLowerCase() && t.password === password,
    )
    if (!match) {
        throw new Error('Incorrect email or password')
    }
    const session = {
        id: match.id,
        name: match.name,
        email: match.email,
        expiresAt: Date.now() + SESSION_DURATION,
    }
    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem(SESSION_KEY, JSON.stringify(session))
    return match
}

export function logoutTeacher() {
    localStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)
}

export function getCurrentTeacher() {
    const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null

    const session = JSON.parse(raw)
    if (Date.now() > session.expiresAt) {
        logoutTeacher()
        return null
    }
    return session
}

export function touchSession() {
    const target = localStorage.getItem(SESSION_KEY) ? localStorage : sessionStorage
    const raw = target.getItem(SESSION_KEY)
    if (!raw) return
    const session = JSON.parse(raw)
    session.expiresAt = Date.now() + SESSION_DURATION
    target.setItem(SESSION_KEY, JSON.stringify(session))
}

export function getClasses() {
    const key = scopedKey(CLASSES_KEY)
    if (!localStorage.getItem(key)) {
        writeJSON(key, [{ id: 1, name: 'Grade 8A' }])
    }
    return readJSON(key, [])
}

export function addClasses({ name }) {
    const classes = getClasses()
    const nextId = classes.length ? Math.max(...classes.map((c) => c.id)) + 1 : 1
    const newClass = { id: nextId, name }
    classes.push(newClass)
    writeJSON(scopedKey(CLASSES_KEY), classes)
    return newClass
}

export function deleteCLass(id) {
    const classes = getClasses().filter((c) => c.id !== id)
    writeJSON(scopedKey(CLASSES_KEY), classes)
}