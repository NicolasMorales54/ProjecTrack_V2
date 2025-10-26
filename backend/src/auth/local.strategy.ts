import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({ usernameField: 'correoElectronico', passwordField: 'contrasena' });
  }

  async validate(username: string, password: string): Promise<User> {
    console.log('[LocalStrategy] validate():', { username, password });

    const user = await this.usersService.findByEmail(username);
    if (!user || !user.contrasena) {
      console.log('[LocalStrategy] ❌ Usuario no encontrado o sin contraseña');
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const isMatch = await bcrypt.compare(password, user.contrasena);
    console.log('[LocalStrategy] bcrypt match:', isMatch);

    if (!isMatch) {
      console.log('[LocalStrategy] ❌ Contraseña incorrecta');
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // delete user.contrasena;
    // console.log('[LocalStrategy] usuario sin contraseña:', user);
    return user;
  }
}
