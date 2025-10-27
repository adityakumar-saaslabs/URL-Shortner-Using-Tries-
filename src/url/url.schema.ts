import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';
@Schema({ collection: 'url' })
export class Url {
  @Prop()
  url: string;
  @Prop()
  shortUrl: string;
  @Prop({
    type: Map,
    default: {},
  })
  next: Map<string, string>;
}
export const UrlSchema = SchemaFactory.createForClass(Url);
