<template>
  <div class="shell" v-if="showShell">
    <aside class="sidebar">
      <h1 class="brand">Attendance<br />Register</h1>

      <nav>
        <router-link to="/">Dashboard</router-link>
        <router-link to="/classes">Classes</router-link>
        <router-link to="/students">Students</router-link>
        <router-link to="/attendance">Attendance</router-link>
        <router-link to="/reports">Reports</router-link>
      </nav>

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

      <label class="theme-switch">
        <span class="label-text">{{ isDark ? 'Dark Mode' : 'Light Mode' }}</span>
        <input type="checkbox" :checked="isDark" @change="toggleTheme" />
        <span class="track">
          <span class="thumb"></span>
        </span>
      </label>
    </aside>

    <main class="page">
      <router-view />
    </main>
  </div>
  <router-view v-else />
</template>

<script setup>
  import { ref, computed, watch, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { getCurrentTeacher, logoutTeacher } from './services/api'

  const route = useRoute()
  const router = useRouter()

  const isDark = ref(false)
  const currentTeacher = ref(null)

  const showShell = computed(() => route.name !== 'login' && route.name !== 'signup')

  function applyTheme(dark) {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }

  function toggleTheme() {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme(isDark.value)
  }

  onMounted(() => {
    const saved = localStorage.getItem('theme')
    isDark.value = saved === 'dark'
    applyTheme(isDark.value)
  })

  watch(() => route.fullPath, () => {
    currentTeacher.value = getCurrentTeacher()
  })

  const menuOpen = ref(false)

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
</script>

<style scoped>
  .shell {
    display: flex;
    min-height: 100vh;
  }

  .sidebar {
    width: 220px;
    flex-shrink: 0;
    background: var(--sidebar-bg);
    color: var(--sidebar-text);
    padding: 1.5rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .brand {
    color: var(--sidebar-text-active);
    font-size: 1.1rem;
    line-height: 1.3;
    margin: 0;
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  nav a {
    text-decoration: none;
    color: var(--sidebar-text);
    font-weight: 500;
    font-size: 0.9rem;
    padding: 0.6rem 0.8rem;
    border-radius: 6px;
  }

  nav a.router-link-active {
    background: rgba(255, 255, 255, 0.1);
    color: var(--sidebar-text-active);
  }

  .theme-switch {
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    cursor: pointer;
    padding: 0.4rem 0.2rem;
  }

  .label-text {
    font-size: 0.85rem;
    color: var(--sidebar-text);
  }

  .theme-switch input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .track {
    width: 42px;
    height: 24px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 999px;
    position: relative;
    transition: background 0.2s ease;
    flex-shrink: 0;
  }

  .thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: var(--sidebar-text-active);
    border-radius: 50%;
    transition: transform 0.2s ease;
  }

  .theme-switch input:checked + .track {
    background: var(--accent-gold);
  }

  .theme-switch input:checked + .track .thumb {
     transform: translateX(18px);
  }

  .page {
    flex: 1;
    padding: 2rem;
    max-width: 1000px;
  }

  .account {
    position: relative;
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
  }

  .avatar-btn {
    background: none;
    border: none;
    padding: 0;
  }

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
    bottom: 100%;
    left: 0;
    margin-bottom: 0.5rem;
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

  .menu-item:hover {
    background: var(--absent-bg);
  }
</style>
