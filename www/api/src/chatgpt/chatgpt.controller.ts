import { Controller, Get, HttpException, HttpStatus, Inject, Param } from "@nestjs/common";
import { GithubService } from "src/github/github.service";
import { ChatgptService } from "./chatgpt.service";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@Controller('/chatgpt')
export class ChatGptController {

    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,

        private chatgptService: ChatgptService,
        private githubService: GithubService,
    ) {}

    @Get('/code-review/user/:user/repo/:repo/pr/:pr')
    async pullRequestReview(
        @Param('user') username: string,
        @Param('repo') repository: string,
        @Param('pr') pr_number: string,
    ) {
        let res = {}

        try {
            const cache_key = `code_review_${username}_${repository}_${pr_number}`
            let review_data = await this.cacheManager.get(cache_key)

            if (!review_data) {
                const pr_data = await this.githubService.getPullRequestData(
                    username, repository, pr_number
                )
    
                const file_list = await this.githubService.getPullRequestFiles(
                    username, repository, pr_number
                )
    
                review_data = await this.chatgptService.getPullRequestReview(
                    pr_data, file_list
                )

                await this.cacheManager.set(cache_key, review_data)
            }

            res['data'] = review_data
            res['status'] = HttpStatus.OK
            res['message'] = 'Code reviewed successfully'

            return res

        } catch (_e) {
            throw new HttpException(
                'Error while trying to review the code',
                HttpStatus.BAD_REQUEST
            )
        }
    }
}