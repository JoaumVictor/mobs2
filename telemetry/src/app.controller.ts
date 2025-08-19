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
  getTelemetry(@Param("vehicleId") vehicleId: string): TelemetryData {
    const telemetryData = this.appService.getTelemetryData(vehicleId);
    if (!telemetryData) {
      throw new HttpException(
        "Telemetry data not found for this vehicle",
        HttpStatus.NOT_FOUND
      );
    }
    return telemetryData;
  }
}
