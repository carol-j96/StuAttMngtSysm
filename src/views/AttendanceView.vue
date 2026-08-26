<template>
    <h2>Mark Attendance</h2>
    <label class="date-picker">
        <input type="date" v-model="selectedDate" @change="loadRecords"/>
    </label>
    
    <ul class="roll">
        <li v-for="student in students" :key="student.id">
        <span>
            {{student.name}}
            <span class="mono muted"> -
                {{student.className}}
            </span>
        </span>
        <AttendanceStamp :status="records[student.id] || null" @toggle="toggleStatus(student.id)" />
    </li>
    </ul>
</template>
    
<script setup>
    import{ref, onMounted} from 'vue'
    import{getStudents, getAttendanceForDate, setAttendanceStatus} from '../services/api'
    import AttendanceStamp from '../components/AttendanceStamp.vue'
    
    const students=ref([])
    const selectedDate=ref(new Date().toISOString().slice(0, 10)) 
    const records=ref({}) 
    
    onMounted(()=>{
        students.value=getStudents()
        loadRecords()
    })
    
    function loadRecords(){
        records.value=getAttendanceForDate(selectedDate.value)
    }
    
    function toggleStatus(studentId){
        const current=records.value[studentId]
        const next=current==='present'?'absent':'present'
        setAttendanceStatus(selectedDate.value, studentId, next)
        records.value={...records.value, [studentId]:next}
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

    .date-picker input {
        margin-left: 0.5rem;
        padding: 0.35rem 0.6rem;
        border: 1px solid var (--paper-line);
        border-radius: 4px;
    }

    .roll {
        list-style: none;
        padding: 0;
        margin: 0;
        background: white;
        border: 1 px solid var (--paper - line);
    }

    .roll li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.8rem 1.1rem;
        border-bottom: 1px solid var(--paper-line);
    }

    .roll li:last-child {
        border-bottom: none;
    }

    .muted {
        color: var(--ink-soft);
        font-size: 0.85rem;
    }
</style>
