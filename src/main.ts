import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";

import { AppModule } from "./app.module";
import { setupSwaggerDocument } from "@configs/swagger.config";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.setGlobalPrefix("/api");
  app.enableVersioning();
  app.useGlobalPipes(new ValidationPipe());
  setupSwaggerDocument(app);
  await app.listen(3000);
}
bootstrap();
