import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AppService, TelemetryData } from "./app.service";

@Controller("telemetry")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/:vehicleId")
  async getTelemetry(
    @Param("vehicleId") vehicleId: string
  ): Promise<TelemetryData | undefined> {
    const telemetryData = await this.appService.getTelemetryData(vehicleId);
    // A validação já é feita no service, então aqui você pode retornar os dados
    return telemetryData;
  }
}
