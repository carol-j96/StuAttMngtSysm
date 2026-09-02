<template>
    <form @submit.prevent="handleSubmit">
        <input v-model="studentId" type="text" placeholder="Student ID" required/>
        <input v-model="name" type="text" placeholder="Full name" required/>
        <select v-model="classId" required>
            <option value="null">--None--</option>
            <option v-for="c in classes" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
        <button type="submit">Add Student</button>
    </form>
</template>

<script setup>
    import { getClasses } from '@/services/api'
    import { ref } from 'vue'
    
    const emit=defineEmits(['add-student'])
    
    const classes = ref(getClasses())
    const studentId = ref('')
    const name = ref('')
    const classId = ref(null)

    function handleSubmit(){
        emit('add-student', {studentId: studentId.value, name: name.value, classId: classId.value})
        studentId.value = ''
        name.value = ''
        classId.value = null
    }
</script>

<style scoped>
    .form {
        display: flex;
        gap: 1.25rem;
        margin-bottom: 1.5rem;
    }

    input {
        flex: 1;
        padding: 0.6rem 0.8rem;
        border: 1px solid var(--border);
        background: var(--card);
        color: var(--ink);
        border-radius: 4px;
        font-family: var(--font-body);
    }

    button {
        background: var(--accent-gold);
        color: var(--ink);
        border: none;
        padding: 0.6rem 1.2rem;
        border-radius: 4px;
        font-weight: 600;
    }

    button:hover {
        opacity: 0.85;
    }

    select {
        flex: 1;
        padding: 0.6rem 0.8rem;
        border: 1px solid var(--border);
        background: var(--card);
        color: var(--ink);
        border-radius: 4px;
        font-family: var(--font-body);
    }
</style>