import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "../src/app.controller";
import { AppService } from "../src/app.service";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { of, throwError } from "rxjs";
import { AxiosResponse, AxiosError } from "axios";
import {
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";

describe("AppController", () => {
  let appController: AppController;
  let httpService: jest.Mocked<HttpService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => "http://localhost:8000"),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    httpService = module.get(HttpService);
  });

  it("deve retornar os dados de telemetria para um veículo existente", async () => {
    const vehicleId = "ABC-1234";

    const mockAxiosResponse: AxiosResponse = {
      data: { id: 1, placa: vehicleId },
      status: 200,
      statusText: "OK",
      headers: {},
      config: { headers: {} as any },
    };

    httpService.get.mockReturnValueOnce(of(mockAxiosResponse));

    const result = await appController.getTelemetry(vehicleId);

    expect(httpService.get).toHaveBeenCalledWith(
      `http://localhost:8000/api/vehicles/${vehicleId}`
    );

    expect(result).toHaveProperty("latitude");
    expect(result).toHaveProperty("longitude");
    expect(result).toHaveProperty("velocidade");
    expect(result).toHaveProperty("combustivel");
  });

  it("deve lançar NotFoundException para veículo inexistente", async () => {
    const vehicleId = "NAO-EXISTE";

    const mockError = {
      isAxiosError: true,
      response: {
        status: 404,
        data: null,
        statusText: "Not Found",
        headers: {},
        config: { headers: {} as any },
      },
      name: "AxiosError",
      message: "Request failed with status code 404",
      toJSON: () => ({}),
    } as AxiosError;

    httpService.get.mockReturnValueOnce(throwError(() => mockError));

    await expect(appController.getTelemetry(vehicleId)).rejects.toThrow(
      NotFoundException
    );
  });

  it("deve lançar InternalServerErrorException em erro inesperado do servidor", async () => {
    const vehicleId = "ERRO-SERVIDOR";

    const mockError = {
      isAxiosError: true,
      response: {
        status: 500,
        data: null,
        statusText: "Internal Server Error",
        headers: {},
        config: { headers: {} as any },
      },
      name: "AxiosError",
      message: "Request failed with status code 500",
      toJSON: () => ({}),
    } as AxiosError;

    httpService.get.mockReturnValueOnce(throwError(() => mockError));

    await expect(appController.getTelemetry(vehicleId)).rejects.toThrow(
      InternalServerErrorException
    );
  });
});
