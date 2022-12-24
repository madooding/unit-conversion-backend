import { PaginationParams } from '@/decorators/pagination.decorator'
import { PaginationParamsDto } from '@/modules/base/base.dto'
import { PaginatedUserDto, CreateUserDto, UserDto, EditUserDto } from '@/modules/user/user.dto'
import { UserService } from '@/modules/user/user.service'
import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'
import { BaseController } from '@/controllers/base/base.controller'
import { TokenGuard } from '@/modules/auth/token.guard'

@Controller('users')
export class UsersController extends BaseController<UserService> {
  constructor(private userService: UserService) {
    super(userService)
  }

  @Get()
  @UseGuards(TokenGuard)
  public async getAll(@Req() req: Request, @PaginationParams() params: PaginationParamsDto) {
    return new PaginatedUserDto(await super.getAll(req, params))
  }

  @Post()
  public async createItem(@Req() req: Request, @Body() data: CreateUserDto) {
    const user = await this.userService.findOne({ email: data.email }).catch(() => null)
    if (user) throw new BadRequestException('This email is already exist!')

    const hash = await this.userService.hashPassword(data.password)
    const result = await this.userService.create({ ...data, password: hash })

    return new UserDto(result.toObject())
  }

  @Put(':id')
  @UseGuards(TokenGuard)
  public async updateItem(@Req() req: Request, @Param('id') id: number, @Body() data: EditUserDto) {
    const result = await super.updateItem(req, id, data)

    return new UserDto(result)
  }

  @Delete(':id')
  @UseGuards(TokenGuard)
  public async deleteItem(@Req() req: Request, @Param('id') id: number) {
    return await super.deleteItem(req, id)
  }
}
