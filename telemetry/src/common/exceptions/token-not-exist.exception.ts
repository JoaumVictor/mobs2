import { HttpException, HttpStatus } from "@nestjs/common";

export class TokenNotExistException extends HttpException {
  constructor() {
    super("Token de autenticação não fornecido.", HttpStatus.UNAUTHORIZED);
  }
}
