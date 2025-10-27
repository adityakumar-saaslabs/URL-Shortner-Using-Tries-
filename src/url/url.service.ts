import { Injectable } from '@nestjs/common';
import { Url } from './url.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { start_node } from 'const';

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private urlModel: Model<Url>) {}
  private generateNewUrl(): string {
    const values: string =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let shortUrl: string = '';
    for (let i = 0; i < 6; i++) {
      shortUrl += values.charAt(Math.floor(Math.random() * values.length)); // creating random string 
    }
    return shortUrl;
  }
  private async insertUrlAndCheck(
    url: string,
    LongUrl: string,
  ): Promise<boolean> {
    let curr: string = start_node; // root node id 
    for (let i = 0; i < 6; i++) {
      const char = url[i];
      let node = await this.urlModel.findOne({ _id: curr }); // find the next node based on short_url 
      if (node) {
        if (node.next.get(char)) {
          curr = node.next.get(char) || '';     //if node exist in trie move to this node 
        } else {
          const newNode = await this.urlModel.create({}); //if node does not exist in trie create and move to that node 
          curr = newNode._id.toHexString();
          node.next.set(char, curr);
          await node.save();              //save created pointer to next node in current node 
        }
      }
    }
    let node = await this.urlModel.findOne({ _id: curr });
    if (node) {
      if (node.url) {
        console.log('already created this url');  //this short_url is already used create again 
        return false;
      } else {
        node.url = LongUrl;       //insert long url into the leaf node of trie 
        node.shortUrl = url;
        await node.save();
      }
    }
    return true;
  }
  private async find(shortUrl: string): Promise<string> {
    let curr: string = start_node;
    for (let i = 0; i < 6; i++) {
      const char = shortUrl[i];
      let node = await this.urlModel.findOne({ _id: curr });
      if (node) {
        if (node.next.get(char)) {
          curr = node.next.get(char) || ''; //move to next node 
        } else {
          return '';       // short url does not exist 
        }
      }
    }
    let node = await this.urlModel.findOne({ _id: curr });
    if (node) {
      if (node.url) {
        return node.url;  //in leaf node long url exist
      } else {
        return '';       //in leaf node long url does not exist
      }
    }
    return '';
  }
  async createUrl(url: string): Promise<string> {
    const x = await this.urlModel.findOne({ _id: start_node });
    let shortUrl: string = '';
    for (var i = 0; i < 20; i++) {
      shortUrl = this.generateNewUrl();
      if (await this.insertUrlAndCheck(shortUrl, url)) break; //inserting and checking if this short_url is already created in trie
    }
    if (i == 20) console.log('to many request try again');
    return shortUrl;
  }
  async getUrl(shortUrl: string) {
    return this.find(shortUrl);
  }
}
