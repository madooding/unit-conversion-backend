import { ConversionService } from './../../modules/conversion/conversion.service'
import { BaseController } from '@/controllers/base/base.controller'
import { Controller, Get, Res } from '@nestjs/common'
import { Response } from 'express'

@Controller('conversions')
export class ConversionsController extends BaseController<ConversionService> {
  constructor(private conversionService: ConversionService) {
    super(conversionService)
  }

  @Get()
  public getConversionsTable(@Res() response: Response) {
    // TODO: Comparation Formula
    // Target = Source/(CentimetreUnit/SourceUnit)*(CentimetreUnit/TargetUnit)
    response.status(200).send('OK')
  }
}
