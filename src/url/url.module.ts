import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { Url, UrlSchema } from './url.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlService } from './url.service';

@Module({
  imports: [MongooseModule.forFeature([{
    name: Url.name,
    schema: UrlSchema
  }])],
  controllers: [UrlController],
  providers: [UrlService]
})
export class UrlModule {}
