<template>
  <h2>Students</h2>
  <StudentForm @add-student="handleAdd" />
  <div class="filters">
    <label class="filter">
      Class:
      <select v-model="selectedClass">
        <option v-for="c in classOptions" :key="c.id" :value="c.id">
          {{ c.name }}
        </option>
      </select>
    </label>
    <input
      v-model="searchQuery"
      type="search"
      placeholder="Search name or ID..."
      class="search-input"
    />
  </div>
  <table class="ledger">
    <thead>
      <tr>
        <th>Student ID</th>
        <th>Name</th>
        <th>Class</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="student in filteredStudents" :key="student.id">
        <td class="mono">{{ student.studentId }}</td>
        <td>{{ student.name }}</td>
        <td class="mono">{{ student.classId }}</td>
        <td class="actions-cell">
          <button class="actions-btn" @click="toggleMenu(student.id)">Actions</button>

          <div v-if="openMenuId === student.id" class="actions-menu">
            <router-link :to="`/students/${student.id}`" class="menu-item" @click="closeMenu">View Profile</router-link>
            <button class="menu-item"  @click="handleDelete(student.id); closeMenu()">
              Remove
            </button>
          </div>
        </td>
      </tr>
      <tr v-if="filteredStudents.length === 0">
        <td colspan="4" class="empty">
          {{
            students.length === 0
              ? 'No students yet. Add your first one above.'
              : 'No students match your search.'
          }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getStudents, addStudent, deleteStudent, getClasses, getClassName } from '../services/api'
import StudentForm from '../components/StudentForm.vue'

const students = ref([])
const selectedClass = ref('all')
const searchQuery = ref('')
const openMenuId = ref(null)
const classes = ref(getClasses())

const classOptions = computed(() => [{ id: 'all', name: 'All Classes'}, ...classes.value])

const filteredStudents = computed(() => {
  let result = students.value

  if (selectedClass.value !== 'all') {
    result = result.filter((s) => s.classId === selectedClass.value)
  }

  if (searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(query) || (s.studentId || '').toLowerCase().includes(query),
    )
  }

  return result
})

onMounted(() => {
  students.value = getStudents()
})

function handleAdd(newStudent) {
  addStudent(newStudent)
  students.value = getStudents() // re-read from the data layer to stay in sync
}

function handleDelete(id) {
  deleteStudent(id)
  students.value = getStudents()
}

function toggleMenu(id) {
  openMenuId.value = openMenuId.value === id ? null : id
}

function closeMenu() {
  openMenuId.value = null
}
</script>

<style scoped>
.ledger {
  width: 100%;
  border-collapse: collapse;
  background: var(--card);
  border: 1 px solid var(--border);
}

.filter {
  display: block;
  margin-bottom: 1rem;
  font-weight: 600;
  color: var(--ink-soft);
  font-size: 0.9rem;
}

.filter select {
  margin-left: 0.5rem;
  padding: 0.35rem 0.6rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--card);
  color: var(--ink);
}

.filters {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.search-input {
  margin-left: auto;
  padding: 0.4rem 0.7rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--card);
  color: var(--ink);
  min-width: 200px;
}

th,
td {
  text-align: left;
  padding: 0.7 rem 1 rem;
  border-bottom: 1 px solid var(--border);
}

th {
  font-family: var(--font-mono);
  font-size: 0.75 rem;
  letter-spacing: 0.05e m;
  color: var(--ink-soft);
  text-transform: uppercase;
}

.tbody tr {
  transition: background 0.1s ease;
}

.tbody tr:hover {
  background: var(--present-bg);
}
.link-btn {
  background: none;
  border: none;
  color: var(--absent);
  font-size: 0.85 rem;
  padding: 0;
}

.actions-cell {
  position: relative;
}

.actions-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--ink);
  padding: 0.35rem 0.7rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.actions-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.3rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 6px;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  min-width: 140px;
  z-index: 10;
  overflow: hidden;
}

.menu-item {
  display: block;
  padding: 0.6rem 0.9rem;
  background: none;
  border: none;
  text-align: left;
  text-decoration: none;
  color: var(--ink);
  font-size: 0.85rem;
  cursor: pointer;
}

.menu-item:hover {
  background: var(--present-bg);
}

.empty {
  color: var(--ink-soft);
  text-align: center;
  padding: 1.5 rem;
}
</style>
