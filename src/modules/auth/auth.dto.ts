import { PickType } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsEmail, IsString } from 'class-validator'

@Expose()
export class SignInDto {
  @Expose()
  @IsEmail()
  email!: string

  @Expose({ toClassOnly: true })
  @IsString()
  password!: string
}

export class ResponseRefreshTokenDto {
  constructor(data: ResponseRefreshTokenDto) {
    Object.assign(this, data)
  }

  @Expose()
  @IsString()
  refreshToken!: string

  @Expose()
  @IsString()
  accessToken!: string
}

export class RequestRenewAccessTokenDto extends PickType(ResponseRefreshTokenDto, ['refreshToken']) {}
