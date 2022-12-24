import { Order } from '@/constants'
import { Base, BaseDocument } from '@/schemas/base.schema'
import { ExtractModel, PaginatedResult, PaginationParams, PropertyOf, RequireAtLeastOne, SortingKeys } from '@/types'
import { FilterQuery } from 'mongoose'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { omit } from 'lodash'
import { Model, QueryOptions, UpdateQuery } from 'mongoose'

type ModelPropertyOf<T> = ExtractModel<PropertyOf<T>>

@Injectable()
export class BaseService<T extends BaseDocument = BaseDocument> {
  constructor(@InjectModel('model') private model: Model<T>) {}

  public async create(data: PropertyOf<ExtractModel<T>>): Promise<T> {
    return await new this.model(data as any).save()
  }

  public find(data?: FilterQuery<T>): Promise<T[]>
  public find(data?: Partial<ModelPropertyOf<T>>): Promise<T[]>
  public find(data?: any): Promise<T[]> {
    return this.model.find(data as any).exec()
  }

  public findOne(data: RequireAtLeastOne<ModelPropertyOf<T>>, options?: QueryOptions): Promise<T>
  public findOne(data: FilterQuery<T>, options?: QueryOptions): Promise<T>
  public findOne(data: any, options?: QueryOptions): Promise<T> {
    return this.model.findOne(data as any, undefined, options).then((result) => {
      if (!result) throw new NotFoundException()
      return result
    })
  }

  public findOneById(id: Base['id']): Promise<T> {
    return this.findOne({ id } as any)
  }

  public async findManyByIds(ids: Base['id'][]): Promise<T[]> {
    const result: T[] = []

    for (const id of ids) {
      try {
        const item = await this.findOneById(id)
        if (item) result.push(item)
      } catch {}
    }

    return result.filter((each) => each)
  }

  public async findManyDistinct(
    filter: Partial<PropertyOf<ExtractModel<T>>> | FilterQuery<T>,
    distinct: keyof PropertyOf<ExtractModel<T>> | string = '_id',
    sort: SortingKeys<T>,
  ): Promise<T[]> {
    return this.model
      .find()
      .distinct(distinct as string, filter as any)
      .sort(sort as string)
      .exec()
  }

  public async findOneOrCreate(data: FilterQuery<T>, payload?: RequireAtLeastOne<ModelPropertyOf<T>>): Promise<T>
  public async findOneOrCreate(data: RequireAtLeastOne<T>, payload?: RequireAtLeastOne<ModelPropertyOf<T>>): Promise<T>
  public async findOneOrCreate(data: any, payload?: RequireAtLeastOne<ModelPropertyOf<T>>): Promise<T> {
    const result = await this.model.findOne(data)
    return result
      ? Promise.resolve(result)
      : new this.model({
          ...payload,
          ...omit(
            data,
            Object.keys(data).filter((key) => key.startsWith('$')),
          ),
        }).save()
  }

  public async findOneAndUpdate(
    query: RequireAtLeastOne<ModelPropertyOf<T>>,
    update: RequireAtLeastOne<ModelPropertyOf<T>>,
    options?: QueryOptions,
  ): Promise<T>
  public findOneAndUpdate(query: any, update: any, options?: QueryOptions): Promise<T> {
    return this.model.findOneAndUpdate(query, update, options) as any
  }

  public async updateOneById(id: Base['id'], data: Partial<PropertyOf<ExtractModel<T>>> | UpdateQuery<T>): Promise<T> {
    return await this.model.findOneAndUpdate({ id: id as any }, data as any, { new: true }).then((result) => {
      if (!result) throw new NotFoundException()
      return result
    })
  }

  public updateMany(filter: FilterQuery<T>, data: Partial<PropertyOf<ExtractModel<T>>> | UpdateQuery<T>) {
    return this.model.updateMany(filter, data as any)
  }

  public async getPaginatedResult(
    params: PaginationParams<ExtractModel<T>>,
    condition?: Partial<ExtractModel<T>>,
  ): Promise<PaginatedResult<T>>
  public async getPaginatedResult(
    params: PaginationParams<ExtractModel<T>>,
    condition?: FilterQuery<T>,
  ): Promise<PaginatedResult<T>>
  public async getPaginatedResult(
    params: PaginationParams<ExtractModel<T>>,
    condition?: any,
  ): Promise<PaginatedResult<T>> {
    return await this.model
      .paginate(condition, {
        page: params.page,
        limit: params.limit,
        sort: params.order === Order.ASC ? (params.sort as string) : `-${params.sort?.toString()}`,
      })
      .then((result) => ({
        items: result.docs.map((item: any) => item.toObject()),
        limit: result.limit,
        page: result.page || params.page,
        totalItems: result.totalDocs,
        totalPages: result.totalPages,
      }))
  }

  public resetCollections() {
    return this.model.deleteMany()
  }

  public delete(id: Base['id']) {
    return this.model.findOneAndDelete({ id: id as any })
  }

  cleanUndefinedProperties(object: any): any {
    for (const key in object) {
      if (object[key] === undefined) {
        delete object[key]
        continue
      }

      if (object[key] === null) {
        continue
      }

      if (object[key] instanceof Date) {
        continue
      }

      if (typeof object[key] === 'object') {
        this.cleanUndefinedProperties(object[key])
        if (!Object.keys(object[key]).length) delete object[key]
      }

      if (Array.isArray(object[key])) {
        object[key] = (object[key] as any[]).filter((item) => item !== undefined)
      }
    }
    return object
  }
}
