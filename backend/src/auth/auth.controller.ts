import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    console.log('[LOGIN CONTROLLER] req.user:', req.user); // 👈 DEBE imprimir el usuario sin contraseña
    return this.authService.login(req.user); // 👈 PASA SOLO EL USUARIO
  }
}
