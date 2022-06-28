import { NestFastifyApplication } from "@nestjs/platform-fastify";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

export function setupSwaggerDocument(app: NestFastifyApplication) {
  const config = new DocumentBuilder()
    .setTitle("Clean Architecture Example")
    .setDescription("API Documentation of Clean Architecture in NestJS")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);
}
