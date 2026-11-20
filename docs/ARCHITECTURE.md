# Architecture Notes · Igor Cloud

[English](#english) · [Português](#português)

> Status: initial design direction. This document describes intentions and open decisions, not an implemented architecture.

## English

### 1. Design Goal

Create a personal cloud file storage application with a clear separation between application logic, file metadata and binary object storage.

### 2. Conceptual Components

| Component | Responsibility | Status |
|---|---|---|
| Web application | User interface and application workflows | Planned |
| Server-side application layer | Validate requests and enforce authorization | Planned |
| Metadata persistence | Store file records, ownership and object keys | To be selected |
| Object storage | Store file contents; Cloudflare R2 is the current candidate | Planned |
| Authentication | Establish user identity and sessions | To be selected |
| Observability | Record operational events and failures without leaking secrets | Planned |

### 3. Expected File Lifecycle

1. An authenticated user requests an upload.
2. The server validates the request, file metadata, limits and authorization.
3. The application coordinates storage of the object.
4. The application persists metadata only after the storage operation succeeds, with compensating cleanup considered for partial failures.
5. A later download request is authorized by the server before access to the object is granted.

This is a target workflow. No part of this lifecycle is currently implemented.

### 4. Security Considerations

- Keep storage credentials on trusted server-side infrastructure.
- Do not trust client-provided file names, MIME types, sizes or ownership claims.
- Generate or validate object keys on the server.
- Enforce authorization for listing, reading, uploading and deleting files.
- Prefer short-lived, narrowly scoped access mechanisms if direct object transfer is adopted.
- Define upload limits and a policy for potentially dangerous file types.
- Avoid logging secrets, tokens or file contents.
- Plan backup, deletion and recovery behavior before production use.

### 5. Open Technical Decisions

- Which database should store file metadata?
- Which authentication/session approach is appropriate?
- Should uploads pass through the application server or use short-lived signed URLs?
- How should quotas, maximum file sizes and allowed types work?
- What retention, deletion and backup policies are required?
- What deployment environment and monitoring approach will be used?

These decisions should be recorded here when evaluated and resolved.

### 6. Suggested Implementation Sequence

1. Create the application scaffold and configuration conventions.
2. Add health checks, structured logging and basic automated tests.
3. Define the metadata model and persistence layer.
4. Implement authentication and authorization.
5. Integrate object storage behind a server-side abstraction.
6. Implement upload, download, listing and deletion workflows.
7. Add validation, quotas, error handling and recovery for partial failures.
8. Document deployment, backups and operational procedures.

## Português

### 1. Objetivo do Projeto

Criar uma aplicação pessoal de armazenamento em nuvem com separação clara entre a lógica da aplicação, os metadados dos arquivos e o armazenamento dos objetos binários.

### 2. Componentes Conceituais

| Componente | Responsabilidade | Situação |
|---|---|---|
| Aplicação web | Interface e fluxos de uso | Planejado |
| Camada de aplicação no servidor | Validar requisições e aplicar autorização | Planejado |
| Persistência de metadados | Guardar registros, propriedade e chaves dos objetos | A definir |
| Armazenamento de objetos | Guardar o conteúdo; Cloudflare R2 é a opção atual | Planejado |
| Autenticação | Estabelecer identidade e sessões | A definir |
| Observabilidade | Registrar eventos e falhas sem expor segredos | Planejado |

### 3. Ciclo Esperado de um Arquivo

1. Um usuário autenticado solicita o envio de um arquivo.
2. O servidor valida a requisição, os metadados, os limites e a autorização.
3. A aplicação coordena o armazenamento do objeto.
4. A aplicação persiste os metadados somente após o armazenamento ser concluído, considerando uma limpeza compensatória em caso de falha parcial.
5. Uma solicitação posterior de download passa pela autorização do servidor antes de liberar o acesso ao objeto.

Este é um fluxo pretendido. Nenhuma etapa desse ciclo está implementada atualmente.

### 4. Considerações de Segurança

- Manter as credenciais de armazenamento em infraestrutura confiável no servidor.
- Não confiar nos nomes, tipos MIME, tamanhos ou declarações de propriedade enviados pelo cliente.
- Gerar ou validar as chaves dos objetos no servidor.
- Aplicar autorização para listar, ler, enviar e excluir arquivos.
- Preferir mecanismos de acesso temporário e restrito caso seja adotada transferência direta de objetos.
- Definir limites de envio e política para tipos de arquivo potencialmente perigosos.
- Não registrar segredos, tokens ou conteúdo dos arquivos nos logs.
- Planejar backup, exclusão e recuperação antes do uso em produção.

### 5. Decisões Técnicas Pendentes

- Qual banco de dados armazenará os metadados?
- Qual abordagem de autenticação e sessão será adequada?
- Os envios passarão pelo servidor da aplicação ou usarão URLs assinadas de curta duração?
- Como funcionarão cotas, tamanho máximo e tipos permitidos?
- Quais políticas de retenção, exclusão e backup serão necessárias?
- Qual ambiente de implantação e estratégia de monitoramento serão utilizados?

As decisões deverão ser registradas aqui quando forem avaliadas e resolvidas.

### 6. Sequência Sugerida de Implementação

1. Criar a estrutura da aplicação e convenções de configuração.
2. Adicionar verificações de saúde, logs estruturados e testes básicos.
3. Definir o modelo de metadados e a camada de persistência.
4. Implementar autenticação e autorização.
5. Integrar o armazenamento de objetos por meio de uma abstração no servidor.
6. Implementar envio, download, listagem e exclusão.
7. Adicionar validações, cotas, tratamento de erros e recuperação de falhas parciais.
8. Documentar implantação, backups e procedimentos operacionais.
