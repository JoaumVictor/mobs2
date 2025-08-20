"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const app_controller_1 = require("../src/app.controller");
const app_service_1 = require("../src/app.service");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const common_1 = require("@nestjs/common");
describe("AppController", () => {
    let appController;
    let httpService;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [app_controller_1.AppController],
            providers: [
                app_service_1.AppService,
                {
                    provide: axios_1.HttpService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
                {
                    provide: config_1.ConfigService,
                    useValue: {
                        get: jest.fn(() => "http://localhost:8000"),
                    },
                },
            ],
        }).compile();
        appController = module.get(app_controller_1.AppController);
        httpService = module.get(axios_1.HttpService);
    });
    it("deve retornar os dados de telemetria para um veículo existente", async () => {
        const vehicleId = "ABC-1234";
        const mockAxiosResponse = {
            data: { id: 1, placa: vehicleId },
            status: 200,
            statusText: "OK",
            headers: {},
            config: { headers: {} },
        };
        httpService.get.mockReturnValueOnce((0, rxjs_1.of)(mockAxiosResponse));
        const result = await appController.getTelemetry(vehicleId);
        expect(httpService.get).toHaveBeenCalledWith(`http://localhost:8000/api/vehicles/${vehicleId}`);
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
                config: { headers: {} },
            },
            name: "AxiosError",
            message: "Request failed with status code 404",
            toJSON: () => ({}),
        };
        httpService.get.mockReturnValueOnce((0, rxjs_1.throwError)(() => mockError));
        await expect(appController.getTelemetry(vehicleId)).rejects.toThrow(common_1.NotFoundException);
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
                config: { headers: {} },
            },
            name: "AxiosError",
            message: "Request failed with status code 500",
            toJSON: () => ({}),
        };
        httpService.get.mockReturnValueOnce((0, rxjs_1.throwError)(() => mockError));
        await expect(appController.getTelemetry(vehicleId)).rejects.toThrow(common_1.InternalServerErrorException);
    });
});
//# sourceMappingURL=app.controller.spec.js.map