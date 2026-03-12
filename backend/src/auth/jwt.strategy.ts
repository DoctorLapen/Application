import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload, UserInfo } from './interfaces/auth.interfaces';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: JwtPayload): Promise<UserInfo> {
  const userId = Number(payload.sub);

  if (isNaN(userId)) {
    throw new UnauthorizedException('Invalid token: userId is not a number');
  }

  return {
    userId,
    email: payload.email,
  };
}
}