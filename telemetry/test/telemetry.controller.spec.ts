// telemetry.controller.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "../src/app.controller";
import { AppService, TelemetryData } from "../src/app.service";
import { AuthGuard } from "../src/auth.guard";
import { ExecutionContext } from "@nestjs/common";

describe("AppController with JWT", () => {
  let controller: AppController;
  let service: AppService;

  const mockAppService = {
    getTelemetryData: jest.fn(
      (plate: string, token: string): TelemetryData => ({
        latitude: -23.55052,
        longitude: -46.633308,
        velocidade: 80,
        combustivel: 50,
        hora_ultima_atualizacao: new Date().toISOString(),
      })
    ),
  };

  const mockAuthGuard = {
    canActivate: (context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest();
      // Força sempre um token válido no teste
      req.headers.authorization = "Bearer fake-token";
      return true;
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: mockAppService }],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should return telemetry data for a given plate with fake token", async () => {
    const plate = "ABC-1234";
    const result = await controller.getTelemetry(plate, "Bearer fake-token");

    expect(result).toEqual({
      latitude: expect.any(Number),
      longitude: expect.any(Number),
      velocidade: expect.any(Number),
      combustivel: expect.any(Number),
      hora_ultima_atualizacao: expect.any(String),
    });
    expect(mockAppService.getTelemetryData).toHaveBeenCalledWith(
      plate,
      "fake-token"
    );
  });
});
