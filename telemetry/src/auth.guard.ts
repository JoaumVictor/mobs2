import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    const authHeader = headers["authorization"];
    if (!authHeader) {
      throw new UnauthorizedException("Token de autenticação não fornecido.");
    }
    return true;
  }
}
