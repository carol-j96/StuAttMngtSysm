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
    return readJSON(key, [])
}

export function getClassName(classId) {
    const match = getClasses().find((c) => c.id === classId)
    return match ? match.name : 'Unknown class'
}

export function addStudent({ name, classId, studentId }) {
    const students = getStudents()
    const nextId = students.length ? Math.max(...students.map((s) => s.id)) + 1 : 1
    const student = { id: nextId, studentId, name, classId }
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
    records[date][studentId] = status
    writeJSON(scopedKey(RECORDS_KEY), records)
}

export function getRemarksForDate(date) {
    const remarks = readJSON(scopedKey(REMARKS_KEY), {})
    return remarks[date] || {}
}

export function setRemark(date, studentId, remark) {
    const remarks = readJSON(scopedKey(REMARKS_KEY), {})
    if (!remarks[date]) remarks[date] = {}
    remarks[date][studentId] = remark
    writeJSON(scopedKey(REMARKS_KEY), remarks)
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

export function addClass({ name }) {
    const classes = getClasses()
    const nextId = classes.length ? Math.max(...classes.map((c) => c.id)) + 1 : 1
    const newClass = { id: nextId, name }
    classes.push(newClass)
    writeJSON(scopedKey(CLASSES_KEY), classes)
    return newClass
}

export function deleteClass(id) {
    const classes = getClasses().filter((c) => c.id !== id)
    writeJSON(scopedKey(CLASSES_KEY), classes)
}

export function getStudentByClass(classId) {
    return getStudents().filter((s) => s.classId === classId)
}

export function getClassPercentage(classId, startDate, endDate) {
    const studentIds = new Set(getStudentByClass(classId).map((s) => s.id))
    const allRecords = getAllRecords()
    let present = 0
    let total = 0

    for (const date in allRecords) {
        if (startDate && date < startDate) continue
        if (endDate && date > endDate) continue
        const dayRecord = allRecords[date]
        for (const studentId in dayRecord) {
            if (!studentIds.has(Number(studentId))) continue
            total++
            if (dayRecord[studentId] === 'present') present++
        }
    }
    return total > 0 ? Math.round((present / total) * 100) : 0
}

export function getWeekRange(dateStr) {
    const d = new Date(dateStr)
    const day = d.getDay()
    const diffToMonday = day === 0 ? -6 : 1 - day
    const monday = new Date(d)
    monday.setDate(d.getDate() + diffToMonday)
    const friday = new Date(monday)
    friday.setDate(monday.getDate() + 4)
    return {
        start: monday.toISOString().slice(0, 10),
        end: friday.toISOString().slice(0, 10),
    }
}

export function getMonthWeeks(dateStr) {
    const d = new Date(dateStr)
    const year = d.getFullYear()
    const month = d.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const weeks = []
    const seen = new Set()
    let cursor = new Date(firstDay)

    while (cursor <= lastDay) {
        const range = getWeekRange(cursor.toISOString().slice(0, 10))
        const key = `${range.start}_${range.end}`
        if (!seen.has(key)) {
            seen.add(key)
            weeks.push(range)
        }
        cursor.setDate(cursor.getDate() + 7)
    }
    return weeks
}

export function getTopStudents(classId, count, worst) {
    const students = getStudentByClass(classId)
    const allRecords = getAllRecords()

    const stats = students
        .map((s) => {
            let present = 0
            let total = 0
            for (const date in allRecords) {
                const status = allRecords[date][s.id]
                if (status) {
                    total++
                    if (status === 'present') present++
                }
            }
            const pct = total > 0 ? Math.round((present / total) * 100) : 0
            return {...s, pct, total }
        })
        .filter((s) => s.total > 0)

    stats.sort((a, b) => (worst ? a.pct - b.pct : b.pct - a.pct))
    return stats.slice(0, count)
}

export function getTopClasses(count, worst) {
    const classes = getClasses()
    const stats = classes.map((c) => ({...c, pct: getClassPercentage(c.id) }))
    stats.sort((a, b) => (worst ? a.pct - b.pct : b.pct - a.pct))
    return stats.slice(0, count)
}