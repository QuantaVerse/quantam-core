import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as Bunyan from "bunyan";

import { BunyanLoggerService } from "./logger/logger.service";
import { QuantamCoreModule } from "./quantam.core.module";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(QuantamCoreModule, {
        logger: new BunyanLoggerService({
            projectId: "quantam-core",
            formatterOptions: {
                outputMode: "long"
            }
        })
    });

    const options = new DocumentBuilder()
        .setTitle("Quantam Core")
        .setDescription("All OpenAPI specs for Quantam Core")
        .setVersion("0.0.1")
        .addTag("quantam")
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("swagger", app, document);

    await app.listen(3000);
}

bootstrap();
