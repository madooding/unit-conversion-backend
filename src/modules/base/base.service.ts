import { Injectable } from '@nestjs/common'
@Injectable()
export class BaseService {
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
