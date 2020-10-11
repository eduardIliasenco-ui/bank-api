import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.get('jwtConfig.secret'),
      // passReqToCallback: true,
    });
  }

  async validate({ iat, exp, email }: { iat: number; exp: number, email: string }): Promise<User> {
    const isExpired = exp - iat <= 0;
    const user = await this.userService.validateUserByEmail(email);

    if (!user || isExpired) {
      throw new UnauthorizedException();
    }

    return user;
  }
  // async validate(req: Request, payload: UserDTO): Promise<IUser> {
  //   const user = await this.userService.validateUser(payload);

  //   if (!user) {
  //     throw new UnauthorizedException();
  //   }

  //   return user;
  // }

  // version from https://github.com/abouroubi/nestjs-auth-jwt/blob/master/src/auth/strategies/jwt-strategy.ts
  // async validate(req, payload: JwtPayload) {
  //   // Little hack but ¯\_(ツ)_/¯
  //   const self: any = this;
  //   const token = self._jwtFromRequest(req);
  //   // We can now use this token to check it against black list
  //   // @todo: check against black list 😄
  //   const result = await this.authService.validatePayload(payload);
  //   if (!result) {
  //     throw new UnauthorizedException();
  //   }
  //   return result;
  // }
}