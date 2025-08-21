import { InternalServerErrorException } from "@nestjs/common";

export class LaravelCommunicationException extends InternalServerErrorException {
  constructor() {
    super("Erro ao se comunicar com o servidor Laravel.");
  }
}
