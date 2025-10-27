import {  Injectable ,} from '@nestjs/common';
import { Url } from './url.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { start_node } from 'const';

@Injectable()
export class UrlService {
    constructor(@InjectModel(Url.name) private urlModel: Model<Url>){

    }
    private generateNewUrl():string{
        const values:string="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let shortUrl:string="";
        for(let i=0;i<6;i++){
            shortUrl+=values.charAt(Math.floor(Math.random()*values.length));
        }
        return shortUrl;
    }
    private async insertUrlAndCheck(url:string,LongUrl:string):Promise<boolean>{
        let curr:string=start_node;
        for(let i=0;i<6;i++){
            const char=url[i];
            let node=await this.urlModel.findOne({_id:curr})
            if(node){
                if(node.next.get(char)){
                    curr=node.next.get(char)||"";
                }
                else{
                    const newNode=await this.urlModel.create({});
                    curr=newNode._id.toHexString();
                    node.next.set(char,curr);
                    await node.save();
                }
            }
        }
        let node =await this.urlModel.findOne({_id:curr});
        if(node){
            if(node.url){
                console.log('already created this url');
                return false;
            }
            else{
                node.url=LongUrl;
                node.shortUrl=url;
                await node.save();
            }
        }
        return true;
    }
    private async find(shortUrl:string):Promise<string>{
        let curr:string=start_node;
        for(let i=0;i<6;i++){
            const char=shortUrl[i];
            let node=await this.urlModel.findOne({_id:curr})
            if(node){
                if(node.next.get(char)){
                    curr=node.next.get(char)||"";
                }
                else{
                    return "";
                }
            }
        }
        let node =await this.urlModel.findOne({_id:curr});
        if(node){
            if(node.url){
                return node.url;
            }
            else{
                return "";
            }
        }
        return "";
    }
    async createUrl(url:string):Promise<string>{
        const x=await this.urlModel.findOne({_id:start_node})
        let shortUrl:string="";
        for(var i=0;i<20;i++){
            shortUrl= this.generateNewUrl();
            if(await this.insertUrlAndCheck(shortUrl,url))break;
        }
        if(i==20)console.log("to many request try again");
        return shortUrl;
    }
    async getUrl(shortUrl:string){
        return this.find(shortUrl);
    }
}
