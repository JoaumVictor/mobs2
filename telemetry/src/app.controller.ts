import { Controller, Get, Param, UseGuards, Headers } from "@nestjs/common";
import { AppService, TelemetryData } from "./app.service";
import { AuthGuard } from "./auth.guard";
import { TokenNotExistException } from "./common/exceptions/token-not-exist.exception";

@Controller("telemetry")
@UseGuards(AuthGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/:plate")
  async getTelemetry(
    @Param("plate") plate: string,
    @Headers("authorization") authorizationHeader: string
  ): Promise<TelemetryData | undefined> {
    const token = authorizationHeader?.split(" ")[1];
    if (!token) {
      throw new TokenNotExistException();
    }
    const telemetryData = await this.appService.getTelemetryData(plate, token);
    return telemetryData;
  }
}
