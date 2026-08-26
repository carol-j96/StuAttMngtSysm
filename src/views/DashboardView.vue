<template>
    <h2>Dashboard</h2> 
    <div class="stats">
        <div class="card" >
            <span class="number mono" >{{totalStudents}}</span> 
            <span class="label">Total students</span> 
    </div> 
    <div class="card">
        <span class="number mono"> {{presentToday}}</span>
        <span class="label">Present today</span> 
    </div> 
    <div class="card">
        <span class="number mono"> {{ absentToday }}</span> 
        <span class="label">Absent today</span> 
    </div>
    </div>
    <p class="hint" v-if="totalStudents===0">No students yet— head to the <router-link to="/students">Students</router-link> page to add some.</p>
</template>


<script setup>
    import {ref, computed, onMounted} from 'vue'
    import {getStudents, getAttendanceForDate} from '../services/api'
    
    const students = ref([])
    const todayRecords = ref({})
    
    // onMounted runs once, right after this component is first rendered to the
    // screen. It's the standard place to load initial data.
    onMounted(() => {
        students.value = getStudents()
        const today = new Date().toISOString().slice(0, 10)
        todayRecords.value = getAttendanceForDate(today)
    })
    
    const totalStudents = computed(() => students.value.length)
    const presentToday = computed(
        () => Object.values(todayRecords.value).filter((s) => s === 'present').length
    )
    const absentToday = computed(
        () => Object.values(todayRecords.value).filter((s) => s === 'absent').length
    ) 
</script>

<style scoped>
    .stats { 
        display: flex;
        gap: 1 rem; 
    }
    .card {
        background: white;
        border: 1 px solid var(--paper-line);
        border-radius: 6 px;
        padding: 1.25 rem 1.5 rem;
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.35 rem;
    }
    .number {
        font-size: 2 rem;
        font-weight: 500;
        color: var(--cover-green);
    }
    .label { 
        color: var(--ink-soft);
        font-size: 0.85 rem; 
    }
    .hint {
        margin-top: 1.5 rem;
        color: var(--ink-soft);
    } 
</style>