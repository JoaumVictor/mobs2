import { AppService } from "./app.service";
export declare class HealthController {
    private readonly appService;
    constructor(appService: AppService);
    getPing(): {
        pong: boolean;
    };
}
