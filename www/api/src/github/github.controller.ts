import { Controller, Get, HttpCode, HttpException, HttpStatus, Param } from "@nestjs/common";
import { GithubService } from "./github.service";

@Controller('/github')
export class GithubUserController {

    constructor(
        private githubService: GithubService,
    ) {}

    @Get('/repos/:username')
    async getReposByUsername(
        @Param('username') username: string
    ) {
        let res = {}

        try {
            const repos = await this.githubService.getUserRepos(
                username
            )

            res['data'] = repos.map(rep => ({
                id: rep.id,
                name: rep.name,
                full_name: rep.full_name,
                description: rep.description,
                language: rep.language,
                created_at: rep.created_at,
            }))
    
            res['status'] = HttpStatus.OK
            res['message'] = 'User repos successfully obtained'
            
            return res

        } catch (_e) {
            throw new HttpException(
                'Error while trying to obtain user repos',
                HttpStatus.BAD_REQUEST
            )
        }
    }

    @Get('/list-prs/user/:user/repo/:repo')
    async getPullRequests(
        @Param('user') username: string,
        @Param('repo') repository: string
    ) {
        let res = {}

        try {
            const pull_requests = await this.githubService.getPullRequests(
                username, repository
            )

            res['data'] = pull_requests.map(pr => ({
                id: pr.id,
                number: pr.number,
                title: pr.title,
                body: pr.body,
                author: {
                    id: pr.user.id,
                    login: pr.user.login,
                    avatar: pr.user.avatar_url,
                },
                created_at: pr.created_at,
            }))

            res['status'] = HttpStatus.OK
            res['message'] = 'Pull requests successfully obtained'

            return res
            
        } catch (_e) {
            throw new HttpException(
                'Error while trying to obtain user repos',
                HttpStatus.BAD_REQUEST
            )
        }
    }

    @Get('/list-pr-files/user/:user/repo/:repo/pr/:pr')
    async getPrFiles(
        @Param('user') username: string,
        @Param('repo') repository: string,
        @Param('pr') pr_number: string,
    ) {
        let res = {}

        try {
            const file_list = await this.githubService.getPullRequestFiles(
                username, repository, pr_number
            )

            res['data'] = file_list
            res['status'] = HttpStatus.OK
            res['message'] = 'Pull request files successfully obtained'
            
            return res

        } catch (_e) {
            throw new HttpException(
                'Error while trying to obtain the pull request files',
                HttpStatus.BAD_REQUEST
            )
        }
    }
}