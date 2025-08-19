import { Injectable } from "@nestjs/common";

export interface TelemetryData {
  latitude: number;
  longitude: number;
  velocidade: number;
  combustivel: number;
  hora_ultima_atualizacao: string;
}

@Injectable()
export class AppService {
  private readonly vehicleTelemetry: Record<string, TelemetryData> = {};

  constructor() {
    this.startTelemetrySimulation();
  }

  private startTelemetrySimulation() {
    ["ABC-1234", "XYZ-9876", "DEF-5678", "GHI-4321", "JKL-9123"].forEach(
      (placa) => {
        this.vehicleTelemetry[placa] = this.generateRandomData();
      }
    );

    setInterval(() => {
      Object.keys(this.vehicleTelemetry).forEach((placa) => {
        this.vehicleTelemetry[placa] = this.generateRandomData();
      });
      console.log("Telemetry data updated!");
    }, 5000);
  }

  private generateRandomData(): TelemetryData {
    return {
      latitude: Math.random() * 180 - 90,
      longitude: Math.random() * 360 - 180,
      velocidade: Math.floor(Math.random() * 120),
      combustivel: Math.floor(Math.random() * 100),
      hora_ultima_atualizacao: new Date().toISOString(),
    };
  }

  getTelemetryData(vehicleId: string): TelemetryData | undefined {
    return this.vehicleTelemetry[vehicleId];
  }
}
