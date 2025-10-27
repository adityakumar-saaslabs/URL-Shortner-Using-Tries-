import { Body, Controller, Get, Param, Post, Redirect } from '@nestjs/common';
import { UrlService } from './url.service';

@Controller('url')
export class UrlController {
  constructor(private urlService: UrlService) {}

  @Post('')
  async createUrl(@Body('url') url: string): Promise<string> {
    return this.urlService.createUrl(url);
  }
  @Get(':shortUrl')
  @Redirect('http://localhost:3000/', 302)
  async redirectToOrignalLink(@Param('shortUrl') shortUrl: string) {
    // let a = performance.now();
    const LongUrl = await this.urlService.getUrl(shortUrl);
    // console.log(performance.now() - a);   //~200 ms
    return { url: LongUrl, statusCode: 301 };
  }
}
