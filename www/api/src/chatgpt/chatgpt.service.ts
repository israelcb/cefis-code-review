import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ChatqueryService } from "./chatquery.service";
import { firstValueFrom } from "rxjs";

@Injectable()
export class ChatgptService {

    constructor(
        private httpService: HttpService,
        private configService: ConfigService,
        private chatqueryService: ChatqueryService,
    ) {}

    async getPullRequestReview(
        pr_data: any,
        file_list: any[],
        query_files_content: boolean = true
    ) {
        const baseUrl = this.configService.get<string>('OPENAI_API_URL')
        const apiKey = this.configService.get<string>('OPENAI_API_KEY')
        const apiModel = this.configService.get<string>('OPENAI_API_MODEL')

        const query = await this.chatqueryService.createCodeReviewQuery(
            pr_data, file_list, query_files_content
        )

        try {
            const response = await firstValueFrom(
                this.httpService.post(baseUrl + '/v1/chat/completions', {
                    model: apiModel,
                    messages: [{
                        role: 'user',
                        'content': query,
                    }],
                    temperature: 0.7,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + apiKey,
                    }
                })
            )
    
            const response_string = response.data.choices[0].message.content
            const response_json = response_string.match(/^.*?(\{.*\}).*$/m)[0]
            
            return JSON.parse(response_json)

        } catch (error) {

            if (query_files_content) {
                return this.getPullRequestReview(pr_data, file_list, false)
            }

            throw error
        }
    }
}