"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleNotFoundException = void 0;
const common_1 = require("@nestjs/common");
class VehicleNotFoundException extends common_1.NotFoundException {
    constructor(plate) {
        super(`Veículo com a placa "${plate}" não encontrado.`);
    }
}
exports.VehicleNotFoundException = VehicleNotFoundException;
//# sourceMappingURL=vehicle-not-found.exception.js.map