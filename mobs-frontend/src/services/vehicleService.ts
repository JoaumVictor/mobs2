import api from "./http";

const API_URL = "http://localhost:8000/api";

export const getVehicles = async () => {
  const res = await api.get(`${API_URL}/vehicles`);
  return res.data;
};
