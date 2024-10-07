import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

@Injectable()
export class ChatqueryService {

    private readonly CODE_REVIEW_QUERY = `
        Preciso que seja feita uma avaliação de um Pull Request com base em 10 critérios, que vou pontuar abaixo.
        Cada critério deverá receber uma nota decimal de 0.0 até 10.0.

        Também deve ser gerada uma nota geral, que será realizada como uma média dos critérios.
        Cara critério possui um peso de 0.0 até 1.0, este peso sinalizará o quando aquele critério impacta na média.
        Importante: responda em português do Brasil.

        1. Funcionalidade (peso 1.0)
        - O Pull Request deve cumprir corretamente o que se propõe, sem criar novos erros no projeto.

        2. Legibilidade do Código (peso 0.6)
        - Variáveis, funções e classes devem ter nomes descritivos e significativos
        - O código deve ser bem estruturado e corretamente indentado
        - Devem existir comentários que expliquem partes complexas do código

        3. Clareza na Implementação (peso 0.4)
        - O código deve ser simples e direto, evitando complexidade desnecessária

        4. Complexidade (peso 0.3)
        - A complexidade das novas funções ou métodos deve ser baixa, facilitando futuras manutenções.

        5. Manutenibilidade (peso 0.6)
        - O código modificado deve ser fácil de entender e modificar
        - O código deve estar bem organizado em módulos, evitando dependências desnecessárias

        6. Escalabilidade (peso 0.4)
        - O código deve ser estruturado, de forma que novas funcionalidades possam ser adicionadas, sem grandes reescritas ou refatorações.

        7. Reutilização de Código (peso 0.6)
        - O PR deve reutilizar código existente onde apropriado ao invés de duplicar a lógica

        8. Consistência (peso 0.4)
        O código deve manter um estilo consistente com o restante do projeto

        9. Tamanho do Código (peso 0.3)
        - O tamanho das funções ou classes deve ser mantido em um limite razoável, evitando funções longas
        - O PR deve reduzir ou, no mínimo, não aumentar a duplicação de código

        10. Tratamento de Erros e Exceções (peso 0.5)
        - O código deve incluir práticas adequadas para tratar exceções e erros de forma que facilite a identificação e a resolução de problemas.]

        Preciso que o retorno seja um json válido e compactado, sem caracteres de escape, apenas isso, sem explicações, neste formato:

        {
            "overall_score": {nota geral do PR},
            "overall_description": "{texto com cerca de 1500 caracteres, avaliando o pull request}",
            "metrics": [{
                "code": "{código da métrica avaliada (funcionalidade|legibilidade|clareza|complexidade|manutenibilidade|escalabilidade|reutilizacao|consistencia|tamanho|tratamento_erros)}",
                "score": {nota da métrica},
                "description": "{texto com cerca de 300 caracteres, avaliando o cumprimento desta métrica no pull request}",
            }...]
        }

        Abaixo os dados do pull request
    `

    constructor(
        private httpService: HttpService
    ) {}

    async createCodeReviewQuery(
        pr_data: any,
        file_list: any[],
        query_files_content: boolean,
    ): Promise<string> {
        let query = this.CODE_REVIEW_QUERY
        query += this.getPRHeader(pr_data)
        query += await this.getPrFiles(file_list, query_files_content)

        return query
    }

    private getPRHeader(pr_data: any): string {
        return `

            Título:
            ${pr_data.title}

            Descrição:
            ${pr_data.body}
        `
    }

    private async getPrFiles(
        file_list: any[],
        query_files_content: boolean
    ): Promise<string> {

        let files = ''

        for (const file of file_list) {
            files += `
            
                Arquivo: ${file.filename}
                Modificações:
                    ${file.patch}
            `

            if (!query_files_content) {
                files += `
                    Conteúdo: [Conteúdo omitido por conta do tamanho]
                `
                continue
            }

            const file_contents = await firstValueFrom(
                this.httpService.get(file.raw_url, { responseType: 'arraybuffer' })
            )

            const file_data = Buffer.from(file_contents.data)
            const is_binary_file = this.isBinaryFile(file_data)

            if (is_binary_file) {
                files += `
                    Conteúdo: [Conteúdo binário não exibido]
                `
                continue
            }

            files += `
                Conteúdo:
                    ${file_data.toString('utf8')}
            `
        }

        return files
    }

    // https://chatgpt.com/share/67042040-0140-8008-9132-3ea55154368c
    private isBinaryFile(data: Buffer): boolean {
        const text_chat_limit = 32
        const non_text_chars = data.subarray(0, 1000).filter(byte => byte === 0 || byte > 127).length
    
        return non_text_chars > text_chat_limit
    }
}