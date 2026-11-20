# Product Requirements · Igor Cloud

[English](#english) · [Português](#português)

> **Document status:** initial requirements proposal for review. These requirements are not implementation evidence and are not a substitute for explicit approval by the project owner.
>
> **Project stage:** documentation and planning. No application behavior described below should be considered implemented.

## English

### 1. Product intent

Igor Cloud is intended to be a personal cloud storage application where an authenticated owner can upload, organize, retrieve and delete private files through a web interface.

The first release should prioritize dependable private file handling over social features, collaboration or advanced media processing.

### 2. Users and trust boundaries

- **Owner:** the person who controls the account and stored files.
- **Application:** validates requests, manages metadata and enforces authorization.
- **Identity provider:** authenticates the owner and establishes a session.
- **Metadata database:** stores file records, ownership and organizational metadata.
- **Object storage:** stores file bytes independently from metadata.

The browser is an untrusted environment. File names, MIME types, sizes, object keys and ownership claims supplied by the client must be validated by the server.

### 3. Functional requirements

The identifiers below are stable references for discussion. Their status is **Proposed** until reviewed and accepted.

| ID | Requirement | Priority | Status |
|---|---|---|---|
| FR-001 | The owner can securely sign in and sign out. | Must | Proposed |
| FR-002 | The owner can view only files they are authorized to access. | Must | Proposed |
| FR-003 | The owner can upload a file within configured size and type limits. | Must | Proposed |
| FR-004 | The owner can list their files and inspect basic metadata. | Must | Proposed |
| FR-005 | The owner can download an authorized file. | Must | Proposed |
| FR-006 | The owner can delete a file and its associated metadata consistently. | Must | Proposed |
| FR-007 | The owner can rename a file without changing its underlying object identity. | Should | Proposed |
| FR-008 | The owner can organize files into folders or equivalent logical groups. | Should | Proposed |
| FR-009 | The system records creation and update timestamps for file metadata. | Should | Proposed |
| FR-010 | The system reports understandable validation and operation errors without exposing secrets. | Must | Proposed |
| FR-011 | The owner can see storage usage and configured quota, if quota management is enabled. | Could | Proposed |
| FR-012 | The system can export or migrate metadata and object content through documented procedures. | Should | Proposed |

### 4. Non-functional requirements

| ID | Requirement | Verification direction | Status |
|---|---|---|---|
| NFR-001 | Private files must not be accessible without server-side authorization. | Test unauthenticated and cross-account requests. | Proposed |
| NFR-002 | Storage credentials and signing secrets must never be shipped to the browser. | Inspect client bundles and network traffic. | Proposed |
| NFR-003 | Uploads must enforce server-side size and content validation. | Test boundary sizes and spoofed content types. | Proposed |
| NFR-004 | Database and object-storage recovery procedures must be documented and tested before production. | Perform a restore exercise. | Proposed |
| NFR-005 | The application should use maintainable, documented interfaces between metadata and object storage. | Review module boundaries and tests. | Proposed |
| NFR-006 | Logs must avoid passwords, tokens, signed URLs and file contents. | Review structured log output. | Proposed |
| NFR-007 | Provider-specific dependencies should be isolated where practical. | Review adapters and export paths. | Proposed |
| NFR-008 | The application must communicate operation failures without falsely reporting success. | Exercise failure paths. | Proposed |

### 5. Initial MVP boundary

**Candidate MVP scope:**
- One owner account.
- Secure sign-in and sign-out.
- Private upload, listing, download and deletion.
- Basic metadata: display name, generated object key, content type, byte size, checksum and timestamps.
- Server-side authorization for every file operation.
- Configurable upload limits.
- Basic operational logs that do not expose secrets.
- Documented backup and recovery approach.

**Explicitly outside the initial MVP unless separately approved:**
- Public file sharing or anonymous links.
- Multi-user collaboration and team workspaces.
- Payments, subscriptions or billing.
- Automatic media conversion, preview generation or AI indexing.
- Native mobile applications and desktop synchronization.
- End-to-end encryption with user-managed keys.
- Complex version history and recycle-bin retention.

These exclusions are scope-control proposals, not permanent product restrictions.

### 6. Acceptance checklist for a future proof of concept

A proof of concept should not be considered successful until evidence demonstrates:

- [ ] Unauthenticated requests cannot access private file operations.
- [ ] A user cannot access another user's file by changing an identifier.
- [ ] Upload validation is performed on the server.
- [ ] Object storage credentials are not exposed to the client.
- [ ] Signed access, if used, is short-lived and narrowly scoped.
- [ ] Metadata and object content can be exported independently.
- [ ] A failed upload or deletion does not leave untracked orphaned data without a documented recovery path.
- [ ] Database and object recovery procedures have been exercised.
- [ ] Relevant free-tier limits, paid pricing and quota behavior have been reviewed.
- [ ] The selected deployment environment supports the chosen integrations.

### 7. Open questions

- Is the product strictly single-user for the foreseeable future?
- Should folder organization be included in the first usable release?
- What maximum file size and total storage quota are appropriate?
- Which file types should be accepted or blocked?
- Should deleted files be recoverable, and for how long?
- Is direct-to-object-storage upload required for the expected file sizes?
- What backup frequency and recovery-point objective are acceptable?
- Which deployment runtime will host the Next.js application?

These questions should be answered before implementation decisions depend on them.

## Português

### 1. Intenção do produto

O Igor Cloud pretende ser uma aplicação pessoal de armazenamento em nuvem na qual o proprietário autenticado possa enviar, organizar, recuperar e excluir arquivos privados por meio de uma interface web.

A primeira versão deve priorizar o tratamento confiável de arquivos privados, antes de recursos sociais, colaboração ou processamento avançado de mídia.

### 2. Usuários e limites de confiança

- **Proprietário:** pessoa que controla a conta e os arquivos armazenados.
- **Aplicação:** valida requisições, gerencia metadados e aplica autorização.
- **Provedor de identidade:** autentica o proprietário e estabelece uma sessão.
- **Banco de metadados:** guarda registros de arquivos, propriedade e informações de organização.
- **Armazenamento de objetos:** guarda os bytes dos arquivos independentemente dos metadados.

O navegador é um ambiente não confiável. Nomes, tipos MIME, tamanhos, chaves de objetos e declarações de propriedade enviados pelo cliente precisam ser validados no servidor.

### 3. Requisitos funcionais

Os identificadores abaixo são referências estáveis para discussão. A situação de todos é **Proposta** até que sejam revisados e aceitos.

| ID | Requisito | Prioridade | Situação |
|---|---|---|---|
| RF-001 | O proprietário consegue entrar e sair da conta com segurança. | Obrigatório | Proposta |
| RF-002 | O proprietário visualiza somente arquivos aos quais tem autorização. | Obrigatório | Proposta |
| RF-003 | O proprietário envia arquivos respeitando limites configurados de tamanho e tipo. | Obrigatório | Proposta |
| RF-004 | O proprietário lista seus arquivos e consulta metadados básicos. | Obrigatório | Proposta |
| RF-005 | O proprietário baixa arquivos autorizados. | Obrigatório | Proposta |
| RF-006 | O proprietário exclui um arquivo e seus metadados de maneira consistente. | Obrigatório | Proposta |
| RF-007 | O proprietário renomeia um arquivo sem alterar a identidade do objeto armazenado. | Desejável | Proposta |
| RF-008 | O proprietário organiza arquivos em pastas ou agrupamentos lógicos equivalentes. | Desejável | Proposta |
| RF-009 | O sistema registra datas de criação e atualização dos metadados. | Desejável | Proposta |
| RF-010 | O sistema apresenta erros compreensíveis sem expor segredos. | Obrigatório | Proposta |
| RF-011 | O proprietário consulta o uso de armazenamento e a cota configurada, se houver gerenciamento de cotas. | Opcional | Proposta |
| RF-012 | O sistema permite exportar ou migrar metadados e conteúdo por procedimentos documentados. | Desejável | Proposta |

### 4. Requisitos não funcionais

| ID | Requisito | Direção de verificação | Situação |
|---|---|---|---|
| RNF-001 | Arquivos privados não podem ser acessados sem autorização verificada no servidor. | Testar requisições sem autenticação e entre contas. | Proposta |
| RNF-002 | Credenciais de armazenamento e segredos de assinatura nunca podem ser enviados ao navegador. | Inspecionar pacotes do cliente e tráfego de rede. | Proposta |
| RNF-003 | Envios devem aplicar validação de tamanho e conteúdo no servidor. | Testar limites e tipos de conteúdo falsificados. | Proposta |
| RNF-004 | Procedimentos de recuperação do banco e do armazenamento devem ser documentados e testados antes da produção. | Executar um exercício de restauração. | Proposta |
| RNF-005 | A aplicação deve usar interfaces sustentáveis e documentadas entre metadados e armazenamento. | Revisar limites dos módulos e testes. | Proposta |
| RNF-006 | Logs não devem conter senhas, tokens, URLs assinadas ou conteúdo de arquivos. | Revisar a saída dos logs estruturados. | Proposta |
| RNF-007 | Dependências específicas de fornecedores devem ser isoladas quando for viável. | Revisar adaptadores e caminhos de exportação. | Proposta |
| RNF-008 | A aplicação deve comunicar falhas sem informar falsamente que uma operação foi concluída. | Exercitar caminhos de falha. | Proposta |

### 5. Limites iniciais do MVP

**Escopo candidato para o MVP:**
- Uma conta proprietária.
- Entrada e saída seguras.
- Envio, listagem, download e exclusão de arquivos privados.
- Metadados básicos: nome de exibição, chave de objeto gerada, tipo de conteúdo, tamanho em bytes, checksum e datas.
- Autorização no servidor em todas as operações com arquivos.
- Limites configuráveis de envio.
- Logs operacionais básicos sem exposição de segredos.
- Estratégia documentada de backup e recuperação.

**Explicitamente fora do MVP inicial, salvo aprovação separada:**
- Compartilhamento público de arquivos ou links anônimos.
- Colaboração multiusuário e espaços de equipe.
- Pagamentos, assinaturas ou cobrança.
- Conversão automática de mídia, geração de prévias ou indexação por IA.
- Aplicativos móveis nativos e sincronização desktop.
- Criptografia ponta a ponta com chaves gerenciadas pelo usuário.
- Histórico complexo de versões e retenção em lixeira.

Essas exclusões são propostas de controle de escopo, não restrições permanentes do produto.

### 6. Lista de aceitação para uma futura prova de conceito

Uma prova de conceito não deverá ser considerada bem-sucedida até que existam evidências de que:

- [ ] Requisições sem autenticação não acessam operações de arquivos privados.
- [ ] Um usuário não consegue acessar arquivos de outro usuário alterando um identificador.
- [ ] A validação de envio é realizada no servidor.
- [ ] Credenciais do armazenamento não são expostas ao cliente.
- [ ] Se forem usadas, URLs assinadas têm validade curta e escopo restrito.
- [ ] Metadados e conteúdo dos objetos podem ser exportados independentemente.
- [ ] Falhas de envio ou exclusão não deixam dados órfãos sem um procedimento de recuperação documentado.
- [ ] Procedimentos de recuperação do banco e dos objetos foram exercitados.
- [ ] Limites de planos gratuitos, preços pagos e comportamento das cotas foram revisados.
- [ ] O ambiente de implantação escolhido suporta as integrações selecionadas.

### 7. Questões em aberto

- O produto será estritamente de usuário único no futuro previsível?
- A organização por pastas deve entrar na primeira versão utilizável?
- Qual tamanho máximo de arquivo e cota total de armazenamento são adequados?
- Quais tipos de arquivo serão aceitos ou bloqueados?
- Arquivos excluídos poderão ser recuperados? Por quanto tempo?
- O envio direto ao armazenamento de objetos será necessário para os tamanhos esperados?
- Qual frequência de backup e objetivo de ponto de recuperação são aceitáveis?
- Qual ambiente de execução hospedará a aplicação Next.js?

Essas questões devem ser respondidas antes que decisões de implementação dependam delas.

---

## Document control · Controle do documento

This document is a proposed baseline. Requirement priorities and scope must be reviewed by the project owner before being treated as approved product commitments.

Este documento é uma base de requisitos proposta. Prioridades e escopo devem ser revisados pelo responsável pelo projeto antes de serem tratados como compromissos de produto aprovados.
