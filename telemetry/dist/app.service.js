"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const axios_2 = require("axios");
const vehicle_not_found_exception_1 = require("./common/exceptions/vehicle-not-found.exception");
let AppService = class AppService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.vehicleTelemetry = {};
        const laravelApiUrl = this.configService.get("LARAVEL_API_URL");
        if (!laravelApiUrl) {
            throw new Error("LARAVEL_API_URL is not defined in the environment variables.");
        }
        this.laravelApiUrl = laravelApiUrl;
        this.startTelemetrySimulation();
    }
    startTelemetrySimulation() {
        setInterval(() => {
            Object.keys(this.vehicleTelemetry).forEach((plate) => {
                this.vehicleTelemetry[plate] = this.generateRandomData();
            });
            console.log("Telemetry data updated!");
        }, 5000);
    }
    generateRandomData() {
        return {
            latitude: Math.random() * 180 - 90,
            longitude: Math.random() * 360 - 180,
            velocidade: Math.floor(Math.random() * 120),
            combustivel: Math.floor(Math.random() * 100),
            hora_ultima_atualizacao: new Date().toISOString(),
        };
    }
    async checkVehicleExists(plate, token) {
        var _a, _b;
        try {
            const url = `${this.laravelApiUrl}/api/vehicles/${plate}`;
            await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }));
            return true;
        }
        catch (error) {
            if ((0, axios_2.isAxiosError)(error)) {
                console.error("Erro detalhado do Axios:", error.message);
                if (error.response) {
                    console.error("Dados da Resposta:", error.response.data);
                    console.error("Status da Resposta:", error.response.status);
                }
            }
            if ((0, axios_2.isAxiosError)(error) &&
                error.response &&
                error.response.status === 404) {
                return false;
            }
            if ((0, axios_2.isAxiosError)(error) &&
                error.response &&
                error.response.status === 401) {
                throw new common_1.HttpException("Token JWT inválido para a API Laravel.", common_1.HttpStatus.UNAUTHORIZED);
            }
            throw new common_1.InternalServerErrorException(`Erro ao se comunicar com o servidor Laravel. Status: ${(_a = error.response) === null || _a === void 0 ? void 0 : _a.status}, Dados: ${JSON.stringify((_b = error.response) === null || _b === void 0 ? void 0 : _b.data)}`);
        }
    }
    async getTelemetryData(plate, token) {
        const vehicleExists = await this.checkVehicleExists(plate, token);
        if (!vehicleExists) {
            throw new vehicle_not_found_exception_1.VehicleNotFoundException(plate);
        }
        if (!this.vehicleTelemetry[plate]) {
            this.vehicleTelemetry[plate] = this.generateRandomData();
        }
        return this.vehicleTelemetry[plate];
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], AppService);
//# sourceMappingURL=app.service.js.map