import { PaginationParams } from '@/decorators/pagination.decorator'
import { BaseDto, PaginatedResultDto, PaginationParamsDto } from '@/modules/base/base.dto'
import { BaseService } from '@/modules/base/base.service'
import { BaseDocument } from '@/schemas/base.schema'
import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { Request } from 'express'

@Controller()
export class BaseController<T extends BaseService<D>, D extends BaseDocument = any> {
  constructor(private baseService: T) {}

  @Get()
  public async getAll(
    @Req() req: Request,
    @PaginationParams() params: PaginationParamsDto,
  ): Promise<PaginatedResultDto> {
    const result = await this.baseService.getPaginatedResult(params)

    return new PaginatedResultDto(result)
  }

  @Get(':id')
  public async getItem(@Req() req: Request, @Param('id') id: number): Promise<any> {
    const result = await this.baseService.findOneById(id)

    return {
      ...plainToInstance(BaseDto, result.toObject()),
    }
  }

  @Post()
  public async createItem(@Req() req: Request, @Body() body: any): Promise<any> {
    try {
      const result = await this.baseService.create(body)
      return {
        ...plainToInstance(BaseDto, result.toObject()),
      }
    } catch (e) {
      throw new InternalServerErrorException((e as any).message)
    }
  }

  @Put(':id')
  public async updateItem(@Req() req: Request, @Param('id') id: number, @Body() body: any): Promise<any> {
    const result = await this.baseService.updateOneById(id, body)

    return {
      ...plainToInstance(BaseDto, result.toObject()),
    }
  }

  @Delete(':id')
  public async deleteItem(@Req() req: Request, @Param('id') id: number): Promise<any> {
    const result = await this.baseService.delete(id)
    if (!result) throw new NotFoundException()

    return {
      message: `Item ID: ${id} has been deleted.`,
    }
  }
}
