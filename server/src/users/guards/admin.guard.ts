import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const adminSecret = req.headers['x-admin-secret'];

    return adminSecret === this.configService.get('ADMIN_SECRET');
  }
}
