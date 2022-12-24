import { TokenDocument } from '@/schemas/token.schema'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { BaseService } from '../base/base.service'

@Injectable()
export class TokenService extends BaseService<TokenDocument> {
  constructor(@InjectModel('Token') private tokenModel: Model<TokenDocument>) {
    super(tokenModel)
  }
}
