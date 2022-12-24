import { BaseService } from '@/modules/base/base.service'

import { Controller } from '@nestjs/common'

@Controller()
export class BaseController<T extends BaseService> {
  constructor(private baseService: T) {}
}
