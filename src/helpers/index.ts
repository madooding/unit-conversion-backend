/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Schema } from 'mongoose'
import AutoIncrementFactory from 'mongoose-sequence'
import mongoosePaginate = require('mongoose-paginate-v2')
import { snakeCase } from 'lodash'

export function createMongooseModule(model: Function, schema: Schema, connection: any) {
  const AutoIncrement = AutoIncrementFactory(connection)
  schema.plugin(AutoIncrement as any, { id: `${snakeCase(model.name)}_counter`, inc_field: 'id' })
  schema.plugin(mongoosePaginate)
  schema.plugin(require('mongoose-autopopulate'))
  return schema
}
