import { UserDocument } from '@/schemas/user.schema'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { BaseService } from '../base/base.service'
import bcrypt from 'bcryptjs'

@Injectable()
export class UserService extends BaseService<UserDocument> {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {
    super(userModel)
  }

  public async hashPassword(password: string) {
    return await bcrypt.hash(password, 10)
  }
}
