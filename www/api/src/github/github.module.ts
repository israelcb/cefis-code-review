import { Module } from "@nestjs/common";
import { GithubUserController } from "./github.controller";
import { GithubService } from "./github.service";
import { HttpModule, HttpService } from "@nestjs/axios";

@Module({
    imports: [HttpModule],
    controllers: [GithubUserController],
    providers: [GithubService],
})
export class GithubModule {}