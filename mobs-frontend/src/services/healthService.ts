import axios from "axios";

export interface HealthStatus {
  telemetry: boolean;
  backend: boolean;
}

export const checkApisHealth = async (): Promise<HealthStatus> => {
  const status: HealthStatus = { telemetry: false, backend: false };

  try {
    const res = await axios.get("http://localhost:3000/ping");
    status.telemetry = res.status === 200;
  } catch (e) {
    status.telemetry = false;
  }

  try {
    const res = await axios.get("http://localhost:8000/api/ping");
    status.backend = res.status === 200;
  } catch (e) {
    status.backend = false;
  }

  return status;
};
