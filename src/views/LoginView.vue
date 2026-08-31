<template>
  <div class="auth-card card">
    <h2>Log in</h2>
    <form @submit.prevent="handleSubmit">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <label class="remember">
        <input type="checkbox" v-model="rememberMe" />
        Remember Me
      </label>
      <button type="submit">Log in</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p class="switch">No account yet? <router-link to="/signup">Sign up</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginTeacher } from '../services/api'

const router = useRouter()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const error = ref('')

function handleSubmit() {
  error.value = ''
  try {
    loginTeacher(email.value, password.value, rememberMe.value)
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

.remember {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--ink-soft);
  cursor: pointer;
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
