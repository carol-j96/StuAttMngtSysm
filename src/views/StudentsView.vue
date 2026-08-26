<template>
    <h2>Students</h2>
    <StudentForm @add-student="handleAdd"/>
    <table class="ledger">
        <thead>
            <tr>
                <th>Name</th>
                <th>Class</th>
                <th> </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="student in students" key="student.id">
                <td>{{ student.name }}</td>
                <td class="mono">{{ student.className }}</td>
                <td class="actions">
                    <button class="link-btn" @click="handleDelete(student.id)">Remove</button>
                </td>
            </tr>
            <tr v-if="students.length===0">
                <td colspan="3" class="empty">No students yet. Add your first one above.</td>
            </tr>
        </tbody>
    </table>
</template>
 
<script setup >
    import { ref, onMounted } from 'vue'
    import { getStudents, addStudent, deleteStudent } from '../services/api'
    import StudentForm from '../components/StudentForm.vue'
    
    const students = ref([])
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
</script>

<style scoped>
    .ledger {
        width: 100% ;
        border-collapse: collapse;
        background: white;
        border: 1 px solid var(--paper-line);
    }

    th, td {
        text-align: left;
        padding: 0.7 rem 1 rem;
        border-bottom: 1 px solid var(--paper-line);
    }

    th {
    font-family: var(--font-mono);
    font-size: 0.75 rem;
    letter-spacing: 0.05e m;
    color: var(--ink-soft);
    text-transform: uppercase;
}
    .link-btn {
        background: none;
        border: none;
        color: var(--absent);
        font-size: 0.85 rem;
        padding: 0;
    }

    .empty { 
        color: var(--ink-soft);
        text-align: center;
        padding: 1.5 rem; 
    }
</style>
   