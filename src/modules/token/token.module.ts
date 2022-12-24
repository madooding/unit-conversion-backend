import { createMongooseModule } from '@/helpers'
import { Token, TokenSchema } from '@/schemas/token.schema'
import { Module } from '@nestjs/common'
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose'
import { TokenService } from './token.service'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Token.name,
        useFactory: (connection) => createMongooseModule(Token, TokenSchema, connection),
        inject: [getConnectionToken()],
      },
    ]),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
