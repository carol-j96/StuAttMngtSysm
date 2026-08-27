<template>
  <h2>Mark Attendance</h2>

  <label class="date-picker">
    Date:
    <input type="date" v-model="selectedDate" @change="loadRecords" />
  </label>

  <label class="filter">
    Class:
    <select v-model="selectedClass">
        <option v-for="c in classOptions" :key="c" :value="c">
            {{ c === 'all' ? 'All classes' : c }}
        </option>
    </select>
  </label>

  <table class="ledger card">
    <thead>
      <tr>
        <th>Name</th>
        <th>Class</th>
        <th>Status</th>
        <th>Remarks</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="student in students" :key="student.id">
        <td>{{ student.name }}</td>
        <td class="mono">{{ student.className }}</td>
        <td>
          <AttendanceStamp
            :status="records[student.id] || null"
            @toggle="toggleStatus(student.id)"
          />
        </td>
        <td>
            <input class="remark-input" type="text" placeholder="e.g. Doctor's note" 
            :value="remarks[student.id] || ''" @change="updateRemark(student.id, $event.target.value)"/>
        </td>
      </tr>
    </tbody>
  </table>
</template>
    
<script setup>
    import{ref, computed, onMounted} from 'vue'
    import{getStudents, getAttendanceForDate, setAttendanceStatus, getRemarksForDate, setRemark} from '../services/api'
    import AttendanceStamp from '../components/AttendanceStamp.vue'
    
    const students = ref([])
    const selectedDate = ref(new Date().toISOString().slice(0, 10)) 
    const records = ref({}) 
    const remarks = ref({})
    const selectedOptions = ref('all')
    
    const classOptions = computed(() => {
        const unique = new Set(students.value.map((s) => s.className))
        return ['all', ...unique]
    })

    const filteredStudents = computed(() => {
        if (selectedClass.value === 'all') return students.value
        return students.value.filter((s) => s.className === selectedClass.value)
    })

    onMounted(()=>{
        students.value=getStudents()
        loadRecords()
    })
    
    function loadRecords(){
        records.value=getAttendanceForDate(selectedDate.value)
        remarks.value=getRemarksForDate(selectedDate.value)
    }
    
    function toggleStatus(studentId) {
        const current = records.value[studentId]
        let next
        if (current === 'present') next = 'late'
        else if (current === 'late') next = 'absent'
        else next = 'present' // covers 'absent' and unmarked (null/undefined)

        setAttendanceStatus(selectedDate.value, studentId, next)
        records.value = { ...records.value, [studentId]: next }
    }

    function updateRemark(studentId, value) {
        setRemark(selectedDate.value, studentId, value)
        remarks.value = {...remarks.value, [studentId]: value}
    }

    function handleTestToggle() {
        console.log('Toggle clicked!')
    }
</script>

<style scooped>
    .date-picker {
        display: block;
        margin-bottom: 1.5 rem;
        font-weight: 600;
        color: var(--ink-soft);
    }

    .date-picker {
        display: block;
        margin-bottom: 1.5rem;
        font-weight: 600;
        color: var(--ink-soft);
    }
    
    .date-picker input {
        margin-left: 0.5rem;
        padding: 0.35rem 0.6rem;
        border: 1px solid var(--border);
        border-radius: 4px;
        background: var(--card);
        color: var(--ink);
    }
    
    .ledger {
        width: 100%;
        border-collapse: collapse;
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
    
    th, td {
        text-align: left;
        padding: 0.7rem 1rem;
        border-bottom: 1px solid var(--border);
    }
    
    th {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        letter-spacing: 0.05em;
        color: var(--ink-soft);
        text-transform: uppercase;
    }

    tbody tr {
        transition: background 0.1s ease;
    }

    tbody tr:hover {
        background: var(--present-bg);
    }

    .remark-input {
        width: 100%;
        padding: 0.35rem 0.5rem;
        border: 1px solid var(--border);
        border-radius: 4px;
        background: var(--card);
        color: var(--ink);
        font-size: 0.85rem;
    }
</style>
