import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";

@Injectable()
export class GithubService {

    constructor(
        private httpService: HttpService,
        private configService: ConfigService,
    ) {}

    async getUserRepos(username: string) {
        const path = `/users/${username}/repos`
        return this.request(path)
    }

    async getPullRequests(username: string, repository: string) {
        const path = `/repos/${username}/${repository}/pulls`
        return this.request(path)
    }

    async getPullRequestFiles(username: string, repository: string, pr_number: string) {
        const path = `/repos/${username}/${repository}/pulls/${pr_number}/files`
        return this.request(path)
    }

    async getPullRequestData(username: string, repository: string, pr_number: string) {
        const path = `/repos/${username}/${repository}/pulls/${pr_number}`
        return this.request(path)
    }

    private async request(path: string) {
        const baseUrl = this.configService.get<string>('GITHUB_API_URL')
        const token = this.configService.get<string>('GITHUB_API_KEY')

        const response = await firstValueFrom(
            this.httpService.get(baseUrl + path, {
                headers: { Authorization: 'token ' + token },
            })
        )

        return response.data
    }
}