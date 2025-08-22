<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import background from "../assets/background.avif";
import { useToast } from "vue-toastification";

const email = ref("");
const password = ref("");
const auth = useAuthStore();
const router = useRouter();
const toast = useToast();

async function handleLogin() {
  toast.info("Fazendo login...");
  await auth.login(email.value, password.value);

  if (auth.user) {
    toast.success("Login concluído!");
    router.push("/dashboard");
  } else if (auth.error) {
    toast.error(auth.error);
  }
}

const backgroundStyle = computed(() => ({
  backgroundImage: `url(${background})`,
}));

onMounted(() => {
  auth.loadStateFromStorage();
  if (auth.user || auth.token) {
    auth.logout();
    toast.info("Você foi deslogado por segurança.");
  }
});
</script>

<template>
  <div class="login-page" :style="backgroundStyle">
    <div class="login-card">
      <div class="logo-container">
        <img
          src="https://static.wixstatic.com/media/373a0a_321617b4d7f14ecc8fa9f7484b515974~mv2.png/v1/fill/w_168,h_40,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Prancheta%2023%20cópia%203.png"
          alt="Logo Mobs2"
        />
      </div>
      <h1>Entrar na sua conta</h1>
      <input type="email" v-model="email" placeholder="Email" />
      <input type="password" v-model="password" placeholder="Senha" />
      <button class="next-button" @click="handleLogin" :disabled="auth.loading">
        <span v-if="auth.loading" class="spinner"></span>
        <span v-if="auth.loading">Entrando...</span>
        <span v-else>Entrar</span>
      </button>
      <p v-if="auth.error" class="error-message">{{ auth.error }}</p>
      <p class="signup-link">
        Não tem conta?
        <router-link to="/register">Registre-se aqui</router-link>
      </p>
    </div>
  </div>
</template>

<style lang="scss">
@import "../assets/scss/variables";

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;

  .login-card {
    display: flex;
    flex-direction: column;
    align-items: center;
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

    .signup-link {
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

    .next-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.2rem;
    }
  }
}
</style>
