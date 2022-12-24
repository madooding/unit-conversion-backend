import { Module } from '@nestjs/common'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'
import { ConversionModule } from '@/modules/conversion/conversion.module'
import { ConversionsController } from '@/controllers/conversions/conversions.controller'

import './environment'

@Module({
  imports: [ConversionModule],
  controllers: [AppController, ConversionsController],
  providers: [AppService],
})
export class AppModule {}
