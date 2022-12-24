import { createMongooseModule } from '@/helpers'
import { User, UserSchema } from '@/schemas/user.schema'
import { Module } from '@nestjs/common'
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose'
import { UserService } from './user.service'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: (connection) => createMongooseModule(User, UserSchema, connection),
        inject: [getConnectionToken()],
      },
    ]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
