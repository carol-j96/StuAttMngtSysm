<template>
   <div class="dash-header">
    <h2>Dashboard</h2>

     <div class="account" v-if="currentTeacher">
        <button class="avatar-btn" @click="toggleMenu">
          <span class="avatar">{{ initials }}</span>
        </button>

        <div v-if="menuOpen" class="account-menu">
          <p class="menu-name">{{ currentTeacher.name }}</p>
          <p class="menu-email mono">{{ currentTeacher.email }}</p>
          <button class="menu-item" @click="handleLogout">Log out</button>
        </div>
      </div>
    </div>

    <span class="today mono">{{ todayLabel }}</span>

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

    <div class="class-analysis card">
        <div class="analysis-header">
        <h3>Class Analysis</h3>
        <select v-model="selectedClassId" class="class-select">
            <option :value="null">--None--</option>
            <option v-for="c in classes" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
    </div>

    <div class="period-row">
        <div class="period-card">
        <span class="pct mono">{{ dailyPct }}%</span>
        <span class="period-label">Today</span>
        </div>
      
        <div class="period-card">
            <span class="pct mono">{{ weeklyPct }}%</span>
            <span class="period-label">This week</span>
        </div>
        
        <div class="period-card">
            <span class="pct mono">{{ allTimePct }}%</span>
            <span class="period-label">All time</span>
        </div>
    </div>

    <h4>This month</h4>
    <ul class="week-list">
        <li v-for="week in monthlyBreakdown" :key="week.label">
            <span class="mono">{{ week.label }}</span>
            <span class="pct mono">{{ week.pct }}%</span>
        </li>
    </ul>

    <div class="rank-grid">
        <div>
            <h4>Top 5 students</h4>
            <ol class="rank-list">
                <li v-for="s in bestStudents" :key="s.id">
                    <span>{{ s.name }}</span>
                    <span class="pct mono">{{ s.pct }}%</span>
                </li>
               <li v-if="bestStudents.length === 0" class="empty-row">No data yet.</li>
            </ol>
        </div>

        <div>
            <h4>Bottom 5 students</h4>
                <ol class="rank-list">
                    <li v-for="s in worstStudents" :key="s.id">
                        <span>{{ s.name }}</span>
                        <span class="pct mono">{{ s.pct }}%</span>
                    </li>
                    <li v-if="worstStudents.length === 0" class="empty-row">No data yet.</li>
                </ol>
        </div>

        <div>
            <h4>Top 5 classes</h4>
            <ol class="rank-list">
                <li v-for="c in bestClasses" :key="c.id">
                    <span>{{ c.name }}</span>
                    <span class="pct mono">{{ c.pct }}%</span>
                </li>
            </ol>
        </div>

        <div>
            <h4>Bottom 5 classes</h4>
            <ol class="rank-list">
                <li v-for="c in worstClasses" :key="c.id">
                    <span>{{ c.name }}</span>
                    <span class="pct mono">{{ c.pct }}%</span>
                </li>
            </ol>
        </div>
    </div>
    </div>  
   <p class="hint" v-if="totalStudents === 0">
    No students yet - head to the <router-link to="/students">Students</router-link> page and add some.
   </p>
</template>


<script setup>
    import {ref, computed, onMounted} from 'vue'
    import { useRouter } from 'vue-router'
    import {getStudents, getAttendanceForDate, getCurrentTeacher, logoutTeacher, getClasses, getClassPercentage, getWeekRange, getMonthWeeks,getTopStudents, getTopClasses} from '../services/api'
    
    const router = useRouter()
    const students = ref([])
    const todayRecords = ref({})
    const currentTeacher = ref(null)
    const menuOpen = ref(false)
    const classes = ref([])
    const selectedClassId = ref (null)
    
    // onMounted runs once, right after this component is first rendered to the
    // screen. It's the standard place to load initial data.
    onMounted(() => {
        students.value = getStudents()
        const today = new Date().toISOString().slice(0, 10)
        todayRecords.value = getAttendanceForDate(today)
        currentTeacher.value = getCurrentTeacher()

        classes.value = getClasses()
        if (classes.value.length > 0){
            selectedClassId.value = classes.value[0].id
        }
    })

    const initials = computed(() => {
        if (!currentTeacher.value?.name) return ''
        return currentTeacher.value.name
        .split(' ')
        .map((word) => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    })

    function toggleMenu() {
        menuOpen.value = !menuOpen.value
    }

    function handleLogout() {
        logoutTeacher()
        currentTeacher.value = null
        menuOpen.value = false
        router.push('/login')
    }
    
    const todayLabel = computed(() => new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}))
    const totalStudents = computed(() => students.value.length)
    const presentToday = computed(() => Object.values(todayRecords.value).filter((s) => s === 'present').length)
    const lateToday = computed(() => Object.values(todayRecords.value).filter((s) => s === 'late').length)
    const absentToday = computed(() => Object.values(todayRecords.value).filter((s) => s === 'absent').length)

    const todayStr = new Date().toISOString().slice(0, 10)

    const dailyPct = computed(() => selectedClassId.value ? getClassPercentage(selectedClassId.value, todayStr, todayStr) : 0)

    const weekRange = computed(() => getWeekRange(todayStr))

    const weeklyPct = computed(() => selectedClassId.value ? getClassPercentage(selectedClassId.value, weekRange.value.start, weekRange.value.end) : 0)

    const monthlyBreakdown = computed (() =>{
        if (!selectedClassId.value) return []
        return getMonthWeeks(todayStr).map((week) => ({
            label:`${week.start}->${week.end}`,
            pct: getClassPercentage(selectedClassId.value, week.start, week.end),
        }))
    })

    const allTimePct = computed(() => selectedClassId.value ? getClassPercentage (selectedClassId.value) : 0)
    const bestStudents = computed(() => selectedClassId.value ? getTopStudents (selectedClassId.value, 5, false) : [])
    const worstStudents = computed(() => selectedClassId.value ? getTopStudents (selectedClassId.value, 5, true) : [])
    const bestClasses = computed(() => selectedClassId.value ? getTopClasses (5, false) :[])
    const worstClasses = computed(() => selectedClassId.value ? getTopClasses (5, true) : [])
</script>

<style scoped>
    .dash-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .today {
        display: block;
        color: var(--ink-soft);
        font-size: 0.85rem;
        margin-bottom: 1.25rem;
    }

    .stats { 
        display: flex; 
        gap: 1rem; 
        margin-top: 1.5rem;
    }

    .stat-card {
        padding: 0.85rem 1.1rem;
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }

    .number {
        font-size: 1.4rem;
        font-weight: 500;
        color: var(--accent-gold);
    }

    .label { 
        color: var(--ink-soft);
        font-size: 0.75rem; 
    }

    .account { 
        position: fixed; 
        top: 1.5rem;
        right: 3rem;
        z-index: 20;
    }

    .avatar-btn { background: none; border: none; padding: 0; }

    .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: var(--accent-gold);
        color: var(--ink);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.9rem;
    }

    .account-menu {
        position: absolute;
        top: 0;
        right: 100%;
        margin-right: 0.75rem;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 8px;
        box-shadow: var(--shadow-md);
        min-width: 180px;
        overflow: hidden;
        z-index: 10;
    }

    .menu-name { 
        padding: 0.7rem 0.9rem 0.1rem; 
        font-size: 0.85rem; 
        font-weight: 600; 
        color: var(--ink); 
        margin: 0; 
    }

    .menu-email { 
        padding: 0 0.9rem 0.6rem; 
        font-size: 0.75rem; 
        color: var(--ink-soft); 
        margin: 0; 
    }

    .menu-item {
        display: block;
        width: 100%;
        padding: 0.6rem 0.9rem;
        background: none;
        border: none;
        border-top: 1px solid var(--border);
        text-align: left;
        color: var(--absent);
        font-size: 0.85rem;
        cursor: pointer;
    }

    .menu-item:hover { background: var(--absent-bg); }

    .hint {
        margin-top: 1.5rem;
        color: var(--ink-soft);
    } 

    .class-analysis {
        margin-top: 1.5rem;
        padding: 1.5rem;
    }

    .analysis-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.25rem;
    }
    
    .analysis-header h3 { 
        margin: 0; 
    }
    
    .class-select {
        padding: 0.4rem 0.7rem;
        border: 1px solid var(--border);
        border-radius: 4px;
        background: var(--bg);
        color: var(--ink);
    }
    
    .period-row {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    .period-card {
        flex: 1;
        background: var(--bg);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 0.85rem 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }
    
    .pct { 
        font-weight: 600; 
        color: var(--accent-gold); 
    }
    
    .period-label { 
        font-size: 0.75rem; 
        color: var(--ink-soft); 
    }

    h4 { 
        font-size: 0.85rem; 
        color: var(--ink-soft); 
        text-transform: uppercase; 
        letter-spacing: 0.03rem; 
        margin: 1rem 0 0.5rem; 
    }

    .week-list, .rank-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .week-list li, .rank-list li {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border);
        font-size: 0.85rem;
    }

    .rank-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        margin-top: 1rem;
    }

    .empty-row { 
        color: var(--ink-soft); 
        justify-content: flex-start !important; 
    }
</style>