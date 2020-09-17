import { NestFactory } from '@nestjs/core';
import { QuantamCoreModule } from './quantam.core.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(QuantamCoreModule);
    const options = new DocumentBuilder()
        .setTitle('Quantam Core')
        .setDescription('All OpenAPI specs for Quantam Core')
        .setVersion('0.0.1')
        .addTag('quantam')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('swagger', app, document);

    await app.listen(3000);
}
bootstrap();
