import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import StudentsView from '../views/StudentsView.vue'
import AttendanceView from '../views/AttendanceView.vue'
import ReportsView from '../views/ReportsView.vue'
import StudentProfileView from '../views/StudentProfileView.vue'
import LoginView from '../views/LoginView.vue'
import SignUpView from '../views/SignUpView.vue'
import { getCurrentTeacher, touchSession } from '../services/api'
import ClassesView from '@/views/ClassesView.vue'

// Each route maps a URL path to a component ("page").
// createWebHistory() gives you clean URLs like /students instead of /#/students.
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/login', name: 'login', component: LoginView },
        { path: '/signup', name: 'signup', component: SignUpView },
        { path: '/', name: 'dashboard', component: DashboardView },
        { path: '/students', name: 'students', component: StudentsView },
        { path: '/students/:id', name: 'student-profile', component: StudentProfileView },
        { path: '/attendance', name: 'attendance', component: AttendanceView },
        { path: '/reports', name: 'reports', component: ReportsView },
        { path: '/classes', name: 'classes', component: ClassesView },
    ],
})

router.beforeEach((to) => {
    const loggedIn = !!getCurrentTeacher()
    const isAuthPage = to.name === 'login' || to.name === 'signup'

    if (!loggedIn && !isAuthPage) {
        return { name: 'login' }
    }

    if (loggedIn && isAuthPage) {
        return { name: 'dashboard' }
    }
    if (loggedIn) {
        touchSession()
    }
})

export default router