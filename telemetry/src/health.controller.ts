import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller("ping")
export class HealthController {
  constructor(private readonly appService: AppService) {}

  @Get("/")
  getPing() {
    return {
      pong: true,
    };
  }
}
