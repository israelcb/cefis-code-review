import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ChatGptController } from "./chatgpt.controller";
import { GithubService } from "src/github/github.service";
import { ChatgptService } from "./chatgpt.service";
import { ChatqueryService } from "./chatquery.service";

@Module({
    imports: [HttpModule],
    controllers: [ChatGptController],
    providers: [GithubService, ChatgptService, ChatqueryService],
})
export class ChatgptModule {}