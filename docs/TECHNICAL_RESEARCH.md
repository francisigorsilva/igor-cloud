# Technical Research · Igor Cloud

[English](#english) · [Português](#português)

> **Research snapshot:** 2026-11-20  
> **Status:** exploratory comparison. No provider, database, authentication system or storage service is selected or approved by this document. Pricing and free-tier limits are snapshots from official vendor pages and can change.

This document supports future architecture decisions. It is not an implementation plan, a cost forecast, a security audit or a commitment to any vendor.

## English

### 1. Context and evaluation principles

Igor Cloud is currently a documentation-and-planning project. Next.js is the intended application framework and Cloudflare R2 is the initial object-storage direction, but neither integration has been implemented. The metadata database and authentication approach remain open.

The system is expected to manage private user files. Therefore, the database should store metadata and ownership relationships, while file bytes should live in object storage. Authentication identifies a user; authorization must separately verify whether that user may perform each operation on a file.

Evaluation principles:

- Prefer a clear separation between metadata and binary file content.
- Keep authorization checks on the server and deny access by default.
- Preserve the ability to export metadata and migrate file objects.
- Compare total operating cost, not just the advertised free tier.
- Check backup, restore, inactivity, quotas, egress and overage behavior.
- Avoid committing to a service before a small proof of concept validates integration and operational limits.

### 2. Metadata database candidates

| Option | Strengths | Trade-offs and risks | Fit to investigate |
|---|---|---|---|
| **Neon (managed PostgreSQL)** | Standard PostgreSQL; relational constraints and transactions; separate managed database service; free tier currently advertises 1 GB per project and 100 compute-hours per project/month. | Compute quotas and scale-to-zero behavior need testing; database hosting is separate from auth and object storage; backups and retention depend on plan. | Strong candidate when portability and relational integrity are priorities. |
| **Supabase Database (PostgreSQL)** | Managed PostgreSQL plus a broader platform; integrated Auth, Storage, APIs and Row Level Security; free tier currently advertises 500 MB database per project. | Free projects can pause after one week of inactivity; free plan does not include automatic backups; adopting multiple Supabase services increases platform coupling. | Strong candidate if reducing integration work is more important than keeping each service independent. |
| **Cloudflare D1 (SQLite)** | Serverless SQL database integrated with Workers; simple operational model within Cloudflare; free limit currently lists 500 MB per database and 5 GB total account storage. | SQLite rather than PostgreSQL; Cloudflare-specific execution model; free and paid limits differ; validate query patterns, migrations, concurrency and future portability. | Worth testing if the application is intentionally Cloudflare-centric. |
| **Turso (libSQL)** | SQLite-compatible distributed database; free plan currently advertises up to 100 databases and 5 GB storage; lightweight model. | Different operational and compatibility profile from PostgreSQL; verify ORM/driver support, consistency needs, backups and migration path. | Worth testing for a lightweight SQLite-oriented architecture. |

**Preliminary assessment:** PostgreSQL is the conservative relational baseline to compare first. Neon and Supabase are two ways to obtain managed PostgreSQL, but their platform trade-offs differ. D1 and Turso should remain in the comparison if Cloudflare-native deployment or SQLite simplicity becomes a priority. This is a research priority, not a final selection.

Official references:
- Neon plans and quotas: https://neon.com/docs/introduction/plans
- Neon free-plan limits: https://neon.com/docs/introduction/free-tier
- Supabase pricing: https://supabase.com/pricing
- Supabase billing and quotas: https://supabase.com/docs/guides/platform/billing-on-supabase
- Cloudflare D1 limits: https://developers.cloudflare.com/d1/platform/limits/
- Cloudflare D1 pricing: https://developers.cloudflare.com/d1/platform/pricing/
- Turso pricing: https://turso.tech/pricing

### 3. Authentication candidates

| Option | Strengths | Trade-offs and risks | Fit to investigate |
|---|---|---|---|
| **Better Auth** | TypeScript authentication framework; application logic remains in the codebase; database adapters; plugins for passkeys, two-factor authentication, organizations and API keys. | The project owns integration, configuration, email delivery and operational responsibilities; database migrations and session handling require careful implementation. | Strong candidate when code-level control and provider flexibility matter. |
| **Auth.js** | Open-source JavaScript authentication library; supports OAuth, email links, credentials and WebAuthn; adapters for several databases and frameworks including Next.js. | More assembly may be needed for a complete account-management experience; adapter and session strategy choices require attention. | Candidate for a modular Next.js application with custom UX. |
| **Supabase Auth** | Integrated with Supabase PostgreSQL, Row Level Security, Storage and APIs; supports password, magic link, social login and MFA options. | Stronger coupling to Supabase conventions; moving identity and authorization policies elsewhere may require migration work. | Strong candidate if the database and other backend services are also Supabase. |
| **Clerk** | Managed authentication with prebuilt sign-in, sign-up and profile UI; free Hobby plan currently advertises up to 50,000 monthly retained users per application. | Hosted identity dependency; advanced features and branding removal may require paid plans; account and user data migration should be planned. | Candidate if speed of delivery and polished managed UI outweigh provider independence. |

Important distinction: authentication is not file authorization. Regardless of provider, Igor Cloud must check ownership and permissions on the server for every upload, download, listing, rename, share or delete operation. A signed URL must be short-lived and issued only after authorization.

Official references:
- Better Auth overview: https://better-auth.com/docs/introduction
- Better Auth database adapters: https://better-auth.com/docs/concepts/database
- Better Auth with Next.js: https://better-auth.com/docs/integrations/next
- Auth.js documentation: https://authjs.dev/getting-started
- Supabase Auth: https://supabase.com/docs/guides/auth
- Clerk pricing: https://clerk.com/pricing

### 4. Object storage candidates

| Option | Strengths | Trade-offs and risks | Fit to investigate |
|---|---|---|---|
| **Cloudflare R2** | S3-compatible object storage; no egress charge to the public internet; free Standard tier currently lists 10 GB-month, 1 million Class A and 10 million Class B operations per month. | Storage and request charges apply beyond included usage; credentials, CORS, lifecycle, signed URLs and upload flow still need implementation; Cloudflare account dependency. | Current planned direction; retain as the leading candidate for a proof of concept. |
| **Supabase Storage** | Integrated with Supabase Auth and Row Level Security; convenient unified platform; free tier currently lists 1 GB file storage and 5 GB egress. | Storage and egress limits; platform coupling; may be less attractive if the database/auth stack is not Supabase. | Candidate if choosing Supabase as the integrated backend. |
| **Backblaze B2** | S3-compatible object storage; pricing page currently advertises a starting rate of US$6.95/TB/month and free egress up to 3× average monthly stored data. | Egress beyond the allowance is chargeable; confirm request pricing, regional details, lifecycle and integration behavior before estimating cost. | Alternative worth comparing for storage economics and S3 compatibility. |

Official references:
- Cloudflare R2 pricing: https://developers.cloudflare.com/r2/pricing/
- Cloudflare R2 S3 API compatibility: https://developers.cloudflare.com/r2/api/s3/
- Supabase Storage pricing: https://supabase.com/pricing
- Supabase Storage documentation: https://supabase.com/docs/guides/storage
- Backblaze B2 pricing: https://www.backblaze.com/cloud-storage/pricing
- Backblaze S3-compatible API: https://www.backblaze.com/docs/cloud-storage-s3-compatible-api

### 5. Cross-cutting architecture concerns

These concerns apply regardless of the vendors selected:

1. **Metadata model:** define users, files, object keys, MIME type, byte size, checksum, timestamps, ownership, folder relationships and deletion state.
2. **Object identity:** use generated opaque object keys rather than trusting user-supplied filenames as storage paths.
3. **Authorization:** verify ownership and permission on the server for every operation. Do not rely on hidden UI controls.
4. **Upload flow:** compare server-mediated uploads with short-lived signed upload URLs. Validate size, content type and ownership before issuing access.
5. **Download flow:** authorize first, then stream the object or issue a short-lived signed download URL.
6. **Deletion:** define whether deletion is immediate or soft-delete first, and how metadata and object deletion remain consistent.
7. **Backups and recovery:** database backups do not automatically back up object contents. Define and test recovery for both layers.
8. **Secrets:** keep service credentials server-side, out of source control and out of client bundles.
9. **Abuse controls:** plan rate limits, quotas, file validation and protection against malicious or oversized uploads.
10. **Portability:** document export paths for relational metadata and object data; avoid depending on provider-specific features without recording the trade-off.

### 6. Suggested decision process (not approved)

Before accepting an architecture decision, run a small, disposable proof of concept and record evidence for:

- A user can sign in and sign out safely.
- A user can only list and access their own files.
- Upload and download work without exposing permanent storage credentials.
- Metadata and object content can be exported or migrated.
- Deletion and failure recovery behave predictably.
- The free-tier limits and likely paid costs are understood.
- The integration works with the selected Next.js deployment runtime.

Suggested evaluation dimensions (weights are intentionally not assigned):

- Security and authorization model.
- Portability and exit strategy.
- Integration effort with Next.js.
- Reliability, backup and restore.
- Free-tier suitability and predictable cost.
- Operational complexity.
- Documentation, ecosystem and maintainability.

No weighted score is published because the project owner has not approved priorities or weights.

### 7. Research conclusion

The most useful next comparison is a proof of concept between **managed PostgreSQL options (Neon and Supabase)**, followed by an authentication comparison between **Better Auth and Supabase Auth** if those database options remain finalists. Keep **Cloudflare R2** as the leading storage candidate while comparing it with Supabase Storage and Backblaze B2.

This sequence avoids prematurely choosing an all-in-one platform or splitting every service without evidence. It does not select a stack. The final choices must be recorded as separate accepted decisions in [DECISIONS.md](DECISIONS.md), after explicit review.

---

## Português

### 1. Contexto e princípios de avaliação

O Igor Cloud está atualmente na etapa de documentação e planejamento. Next.js é o framework pretendido para a aplicação e Cloudflare R2 é a direção inicial para armazenamento de objetos, mas nenhuma das duas integrações foi implementada. O banco de metadados e a estratégia de autenticação continuam em aberto.

O sistema deverá gerenciar arquivos privados. Portanto, o banco de dados deve guardar metadados e relações de propriedade, enquanto os bytes dos arquivos devem ficar no armazenamento de objetos. A autenticação identifica o usuário; a autorização precisa verificar separadamente se aquele usuário pode executar cada operação sobre determinado arquivo.

Princípios de avaliação:

- Preferir separação clara entre metadados e conteúdo binário.
- Manter as verificações de autorização no servidor e negar acesso por padrão.
- Preservar a possibilidade de exportar metadados e migrar os arquivos.
- Comparar o custo operacional total, não apenas o plano gratuito anunciado.
- Verificar backup, restauração, inatividade, cotas, transferência de dados e cobranças excedentes.
- Não assumir compromisso com um serviço antes de validar integração e limites operacionais em uma prova de conceito pequena.

### 2. Alternativas de banco de dados para metadados

| Opção | Pontos fortes | Limitações e riscos | O que vale investigar |
|---|---|---|---|
| **Neon (PostgreSQL gerenciado)** | PostgreSQL padrão; restrições relacionais e transações; banco gerenciado separado; plano gratuito atualmente anuncia 1 GB por projeto e 100 horas de computação por projeto/mês. | Cotas de computação e comportamento de escala a zero precisam ser testados; hospedagem separada de autenticação e arquivos; backup e retenção dependem do plano. | Forte candidato quando portabilidade e integridade relacional são prioridades. |
| **Supabase Database (PostgreSQL)** | PostgreSQL gerenciado com plataforma mais ampla; Auth, Storage, APIs e Row Level Security integrados; plano gratuito atualmente anuncia 500 MB de banco por projeto. | Projetos gratuitos podem ser pausados após uma semana de inatividade; o plano gratuito não inclui backups automáticos; adotar vários serviços Supabase aumenta a dependência da plataforma. | Forte candidato se reduzir o trabalho de integração for mais importante que manter cada serviço independente. |
| **Cloudflare D1 (SQLite)** | Banco SQL serverless integrado ao Workers; operação simples dentro da Cloudflare; limite gratuito atualmente lista 500 MB por banco e 5 GB de armazenamento total na conta. | Usa SQLite, não PostgreSQL; modelo de execução específico da Cloudflare; limites gratuitos e pagos são diferentes; validar consultas, migrações, concorrência e portabilidade futura. | Vale testar se a aplicação for deliberadamente centrada no ecossistema Cloudflare. |
| **Turso (libSQL)** | Banco distribuído compatível com SQLite; plano gratuito atualmente anuncia até 100 bancos e 5 GB de armazenamento; modelo leve. | Perfil operacional e de compatibilidade diferente do PostgreSQL; verificar suporte de ORM/driver, consistência, backups e caminho de migração. | Vale testar para uma arquitetura leve orientada a SQLite. |

**Avaliação preliminar:** PostgreSQL é a base relacional conservadora a ser comparada primeiro. Neon e Supabase oferecem PostgreSQL gerenciado, mas com compromissos diferentes de plataforma. D1 e Turso devem continuar na comparação caso implantação nativa na Cloudflare ou simplicidade do SQLite se tornem prioridades. Isso é uma prioridade de pesquisa, não uma escolha final.

Referências oficiais:
- Planos e cotas Neon: https://neon.com/docs/introduction/plans
- Limites do plano gratuito Neon: https://neon.com/docs/introduction/free-tier
- Preços Supabase: https://supabase.com/pricing
- Cobrança e cotas Supabase: https://supabase.com/docs/guides/platform/billing-on-supabase
- Limites Cloudflare D1: https://developers.cloudflare.com/d1/platform/limits/
- Preços Cloudflare D1: https://developers.cloudflare.com/d1/platform/pricing/
- Preços Turso: https://turso.tech/pricing

### 3. Alternativas de autenticação

| Opção | Pontos fortes | Limitações e riscos | O que vale investigar |
|---|---|---|---|
| **Better Auth** | Framework de autenticação TypeScript; lógica permanece no código da aplicação; adaptadores de banco; plugins para passkeys, autenticação em dois fatores, organizações e chaves de API. | O projeto assume integração, configuração, envio de e-mails e responsabilidades operacionais; migrações, sessões e segurança exigem implementação cuidadosa. | Forte candidato quando controle no código e flexibilidade de provedores são importantes. |
| **Auth.js** | Biblioteca de autenticação JavaScript de código aberto; oferece OAuth, links por e-mail, credenciais e WebAuthn; adaptadores para diversos bancos e frameworks, incluindo Next.js. | Pode exigir mais montagem para oferecer uma experiência completa de gerenciamento de contas; escolhas de adaptador e sessão precisam de atenção. | Candidato para uma aplicação Next.js modular e com interface própria. |
| **Supabase Auth** | Integrado ao PostgreSQL, Row Level Security, Storage e APIs do Supabase; oferece senha, magic link, login social e opções de MFA. | Maior dependência das convenções do Supabase; migrar identidade e políticas de autorização para outro ambiente pode exigir trabalho. | Forte candidato se o banco e os demais serviços de backend também forem Supabase. |
| **Clerk** | Autenticação gerenciada com interfaces prontas de cadastro, login e perfil; plano gratuito Hobby atualmente anuncia até 50 mil usuários retidos mensalmente por aplicação. | Dependência de identidade hospedada por terceiro; recursos avançados e remoção da marca podem exigir plano pago; migração de contas e dados deve ser planejada. | Candidato se velocidade de entrega e interface gerenciada forem mais importantes que independência do fornecedor. |

Distinção importante: autenticação não é autorização de arquivos. Independentemente do provedor, o Igor Cloud deverá verificar no servidor a propriedade e as permissões em cada operação de envio, download, listagem, compartilhamento, renomeação ou exclusão. Uma URL assinada deve ter validade curta e só pode ser emitida depois da autorização.

Referências oficiais:
- Visão geral Better Auth: https://better-auth.com/docs/introduction
- Adaptadores de banco Better Auth: https://better-auth.com/docs/concepts/database
- Better Auth com Next.js: https://better-auth.com/docs/integrations/next
- Documentação Auth.js: https://authjs.dev/getting-started
- Supabase Auth: https://supabase.com/docs/guides/auth
- Preços Clerk: https://clerk.com/pricing

### 4. Alternativas de armazenamento de objetos

| Opção | Pontos fortes | Limitações e riscos | O que vale investigar |
|---|---|---|---|
| **Cloudflare R2** | Armazenamento de objetos compatível com S3; sem cobrança de transferência de saída para a internet pública; plano Standard gratuito atualmente lista 10 GB-mês, 1 milhão de operações Classe A e 10 milhões Classe B por mês. | Há cobranças de armazenamento e requisições acima das cotas; credenciais, CORS, ciclo de vida, URLs assinadas e fluxo de envio ainda precisam ser implementados; dependência da conta Cloudflare. | Direção planejada atualmente; manter como principal candidato para uma prova de conceito. |
| **Supabase Storage** | Integrado ao Supabase Auth e Row Level Security; plataforma unificada conveniente; plano gratuito atualmente lista 1 GB de armazenamento de arquivos e 5 GB de transferência de saída. | Limites de armazenamento e transferência; dependência da plataforma; pode ser menos atraente se banco e autenticação não forem Supabase. | Candidato se a escolha for por um backend integrado Supabase. |
| **Backblaze B2** | Armazenamento compatível com S3; página de preços anuncia atualmente tarifa inicial de US$ 6,95/TB/mês e transferência gratuita de saída de até 3 vezes a média mensal armazenada. | Transferência além da franquia é cobrada; confirmar preço das requisições, detalhes regionais, ciclo de vida e comportamento de integração antes de estimar custos. | Alternativa que merece comparação por economia de armazenamento e compatibilidade S3. |

Referências oficiais:
- Preços Cloudflare R2: https://developers.cloudflare.com/r2/pricing/
- Compatibilidade da API S3 no Cloudflare R2: https://developers.cloudflare.com/r2/api/s3/
- Preços Supabase Storage: https://supabase.com/pricing
- Documentação Supabase Storage: https://supabase.com/docs/guides/storage
- Preços Backblaze B2: https://www.backblaze.com/cloud-storage/pricing
- API compatível com S3 do Backblaze: https://www.backblaze.com/docs/cloud-storage-s3-compatible-api

### 5. Questões arquiteturais que atravessam todas as escolhas

Estas preocupações se aplicam independentemente dos fornecedores escolhidos:

1. **Modelo de metadados:** definir usuários, arquivos, chaves de objetos, MIME type, tamanho em bytes, checksum, datas, propriedade, relação com pastas e estado de exclusão.
2. **Identidade do objeto:** usar chaves opacas geradas pelo sistema em vez de confiar em nomes enviados pelo usuário como caminhos de armazenamento.
3. **Autorização:** verificar propriedade e permissão no servidor em todas as operações. Não depender de controles ocultos na interface.
4. **Fluxo de envio:** comparar upload mediado pelo servidor com URLs assinadas de envio e validade curta. Validar tamanho, tipo de conteúdo e propriedade antes de conceder acesso.
5. **Fluxo de download:** autorizar primeiro; depois transmitir o objeto ou emitir uma URL assinada de download com validade curta.
6. **Exclusão:** definir se a exclusão será imediata ou se haverá exclusão lógica primeiro, e como manter consistência entre metadados e objeto.
7. **Backup e recuperação:** backups do banco não fazem backup automático dos arquivos. Definir e testar a recuperação das duas camadas.
8. **Segredos:** manter credenciais de serviço no servidor, fora do controle de versão e fora dos pacotes enviados ao cliente.
9. **Proteção contra abuso:** planejar limites de requisições, cotas, validação de arquivos e proteção contra uploads maliciosos ou excessivamente grandes.
10. **Portabilidade:** documentar caminhos de exportação dos metadados relacionais e dos objetos; evitar dependência de recursos específicos sem registrar a consequência.

### 6. Processo sugerido de decisão (não aprovado)

Antes de aceitar uma decisão arquitetural, executar uma prova de conceito pequena e descartável e registrar evidências de que:

- Um usuário consegue entrar e sair com segurança.
- Um usuário só consegue listar e acessar os próprios arquivos.
- O envio e o download funcionam sem expor credenciais permanentes de armazenamento.
- Metadados e conteúdo dos objetos podem ser exportados ou migrados.
- Exclusão e recuperação após falhas funcionam de maneira previsível.
- Os limites gratuitos e os custos pagos prováveis são conhecidos.
- A integração funciona com o ambiente de implantação escolhido para Next.js.

Dimensões sugeridas para avaliação (os pesos ainda não foram definidos):

- Segurança e modelo de autorização.
- Portabilidade e estratégia de saída.
- Esforço de integração com Next.js.
- Confiabilidade, backup e restauração.
- Adequação do plano gratuito e previsibilidade de custos.
- Complexidade operacional.
- Documentação, ecossistema e manutenibilidade.

Nenhuma pontuação ponderada foi publicada porque o responsável pelo projeto ainda não aprovou prioridades ou pesos.

### 7. Conclusão da pesquisa

A comparação seguinte mais útil é uma prova de conceito entre **opções de PostgreSQL gerenciado (Neon e Supabase)**, seguida de uma comparação de autenticação entre **Better Auth e Supabase Auth**, caso essas opções de banco continuem entre as finalistas. Manter **Cloudflare R2** como principal candidato a armazenamento enquanto é comparado com Supabase Storage e Backblaze B2.

Essa sequência evita escolher prematuramente uma plataforma completa ou separar todos os serviços sem evidências. Ela não seleciona uma stack. As escolhas finais deverão ser registradas como decisões aceitas separadas em [DECISIONS.md](DECISIONS.md), após revisão explícita.

---

## Research limitations · Limitações da pesquisa

This is a desk-research comparison based on official vendor documentation and pricing pages checked on 2026-11-20. Quotas, features, prices, availability and terms can change. No benchmarks, proof-of-concept tests, legal review, security audit or workload-based cost estimate have been performed.

Esta é uma comparação documental baseada em páginas oficiais de documentação e preços consultadas em 20/11/2026. Cotas, funcionalidades, preços, disponibilidade e condições podem mudar. Não foram realizados benchmarks, testes de prova de conceito, análise jurídica, auditoria de segurança ou estimativa de custos baseada em carga real.
