import { Order } from '@/constants'
import { PaginatedResult, PaginationParams } from '@/types'
import { Exclude, Expose, Transform, Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator'
import { Types } from 'mongoose'

export class BaseDto {
  constructor(data?: BaseDto) {
    Object.assign(this, data)
  }

  @Exclude()
  @Type(() => Types.ObjectId)
  @Transform((params) => (params.value as Types.ObjectId).toHexString(), { toPlainOnly: true })
  _id?: Types.ObjectId

  @Exclude()
  __v?: any

  @Expose()
  @IsInt()
  id?: number

  @Expose()
  @IsDate()
  updatedAt?: Date

  @Expose()
  @IsDate()
  createdAt?: Date
}

export class PaginationParamsDto implements Partial<PaginationParams> {
  @IsNumberString()
  @IsOptional()
  page!: number

  @IsNumberString()
  @IsOptional()
  limit!: number

  @IsString()
  @IsOptional()
  sort?: string

  @IsEnum(Order)
  @IsOptional()
  order?: Order
}

export class PaginatedResultDto<T = any> implements PaginatedResult<T> {
  constructor(data?: PaginatedResultDto<T>) {
    Object.assign(this, data)
  }

  @Expose()
  @IsNumber()
  page!: number

  @Expose()
  @IsNumber()
  limit!: number

  @Expose()
  @IsNumber()
  totalItems!: number

  @Expose()
  @IsNumber()
  totalPages!: number

  @Expose()
  @IsArray()
  items!: T[]
}

export class PermissionDto {
  constructor(data: PermissionDto) {
    Object.assign(this, data)
  }

  @Expose()
  @IsBoolean()
  read!: boolean

  @Expose()
  @IsBoolean()
  update!: boolean

  @Expose()
  @IsBoolean()
  delete!: boolean
}
