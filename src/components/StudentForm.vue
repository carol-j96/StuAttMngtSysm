<template>
    <form @submit.prevent="handleSubmit">
        <input v-model="name" type="text" placeholder="Full name" required/>
        <input v-model="className" type="text" placeholder="Class, grade 8A" required/>
        <button type="submit">Add Student</button>
    </form>
</template>

<script setup>
    import { ref } from 'vue'
    
    const emit=defineEmits(['add-student'])

    const name = ref('')
    const className = ref('')

    function handleSubmit(){
        emit('add-student', {name: name.value, className: className.value})
        name.value = ''
        className.value = ''
    }
</script>

<style scoped>
</style>