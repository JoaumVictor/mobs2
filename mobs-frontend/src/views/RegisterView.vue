<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const name = ref("");
const email = ref("");
const password = ref("");
const auth = useAuthStore();
const router = useRouter();

async function handleRegister() {
  await auth.register(name.value, email.value, password.value);
  if (auth.user) {
    router.push("/dashboard");
  }
}
</script>

<template>
  <div class="register">
    <h1>Registrar</h1>
    <input type="text" v-model="name" placeholder="Nome" />
    <input type="email" v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Senha" />
    <button @click="handleRegister" :disabled="auth.loading">Registrar</button>
    <p v-if="auth.error">{{ auth.error }}</p>
    <p>
      Já tem conta?
      <router-link to="/login">Faça login</router-link>
    </p>
  </div>
</template>
