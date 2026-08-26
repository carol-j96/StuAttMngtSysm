import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import StudentsView from '../views/StudentsView.vue'
import AttendanceView from '../views/AttendanceView.vue'
import ReportsView from '../views/ReportsView.vue'


// Each route maps a URL path to a component ("page").
// createWebHistory() gives you clean URLs like /students instead of /#/students.
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'dashboard', component: DashboardView },
        { path: '/students', name: 'students', component: StudentsView },
        { path: '/attendance', name: 'attendance', component: AttendanceView },
        { path: '/reports', name: 'reports', component: ReportsView },
    ],
})

export default router