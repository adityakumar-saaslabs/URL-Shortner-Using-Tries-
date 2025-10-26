import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { connect_db_key } from 'const';
import { UrlModule } from './url/url.module';

@Module({
  imports: [MongooseModule.forRoot(connect_db_key), UrlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
