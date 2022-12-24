import { PropertyOf } from '@/types'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { add } from 'date-fns'
import { Base, BaseDocument } from './base.schema'

@Schema({ timestamps: true })
export class Token extends Base {
  constructor(token?: PropertyOf<Token>) {
    super(token)
  }

  @Prop({ Type: Number, unique: false })
  uid!: number

  @Prop({
    type: Date,
    default: add(new Date(), {
      days: 7,
    }),
  })
  exp!: Date

  @Prop({ type: Boolean, default: false })
  valid!: boolean
}

export type TokenDocument = Token & BaseDocument
export const TokenSchema = SchemaFactory.createForClass(Token)

TokenSchema.loadClass(Token)
