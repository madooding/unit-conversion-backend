import { UserDocument } from '@/schemas/user.schema'
import { IAccessTokenPayload, IRefreshTokenPayload } from '@/types/auth'
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import bcrypt from 'bcryptjs'

import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  public async validateRefreshToken(refreshToken: string): Promise<IRefreshTokenPayload> {
    const result = await this.jwtService
      .verifyAsync(refreshToken, {
        secret: process.env.SECRET_REFRESH_TOKEN,
      })
      .catch((e) => Promise.reject(new BadRequestException('Refresh Token is invalid')))

    return result
  }

  public async validateAccessToken(accessToken: string): Promise<IAccessTokenPayload> {
    const result = await this.jwtService
      .verifyAsync(accessToken, {
        secret: process.env.SECRET_ACCESS_TOKEN,
      })
      .catch((e) => Promise.reject(new UnauthorizedException()))

    return result
  }

  public generateRefreshToken(id: number, user: UserDocument) {
    const payload = { id, uid: user.id }

    return this.jwtService.sign(payload, {
      algorithm: 'HS512',
      secret: process.env.SECRET_REFRESH_TOKEN!,
      expiresIn: '7d',
    })
  }

  public generateAccessToken(user: UserDocument) {
    const payload = { uid: user.id }

    return this.jwtService.sign(payload, {
      secret: process.env.SECRET_ACCESS_TOKEN!,
      expiresIn: '2h',
    })
  }

  public compareHash(user: UserDocument, plain: string) {
    return bcrypt.compare(plain, user.password)
  }
}
