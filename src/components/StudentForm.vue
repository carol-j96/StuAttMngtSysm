<template>
    <form @submit.prevent="handleSubmit">
        <input v-model="studentId" type="text" placeholder="Student ID" required/>
        <input v-model="name" type="text" placeholder="Full name" required/>
        <input v-model="className" type="text" placeholder="Class" required/>
        <button type="submit">Add Student</button>
    </form>
</template>

<script setup>
    import { ref } from 'vue'
    
    const emit=defineEmits(['add-student'])

    const studentId = ref('')
    const name = ref('')
    const className = ref('')

    function handleSubmit(){
        emit('add-student', {studentId: studentId.value, name: name.value, className: className.value})
        studentId.value = ''
        name.value = ''
        className.value = ''
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
</style>