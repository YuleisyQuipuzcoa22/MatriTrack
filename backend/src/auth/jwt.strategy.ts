import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'tu_clave_secreta_fuerte',
    });
  }

  async validate(payload: any) {
    if (!payload.id || !payload.rol) {
      throw new UnauthorizedException('Token inválido');
    }

    return {
      id_usuario: payload.id,
      rol: payload.rol,
    };
  }
}