<template>
   <div class="dash-header">
    <h2>Dashboard</h2>
    <span class="today mono">{{ todayLabel }}</span>
   </div>

   <div class="stats">
    <div class="card stat-card">
        <span class="number mono">{{ totalStudents }}</span>
        <span class="label">Total Students</span>
    </div>
    <div class="card stat-card">
        <span class="number mono">{{ presentToday }}</span>
        <span class="label">Present Today</span>
    </div>
    <div class="card stat-card">
        <span class="number mono">{{ lateToday }}</span>
        <span class="label">Late Today</span>
    </div>
    <div class="card stat-card">
        <span class="number mono">{{ absentToday }}</span>
        <span class="label">Absent Today</span>
    </div>
   </div>

   <p class="hint" v-if="totalStudents === 0">
    No students yet - head to the <router-link to="/students">Students</router-link> page and add some.
   </p>
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
    
    const todayLabel = computed(
        () => new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})
    )
    const totalStudents = computed(() => students.value.length)
    const presentToday = computed(
        () => Object.values(todayRecords.value).filter((s) => s === 'present').length
    )
    const lateToday = computed(
        () => Object.values(todayRecords.value).filter((s) => s === 'late').length
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

    .dash-header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        margin-bottom: 1.25rem;
    }

    .today {
        color: var(--ink-soft);
        font-size: 0.85rem;
    }

    .stats { display: flex; gap: 1rem; }

    .stat-card {
        padding: 1.25 rem 1.5rem;
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
    }


    .number {
        font-size: 2 rem;
        font-weight: 500;
        color: var(--accent-gold);
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