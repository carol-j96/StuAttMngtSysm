<template>
  <div class="auth-card card">
    <h2>Create an account</h2>
    <form @submit.prevent="handleSubmit">
      <input v-model="name" type="text" placeholder="Full name" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Sign up</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p class="switch">Already have an account? <router-link to="/login">Log in</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerTeacher, loginTeacher } from '../services/api'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

function handleSubmit() {
  error.value = ''
  try {
    registerTeacher({ name: name.value, email: email.value, password: password.value })
    name.value = ''
    email.value = ''
    password.value = ''
    router.push('/')
  } catch (err) {
    error.value = err.message
  }
}
</script>

<style scoped>
.auth-card {
  max-width: 360px;
  margin: 4rem auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

input {
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--ink);
  border-radius: 4px;
}

button {
  background: var(--accent-gold);
  color: var(--ink);
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  font-weight: 600;
}

.error {
  color: var(--absent);
  font-size: 0.85rem;
}

.switch {
  font-size: 0.85rem;
  color: var(--ink-soft);
}
</style>
