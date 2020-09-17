import { NestFactory } from '@nestjs/core';
import { QuantamCoreModule } from './quantam.core.module';

async function bootstrap() {
    const app = await NestFactory.create(QuantamCoreModule);
    await app.listen(3000);
}
bootstrap();
