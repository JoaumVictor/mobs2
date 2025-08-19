export interface TelemetryData {
    latitude: number;
    longitude: number;
    velocidade: number;
    combustivel: number;
    hora_ultima_atualizacao: string;
}
export declare class AppService {
    private readonly vehicleTelemetry;
    constructor();
    private startTelemetrySimulation;
    private generateRandomData;
    getTelemetryData(vehicleId: string): TelemetryData | undefined;
}
