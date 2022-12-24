import { Request } from 'express'
import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Order } from '@/constants'
import { plainToClass } from 'class-transformer'
import { PaginationParamsDto } from '@/modules/base/base.dto'
import { validate } from 'class-validator'

export const PaginationParams = createParamDecorator(async (data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>()

  const obj = plainToClass(PaginationParamsDto, request.query)
  const errors = await validate(obj)

  if (errors.length > 0) throw new BadRequestException(errors)

  return {
    page: parseInt(request.query.page as string) || 1,
    limit: parseInt(request.query.limit as string) || 30,
    order: request.query.order || Order.DESC,
    sort: request.query.sort || 'id',
  }
})
