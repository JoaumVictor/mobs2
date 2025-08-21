import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
export interface TelemetryData {
    latitude: number;
    longitude: number;
    velocidade: number;
    combustivel: number;
    hora_ultima_atualizacao: string;
}
export declare class AppService {
    private readonly httpService;
    private readonly configService;
    private readonly vehicleTelemetry;
    private readonly laravelApiUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    private startTelemetrySimulation;
    private generateRandomData;
    private checkVehicleExists;
    getTelemetryData(plate: string, token: string): Promise<TelemetryData | undefined>;
}
