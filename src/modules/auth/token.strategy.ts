import { IAccessTokenPayload } from '@/types/auth'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserService } from '../user/user.service'

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_ACCESS_TOKEN,
    })
  }

  async validate(payload: IAccessTokenPayload) {
    const user = await this.userService.findOneById(payload.uid)
    return user.toObject()
  }
}
