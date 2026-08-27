<template>
    <div class="shell">
      <aside class="sidebar">
        <h1 class="brand">Attendance<br />Register</h1>
  
        <nav>
          <router-link to="/">Dashboard</router-link>
          <router-link to="/students">Students</router-link>
          <router-link to="/attendance">Attendance</router-link>
          <router-link to="/reports">Reports</router-link>
        </nav>
  
        <label class="theme-switch">
            <span class="label-text">{{ isDark ? 'Dark Mode' : 'Light Mode' }}</span>
            <input type="checkbox" :checked="isDark" @change="toggleTheme"/>
            <span class="track">
                <span class="thumb"></span>
            </span>
        </label>
      </aside>
  
      <main class="page">
        <router-view />
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const isDark = ref(false)
  
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
  </style>