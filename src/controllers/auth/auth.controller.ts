import { RequestRenewAccessTokenDto, ResponseRefreshTokenDto, SignInDto } from '@/modules/auth/auth.dto'
import { AuthService } from '@/modules/auth/auth.service'
import { TokenService } from '@/modules/token/token.service'
import { UserService } from '@/modules/user/user.service'
import { BadRequestException, Body, Controller, Post, Req, UnauthorizedException } from '@nestjs/common'
import { add } from 'date-fns'
import { Request } from 'express'

@Controller('authentication')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService, private tokenService: TokenService) {}

  @Post()
  public async signin(@Req() req: Request, @Body() payload: SignInDto) {
    const user = await this.userService.findOne({ email: payload.email }).catch(() => null)
    if (!user) throw new BadRequestException('User Not Found')

    const bool = await this.authService.compareHash(user, payload.password)
    if (!bool) throw new BadRequestException('Password Incorrect!')

    const token = await this.tokenService.create({
      uid: user.id,
      exp: add(new Date(), { days: 7 }),
      valid: true,
    })

    const accessToken = await this.authService.generateAccessToken(user)
    const refreshToken = await this.authService.generateRefreshToken(token.id, user)

    return new ResponseRefreshTokenDto({ accessToken, refreshToken })
  }

  @Post('accessToken')
  async renewAccessToken(
    @Req() req: Request,
    @Body() body: RequestRenewAccessTokenDto,
  ): Promise<ResponseRefreshTokenDto> {
    const refreshToken = await this.authService.validateRefreshToken(body.refreshToken)

    const token = await this.tokenService
      .findOneById(refreshToken.id)
      .catch((e) => Promise.reject(new UnauthorizedException()))

    if (!token.valid) throw new UnauthorizedException('Refresh Token Reusing Detected!')

    await this.tokenService.updateOneById(token.id, {
      valid: false,
    })

    const user = await this.userService.findOneById(refreshToken.uid)

    const newToken = await this.tokenService.create({
      uid: user.id,
      exp: add(new Date(), {
        days: 7,
      }),
      valid: true,
    })

    const newRefreshToken = this.authService.generateRefreshToken(newToken.id, user)
    const newAccessToken = this.authService.generateAccessToken(user)

    return new ResponseRefreshTokenDto({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    })
  }
}
