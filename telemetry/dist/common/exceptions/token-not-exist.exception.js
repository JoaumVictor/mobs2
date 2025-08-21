"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenNotExistException = void 0;
const common_1 = require("@nestjs/common");
class TokenNotExistException extends common_1.HttpException {
    constructor() {
        super("Token de autenticação não fornecido.", common_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.TokenNotExistException = TokenNotExistException;
//# sourceMappingURL=token-not-exist.exception.js.map