import { TypeOrmConfig } from "@configs/typeorm.config";
import { AppController } from "@controllers/app.controller";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppService } from "@services/app.service";

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useExisting: TypeOrmConfig,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
