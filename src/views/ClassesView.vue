<template>
  <h2>Classes</h2>

  <form class="form" @submit.prevent="handleAdd">
    <input v-model="newClassName" type="text" placeholder="Class name" required />
    <button type="submit">Add class</button>
  </form>

  <table class="ledger card">
    <thead>
      <tr>
        <th>Class name</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="c in classes" :key="c.id">
        <td>{{ c.name }}</td>
        <td class="actions">
          <button class="link-btn" @click="handleDelete(c.id)">Remove</button>
        </td>
      </tr>
      <tr v-if="classes.length === 0">
        <td colspan="2" class="empty">No classes yet. Add your first one above.</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { getClasses, addClass, deleteClass } from '../services/api'

    const classes = ref([])
    const newClassName = ref('')

    onMounted(() => {
        classes.value = getClasses()
    })

    function handleAdd() {
        addClass({ name: newClassName.value })
        newClassName.value = ''
        classes.value = getClasses()
    }

    function handleDelete(id) {
        deleteClass(id)
        classes.value = getClasses()
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
    }

    button[type='submit'] {
        background: var(--accent-gold);
        color: var(--ink);
        border: none;
        padding: 0.6rem 1.2rem;
        border-radius: 4px;
        font-weight: 600;
    }

    .ledger { 
        width: 100%; 
        border-collapse: collapse; 
    }

    th, td {
        text-align: left;
        padding: 0.7rem 1rem;
        border-bottom: 1px solid var(--border);
    }

    th {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        letter-spacing: 0.05em;
        color: var(--ink-soft);
        text-transform: uppercase;
    }

    .link-btn {
        background: none;
        border: none;
        color: var(--absent);
        font-size: 0.85rem;
        padding: 0;
    }

    .empty { 
        color: var(--ink-soft); 
        text-align: center; 
        padding: 1.5rem; }

    tbody tr:hover {  
        background: var(--present-bg); 
    }
</style>