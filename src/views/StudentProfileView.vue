<template>
    <router-link to="/students" class="back-link">← Back to Students</router-link>
  
    <div v-if="student" class="profile">
      <h2>{{ student.name }}</h2>
      <p class="mono sub">{{ student.studentId }} · {{ student.className }}</p>
  
      <h3>Attendance history</h3>
      <table class="ledger card">
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in history" :key="entry.date">
            <td class="mono">{{ entry.date }}</td>
            <td class="mono status" :class="entry.status">{{ entry.status }}</td>
            <td>{{ entry.remark || '—' }}</td>
          </tr>
          <tr v-if="history.length === 0">
            <td colspan="3" class="empty">No attendance recorded yet.</td>
          </tr>
        </tbody>
      </table>
    </div>
  
    <p v-else>Student not found.</p>
</template>
  
<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import { getStudents, getAllRecords, getRemarksForDate } from '../services/api'
  
    const route = useRoute()
    const students = ref([])
    const allRecords = ref({})
    const allRemarks = ref({})
  
    onMounted(() => {
        students.value = getStudents()
        allRecords.value = getAllRecords()
    })
  
    const student = computed(() =>
        students.value.find((s) => s.id === Number(route.params.id))      
    )
  
    const history = computed(() => {
        if (!student.value) return []
  
        const rows = []
        for (const date in allRecords.value) {
            const status = allRecords.value[date][student.value.id]
            if (status) {
                const remark = getRemarksForDate(date)[student.value.id] || ''
                rows.push({ date, status, remark })
            }
        }
        return rows.sort((a, b) => b.date.localeCompare(a.date))
    })
</script>
  
<style scoped>
    .back-link {
        display: inline-block;
        margin-bottom: 1.5rem;
        color: var(--ink-soft);
        text-decoration: none;
        font-size: 0.9rem;
    }
    .sub { color: var(--ink-soft); 
        margin-top: -0.5rem; 
        margin-bottom: 1.5rem; 
    }
    
    .ledger { 
        width: 100%; 
        border-collapse: collapse; 
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
  
    .status.present { 
        color: var(--present); 
    }
  
    .status.late { 
        color: var(--late); 
    }
  
    .status.absent { 
        color: var(--absent); 
    }
  
    .empty { 
        color: var(--ink-soft); 
        text-align: center; 
        padding: 1.5rem; 
    }
</style>