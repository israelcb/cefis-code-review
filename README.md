Validador de códigos automático, construído com NextJS (front-end) + NestJS (back-end).

### Requisitos (Desenvolvimento)
- Docker e Docker Compose, instalados e configurados corretamente.
- Disponibilidade das portas 3000 (front), 3042 (api), e 6379 (Redis cache).

### Instalação (Desenvolvimento)
- Clone este repositório, ou realize o download em uma localidade de sua preferência.
- Abra o arquivo `/www/api/.env.example` em um editor de texto.
- Informe as chaves de acesso do GitHub e OpenAI nas chaves `GITHUB_API_KEY` e `OPENAI_API_KEY` respectivamente, e renomeie o arquivo para `/www/api/.env`.
- Pelo terminal, acesse o caminho `/www`, e execute o comando `docker-compose up`, para inicialização das imagens e containers.
- Ao final da inicialização, a aplicação estará disponível em http://localhost:3000.

### Como funciona?
Por meio desta aplicação, é possível acessar qualquer pull request em aberto, de qualquer repositório público no Github.

Com o pull request selecionado, a aplicação fará uma avaliação do código via OpenAI API, passando os arquivos originais, as modificações, e solicitando os seguintes critérios:

#### 1. Funcionalidade (peso 1.0)
- O Pull Request deve cumprir corretamente o que se propõe, sem criar novos erros no projeto.

#### 2. Legibilidade do Código (peso 0.6)
- Variáveis, funções e classes devem ter nomes descritivos e significativos
- O código deve ser bem estruturado e corretamente indentado
- Devem existir comentários que expliquem partes complexas do código

#### 3. Clareza na Implementação (peso 0.4)
- O código deve ser simples e direto, evitando complexidade desnecessária

#### 4. Complexidade (peso 0.3)
- A complexidade das novas funções ou métodos deve ser baixa, facilitando futuras manutenções.

#### 5. Manutenibilidade (peso 0.6)
- O código modificado deve ser fácil de entender e modificar
- O código deve estar bem organizado em módulos, evitando dependências desnecessárias

#### 6. Escalabilidade (peso 0.4)
- O código deve ser estruturado, de forma que novas funcionalidades possam ser adicionadas, sem grandes reescritas ou refatorações.

#### 7. Reutilização de Código (peso 0.6)
- O PR deve reutilizar código existente onde apropriado ao invés de duplicar a lógica

#### 8. Consistência (peso 0.4)
O código deve manter um estilo consistente com o restante do projeto

#### 9. Tamanho do Código (peso 0.3)
- O tamanho das funções ou classes deve ser mantido em um limite razoável, evitando funções longas
- O PR deve reduzir ou, no mínimo, não aumentar a duplicação de código

#### 10. Tratamento de Erros e Exceções (peso 0.5)
- O código deve incluir práticas adequadas para tratar exceções e erros de forma que facilite a identificação e a resolução de problemas.

Para cada critério, a API tratá uma descrição (cerca de 300 caracteres), e uma nota (de 0.00 a 10.00), metrificando o quanto o Pull Request sanou aquele critério em específico.
A API também irá retornar uma descrição geral (cerca de 1500 caracteres) e uma nota geral (de 0.00 a 10.00), influenciada por cada critério, de acordo com o seu peso.

Para poupar custos, as chamadas a API da OpenAI ficam armazenadas em cache por 1 semana.
