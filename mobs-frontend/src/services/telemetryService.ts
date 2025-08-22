import api from "./http";

const TELEMETRY_URL = "http://localhost:3000";

export const getTelemetry = async (plate: string) => {
  const res = await api.get(`${TELEMETRY_URL}/telemetry/${plate}`);
  return res.data;
};
