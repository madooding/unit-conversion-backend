import { BaseDto, PaginatedResultDto } from '@/modules/base/base.dto'
import { PropertyOf } from '@/types'
import { PickType } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsEmail, IsString } from 'class-validator'

@Expose()
export class UserDto extends BaseDto {
  constructor(user: PropertyOf<UserDto>) {
    super(user)
    Object.assign(this, user)
  }

  @Expose()
  @IsEmail()
  email!: string

  @Expose({ toClassOnly: true })
  @IsString()
  password!: string
}

@Expose()
export class CreateUserDto extends PickType(UserDto, ['email', 'password']) {}

@Expose()
export class EditUserDto extends PickType(UserDto, []) {}

export class PaginatedUserDto extends PaginatedResultDto<UserDto> {
  @Expose()
  @Type(() => UserDto)
  items!: UserDto[]
}
