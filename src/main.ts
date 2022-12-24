import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import morgan from 'morgan'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  })

  app.use(morgan('common'))

  app.useGlobalPipes(
    new ValidationPipe({
      always: true,
      whitelist: true,
      transform: true,
    }),
  )

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(new Reflector(), {
      excludeExtraneousValues: true,
      excludePrefixes: ['_', '$'],
    }),
  )

  await app
    .listen(3000)
    .then(() =>
      console.log(
        `This node is running on ${process.env.NODE_ENV} mode and listening to port ${process.env.NODE_PORT}`,
      ),
    )
}
bootstrap()
