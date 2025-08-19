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
let AppService = class AppService {
    constructor() {
        this.vehicleTelemetry = {};
        this.startTelemetrySimulation();
    }
    startTelemetrySimulation() {
        ["ABC-1234", "XYZ-9876", "DEF-5678", "GHI-4321", "JKL-9123"].forEach((placa) => {
            this.vehicleTelemetry[placa] = this.generateRandomData();
        });
        setInterval(() => {
            Object.keys(this.vehicleTelemetry).forEach((placa) => {
                this.vehicleTelemetry[placa] = this.generateRandomData();
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
    getTelemetryData(vehicleId) {
        return this.vehicleTelemetry[vehicleId];
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AppService);
//# sourceMappingURL=app.service.js.map