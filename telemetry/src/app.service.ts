import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { isAxiosError } from "axios";

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

  private async checkVehicleExists(plate: string): Promise<boolean> {
    try {
      const url = `${this.laravelApiUrl}/api/vehicles/${plate}`;
      await firstValueFrom(this.httpService.get(url));
      return true;
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.response &&
        error.response.status === 404
      ) {
        return false;
      }
      throw new InternalServerErrorException(
        "Erro ao se comunicar com o servidor Laravel."
      );
    }
  }

  async getTelemetryData(plate: string): Promise<TelemetryData | undefined> {
    const vehicleExists = await this.checkVehicleExists(plate);

    if (!vehicleExists) {
      throw new NotFoundException(
        `Veículo com a placa "${plate}" não encontrado.`
      );
    }

    if (!this.vehicleTelemetry[plate]) {
      this.vehicleTelemetry[plate] = this.generateRandomData();
    }

    return this.vehicleTelemetry[plate];
  }
}
