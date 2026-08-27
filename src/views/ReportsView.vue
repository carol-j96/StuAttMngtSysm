<template>
    <h2>Reports</h2>

    <table class="ledger">
        <thead>
            <tr>
                <th>Name</th>
                <th>Class</th>
                <th>Present</th>
                <th>Late</th>
                <th>Total Marked</th>
                <th>Attendance (%)</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="student in studentStats" :key="student.id">
                <td>{{ student.name }}</td>
                <td class="mono">{{ student.className }}</td>
                <td class="mono">{{ student.presentCount }}</td>
                <td class="mono">{{ student.lateCount }}</td>
                <td class="mono">{{ student.totalDays }}</td>
                <td class="mono">{{ student.percentage }}</td>
            </tr>
            <tr v-if="studentStats.length === 0">
                <td colspan="5" class="empty">No data yet.</td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { getStudents, getAllRecords } from '../services/api'

    const students = ref([])
    const allRecords = ref([])

    onMounted(() => {
        students.value = getStudents ()
        allRecords.value = getAllRecords ()
    })

    const studentStats = computed(() => {
        return students.value.map((student) => {
            let presentCount = 0
            let lateCount = 0
            let totalDays = 0

            for(const date in allRecords.value) {
                const status =allRecords.value[date][student.id]
                if (status) {
                    totalDays++
                    if (status === 'present') presentCount++
                    if (status === 'late') lateCount++
                }
            }

            const percentage = totalDays>0 ? Math.round((presentCount / totalDays)*100) : 0
            return { ...student, presentCount, lateCount, totalDays, percentage}
        })
    })
</script>

<style scoped>
    .ledger {
        width: 100%;
        border-collapse: collapse;
        background: var(--card);
        border: 1px solid var(--border)
    }

    th,td {
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

    .tbody tr {
        transition: background 0.1s ease;
    }

    .tbody tr:hover {
        background: var(--present-bg);
    }

    .empty{
        color: var(--ink-soft);
        text-align: center;
        padding: 1.5rem;
    }
</style>