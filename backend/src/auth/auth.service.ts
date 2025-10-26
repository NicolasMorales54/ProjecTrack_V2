import '../auth/local.strategy';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.correoElectronico,
      rol: user.rol,
    };

    const token = await this.jwtService.signAsync(payload);

    console.log('[AuthService] token generado:', token);

    // Decode the token to get the payload with iat and exp
    const decodedToken = this.jwtService.decode(token);

    console.log('[AuthService] token decodificado:', decodedToken);

    if (!decodedToken) {
      throw new Error('[AuthService] token no válido o decodificación fallida');
    }

    console.log('[AuthService] user role:', decodedToken.rol);

    return {
      access_token: token,
      tokenPayload: {
        userId: decodedToken.sub,
        email: decodedToken.email,
        rol: decodedToken.rol,
        iat: decodedToken.iat,
        exp: decodedToken.exp,
      },
    };
  }
}
