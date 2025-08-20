import { defineStore } from "pinia";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    token: localStorage.getItem("token"),
    user: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(email: string, password: string) {
      const res = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });
      this.token = res.data.token;
      localStorage.setItem("token", this.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      await this.fetchUser();
    },
    async fetchUser() {
      const res = await axios.get("http://localhost:8000/api/user");
      this.user = res.data;
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    },
  },
});
