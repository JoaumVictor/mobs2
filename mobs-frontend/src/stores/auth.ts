import { defineStore } from "pinia";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthResponseRegister {
  user: User;
  token: string;
}

interface AuthResponseLogin {
  token: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    token: null,
    loading: false,
    error: null,
  }),
  actions: {
    async register(name: string, email: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await axios.post<AuthResponseRegister>(
          `${API_URL}/register`,
          { name, email, password }
        );

        this.user = data.user;
        this.token = data.token;

        localStorage.setItem("authToken", this.token);
        localStorage.setItem("user", JSON.stringify(this.user));
      } catch (err: any) {
        this.error = err.response?.data?.message || "Erro ao registrar.";
      } finally {
        this.loading = false;
      }
    },
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await axios.post<AuthResponseLogin>(
          `${API_URL}/login`,
          { email, password }
        );
        this.token = data.token;
        localStorage.setItem("authToken", this.token);
      } catch (err: any) {
        this.error =
          err.response?.data?.message ||
          "Erro ao fazer login. Verifique suas credenciais.";
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
    },
    loadStateFromStorage() {
      const savedToken = localStorage.getItem("authToken");
      const savedUser = localStorage.getItem("user");

      if (savedToken) {
        this.token = savedToken;
        axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
      }

      if (savedUser) {
        this.user = JSON.parse(savedUser);
      }
    },
  },
});
