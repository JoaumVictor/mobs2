"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LaravelCommunicationException = void 0;
const common_1 = require("@nestjs/common");
class LaravelCommunicationException extends common_1.InternalServerErrorException {
    constructor() {
        super("Erro ao se comunicar com o servidor Laravel.");
    }
}
exports.LaravelCommunicationException = LaravelCommunicationException;
//# sourceMappingURL=laravel-communication.exception.js.map