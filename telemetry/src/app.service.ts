import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { isAxiosError } from "axios";
import { VehicleNotFoundException } from "./common/exceptions/vehicle-not-found.exception";
import { LaravelCommunicationException } from "./common/exceptions/laravel-communication.exception";

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
  private readonly laravelApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    const laravelApiUrl = this.configService.get<string>("LARAVEL_API_URL");
    if (!laravelApiUrl) {
      throw new Error(
        "LARAVEL_API_URL is not defined in the environment variables."
      );
    }
    this.laravelApiUrl = laravelApiUrl;
    this.startTelemetrySimulation();
  }

  private startTelemetrySimulation() {
    setInterval(() => {
      Object.keys(this.vehicleTelemetry).forEach((plate) => {
        this.vehicleTelemetry[plate] = this.generateRandomData();
      });
      console.log("Telemetry data updated!");
    }, 5000);
  }

  private generateRandomData(): TelemetryData {
    let lat = -23.55; // (Av. Paulista)
    let lng = -46.63;
    lat += (Math.random() - 0.5) * 0.001;
    lng += (Math.random() - 0.5) * 0.001;
    lat = Math.min(Math.max(lat, -24.0), -23.3);
    lng = Math.min(Math.max(lng, -46.9), -46.3);

    return {
      latitude: lat,
      longitude: lng,
      velocidade: Math.floor(Math.random() * 120),
      combustivel: Math.floor(Math.random() * 100),
      hora_ultima_atualizacao: new Date().toISOString(),
    };
  }

  private async checkVehicleExists(
    plate: string,
    token: string
  ): Promise<boolean> {
    try {
      const url = `${this.laravelApiUrl}/api/vehicles/${plate}`;
      await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
      return true;
    } catch (error: any) {
      if (isAxiosError(error)) {
        console.error("Erro detalhado do Axios:", error.message);
        if (error.response) {
          console.error("Dados da Resposta:", error.response.data);
          console.error("Status da Resposta:", error.response.status);
        }
      }

      if (
        isAxiosError(error) &&
        error.response &&
        error.response.status === 404
      ) {
        return false;
      }

      if (
        isAxiosError(error) &&
        error.response &&
        error.response.status === 401
      ) {
        throw new HttpException(
          "Token JWT inválido para a API Laravel.",
          HttpStatus.UNAUTHORIZED
        );
      }

      throw new LaravelCommunicationException();
    }
  }

  async getTelemetryData(
    plate: string,
    token: string
  ): Promise<TelemetryData | undefined> {
    const vehicleExists = await this.checkVehicleExists(plate, token);

    if (!vehicleExists) {
      throw new VehicleNotFoundException(plate);
    }

    if (!this.vehicleTelemetry[plate]) {
      this.vehicleTelemetry[plate] = this.generateRandomData();
    }

    return this.vehicleTelemetry[plate];
  }
}
