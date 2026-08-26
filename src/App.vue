<template>
    <header class="cover">
        <h1 class="brand">Attendance Register</h1>
        <nav>
            <router-link to="/">Dashboard</router-link>
            <router-link to="/students">Students</router-link>
            <router-link to="/attendance">Attendance</router-link>
        </nav>
    </header>

    <main class="page">
        <router-view/>
    </main>
</template>

<script setup>
</script>

<style scoped>
    .cover {
        background: var(--cover-green);
        color: var(--paper);
        padding: 1.25 rem 2 rem;
        display: flex;
        align-items: center;
        justify-content: space - between;
        border-bottom: 4 px solid var(--accent-gold);
    }

    .brand {
        color: var(--paper);
        font-size: 1.4rem;
        margin: 0;
    }

    nav{
        display: flex;
        gap: 1.5rem;
    }

    nav a {
        text-decoration: none;
        color: #d9e2d5;
        font-weight: 600;
        font-size: 0.95 rem;
        padding-bottom: 2 px;
        border-bottom: 2 px solid transparent;
    }

    nav a.router-link-active{
        color: var(--paper);
        border-bottom-color: var(--accent-gold);
    }

    .page {
        flex: 1;
        padding: 2rem;
        max-width: 900px;
        margin: 0 auto;
        width: 100%;
    }
</style>
