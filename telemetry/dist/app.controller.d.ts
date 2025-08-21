import { AppService, TelemetryData } from "./app.service";
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getTelemetry(plate: string, authorizationHeader: string): Promise<TelemetryData | undefined>;
}
