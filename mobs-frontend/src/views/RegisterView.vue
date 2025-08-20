<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import background from "../assets/background.avif";

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const auth = useAuthStore();
const router = useRouter();

const isEmailInvalid = ref(false);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordMismatch = ref(false);

const passwordsMatch = computed(() => {
  return password.value === confirmPassword.value;
});

async function handleRegister() {
  if (!emailRegex.test(email.value)) {
    isEmailInvalid.value = true;
    return;
  }
  isEmailInvalid.value = false;
  if (!passwordsMatch.value) {
    passwordMismatch.value = true;
    return;
  }
  passwordMismatch.value = false;
  await auth.register(name.value, email.value, password.value);
  if (auth.user) {
    router.push("/dashboard");
  }
}

const backgroundStyle = computed(() => ({
  backgroundImage: `url(${background})`,
}));
</script>

<template>
  <div class="register-page" :style="backgroundStyle">
    <div class="register-card">
      <div class="logo-container">
        <img
          src="https://static.wixstatic.com/media/373a0a_321617b4d7f14ecc8fa9f7484b515974~mv2.png/v1/fill/w_168,h_40,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Prancheta%2023%20cópia%203.png"
          alt="Logo Mobs2"
        />
      </div>
      <h1>Crie sua conta</h1>
      <input type="text" v-model="name" placeholder="Nome" />

      <input
        type="email"
        v-model="email"
        placeholder="Email"
        :class="{ 'input-error': isEmailInvalid }"
      />

      <input type="password" v-model="password" placeholder="Senha" />

      <input
        type="password"
        v-model="confirmPassword"
        placeholder="Confirme sua Senha"
        :class="{ 'input-error': passwordMismatch }"
      />

      <button @click="handleRegister" :disabled="auth.loading">
        Registrar
      </button>

      <p v-if="isEmailInvalid" class="error-message">
        Por favor, insira um e-mail válido.
      </p>

      <p v-if="passwordMismatch" class="error-message">
        As senhas não coincidem.
      </p>

      <p v-if="auth.error" class="error-message">{{ auth.error }}</p>

      <p class="login-link">
        Já tem conta?
        <router-link to="/login">Faça login</router-link>
      </p>
    </div>
  </div>
</template>

<style lang="scss">
@import "../assets/scss/variables";

.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;

  .register-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    background-color: $color-white;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;

    .logo-container {
      background-color: $color-purple-dark;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 60px;
      padding-top: 1rem;
      padding-bottom: 1rem;

      img {
        width: 168px;
      }
    }

    h1 {
      font-size: 1.5rem;
      color: $color-text-dark;
      margin-bottom: 1.5rem;
    }

    input {
      width: 100%;
      max-width: 340px;
      padding: 0.8rem 1rem;
      margin-bottom: 1rem;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 1rem;
      transition: border-color 0.3s ease;

      &:focus {
        outline: none;
        border-color: $color-purple-light;
      }

      &.input-error {
        border-color: $color-error;
      }
    }

    button {
      width: 100%;
      padding: 1rem;
      background-color: $color-highlight-lime;
      color: $color-text-dark;
      font-weight: bold;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.3s ease;

      &:hover:not(:disabled) {
        background-color: darken($color-highlight-lime, 10%);
      }

      &:disabled {
        cursor: not-allowed;
        background-color: lighten($color-highlight-lime, 10%);
      }
    }

    .error-message {
      color: $color-error;
      margin-top: 1rem;
    }

    .login-link {
      margin-top: 1.5rem;
      color: $color-text-dark;

      a {
        color: $color-purple-dark;
        text-decoration: none;
        font-weight: bold;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .error-message {
    color: $color-error;
    margin-top: 1rem;
  }
}
</style>
