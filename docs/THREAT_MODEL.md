# Threat Model · Igor Cloud

[English](#english) · [Português](#português)

> **Status:** preliminary design exercise. This is not a security audit, penetration test, or evidence that controls exist in an implementation.
>
> **Scope:** proposed personal cloud file-storage application. The repository currently contains planning and documentation, not a running storage service.

## English

### 1. Security objectives

- Preserve confidentiality of private files and metadata.
- Prevent unauthorized upload, download, listing, modification or deletion.
- Protect account sessions and service credentials.
- Preserve integrity between database metadata and stored objects.
- Support recovery after accidental deletion, provider failure or partial operations.
- Minimize sensitive information in logs and diagnostics.

### 2. Assets to protect

| Asset | Why it matters |
|---|---|
| User identity and session tokens | Account takeover enables access to private files. |
| File contents | May contain personal, confidential or valuable information. |
| File metadata | Names, ownership, object keys, sizes and timestamps reveal information and govern access. |
| Object-storage credentials | Can grant broad access to stored content. |
| Database credentials and signing secrets | Can expose metadata or enable forged access. |
| Backup copies | Often contain the same sensitive information as primary storage. |
| Operational logs | May accidentally retain tokens, signed URLs or personal data. |

### 3. Trust boundaries and data flow

1. **Browser → application server:** all client input is untrusted.
2. **Application server → identity provider:** identity and session claims must be verified.
3. **Application server → metadata database:** database access must use server-held credentials and constrained permissions.
4. **Application server → object storage:** storage credentials remain server-side; object keys are generated or validated by trusted logic.
5. **Browser → object storage (optional direct transfer):** only narrowly scoped, short-lived signed requests may cross this boundary, after server-side authorization.
6. **Production systems → backups and logs:** copies and diagnostics require access controls and retention rules.

### 4. Preliminary threat register

Risk ratings are provisional and must be revisited after a concrete architecture and deployment environment are selected.

| ID | Threat | Potential impact | Initial mitigation direction | Initial concern |
|---|---|---|---|---|
| T-001 | Broken object-level authorization / insecure direct object reference | One user reads or deletes another user's files. | Authorize every operation server-side using the authenticated owner and file record; test identifier substitution. | High |
| T-002 | Leaked storage credentials | Bulk read, overwrite or deletion of stored objects. | Keep secrets server-side; least-privilege credentials; rotate and monitor. | High |
| T-003 | Forged or replayed signed URLs | Unauthorized access during the URL validity window. | Short expiration, narrow method/object scope, no public listing, issue only after authorization. | High |
| T-004 | Malicious or oversized upload | Resource exhaustion, unsafe content handling or downstream parser exploitation. | Enforce size limits, validate content, generate object keys, rate-limit and isolate processing. | High |
| T-005 | Session theft or account takeover | Full access to the owner's files. | Secure cookies, appropriate session lifetime, CSRF protections where applicable, MFA/passkeys where supported, safe account recovery. | High |
| T-006 | Metadata/object inconsistency | Orphaned objects, broken downloads or accidental data loss. | Explicit upload/delete state transitions, idempotent operations, compensating cleanup and reconciliation jobs. | Medium |
| T-007 | Database exposure or injection | Metadata disclosure or modification. | Parameterized queries, server-only credentials, constrained database roles, input validation and access restrictions. | High |
| T-008 | Sensitive data in logs or error messages | Tokens, signed URLs, file names or private details leak to operators or log providers. | Structured redacted logging; never log file contents or secrets; restrict log access and retention. | Medium |
| T-009 | Backup compromise or failed recovery | Long-term disclosure or permanent loss of files. | Encrypt and restrict backups, define retention, test restoration of both metadata and object data. | High |
| T-010 | Dependency or supply-chain compromise | Malicious code gains application or storage access. | Pin and review dependencies, update regularly, inspect advisories and minimize runtime permissions. | Medium |
| T-011 | Cross-site scripting or unsafe file preview | Attacker-controlled content executes in the application origin. | Escape output, restrictive content security policy, safe download headers, isolate untrusted previews. | High |
| T-012 | Denial of service / quota abuse | Excessive storage, bandwidth or compute cost; service disruption. | Per-account quotas, request throttling, upload limits, monitoring and cost alerts. | Medium |

### 5. Security design requirements

Before production use, the implementation should demonstrate:

- Authorization checks on every file operation, not only on page navigation.
- No trust in client-provided ownership, object keys, MIME types or file sizes.
- Private object storage by default; no public bucket or unrestricted listing.
- Server-side validation and narrowly scoped storage permissions.
- Secure session handling and a reviewed account recovery process.
- Safe handling of untrusted file names and previews.
- Redaction of secrets and signed URLs from logs.
- Explicit consistency and recovery behavior for partial uploads/deletions.
- Tested restoration of database metadata and object contents.
- Monitoring for abnormal upload volume, access patterns and storage cost.

### 6. Security verification scenarios

A future test plan should include at least:

1. Request a file while signed out.
2. Change a file identifier to another user's identifier.
3. Reuse an expired signed URL.
4. Attempt to use an upload URL for a different object or HTTP method.
5. Upload a file larger than the configured limit.
6. Send a misleading filename and MIME type.
7. Attempt path traversal through a filename.
8. Simulate object upload success followed by metadata failure.
9. Simulate metadata deletion success followed by object deletion failure.
10. Inspect browser bundles and network requests for service credentials.
11. Verify logs do not contain passwords, tokens, signed URLs or file contents.
12. Restore a backup into an isolated environment and verify metadata/object consistency.

### 7. Residual risks and review

No design can eliminate all risk. Provider outages, compromised user devices, malicious insiders, legal requests, software vulnerabilities and accidental operator actions remain possible. The project must define acceptable recovery objectives, retention and incident response before production.

This threat model should be revised when the database, authentication provider, object storage, upload flow and deployment environment are selected. Each accepted architecture decision should reference the relevant threats and controls in [DECISIONS.md](DECISIONS.md).

## Português

### 1. Objetivos de segurança

- Preservar a confidencialidade dos arquivos privados e de seus metadados.
- Impedir envio, download, listagem, alteração ou exclusão sem autorização.
- Proteger sessões de conta e credenciais de serviços.
- Preservar a integridade entre os metadados no banco e os objetos armazenados.
- Permitir recuperação após exclusão acidental, falha de provedor ou operação parcial.
- Minimizar informações sensíveis em logs e diagnósticos.

### 2. Ativos que precisam de proteção

| Ativo | Por que importa |
|---|---|
| Identidade do usuário e tokens de sessão | O comprometimento da conta permite acesso aos arquivos privados. |
| Conteúdo dos arquivos | Pode conter informações pessoais, confidenciais ou valiosas. |
| Metadados dos arquivos | Nomes, propriedade, chaves, tamanhos e datas revelam informações e controlam acesso. |
| Credenciais do armazenamento | Podem conceder acesso amplo ao conteúdo armazenado. |
| Credenciais do banco e segredos de assinatura | Podem expor metadados ou permitir falsificação de acesso. |
| Cópias de backup | Frequentemente contêm as mesmas informações sensíveis do armazenamento principal. |
| Logs operacionais | Podem reter acidentalmente tokens, URLs assinadas ou dados pessoais. |

### 3. Limites de confiança e fluxo de dados

1. **Navegador → servidor da aplicação:** toda entrada do cliente é não confiável.
2. **Servidor da aplicação → provedor de identidade:** identidade e declarações de sessão precisam ser verificadas.
3. **Servidor da aplicação → banco de metadados:** o acesso ao banco deve usar credenciais mantidas no servidor e permissões restritas.
4. **Servidor da aplicação → armazenamento de objetos:** credenciais permanecem no servidor; chaves são geradas ou validadas por lógica confiável.
5. **Navegador → armazenamento de objetos (transferência direta opcional):** somente requisições assinadas, temporárias e de escopo restrito podem atravessar esse limite, após autorização no servidor.
6. **Sistemas de produção → backups e logs:** cópias e diagnósticos exigem controles de acesso e regras de retenção.

### 4. Registro preliminar de ameaças

As classificações de risco são provisórias e deverão ser revistas após a escolha de uma arquitetura concreta e do ambiente de implantação.

| ID | Ameaça | Impacto potencial | Direção inicial de mitigação | Preocupação inicial |
|---|---|---|---|---|
| T-001 | Falha de autorização por objeto / referência direta insegura | Um usuário lê ou exclui arquivos de outra pessoa. | Autorizar cada operação no servidor usando o proprietário autenticado e o registro do arquivo; testar troca de identificadores. | Alto |
| T-002 | Vazamento de credenciais do armazenamento | Leitura em massa, sobrescrita ou exclusão de objetos. | Manter segredos no servidor; credenciais de menor privilégio; rotação e monitoramento. | Alto |
| T-003 | Falsificação ou repetição de URLs assinadas | Acesso não autorizado durante a validade da URL. | Expiração curta, escopo restrito de método/objeto, sem listagem pública e emissão somente após autorização. | Alto |
| T-004 | Upload malicioso ou excessivamente grande | Esgotamento de recursos, tratamento inseguro ou exploração de processadores posteriores. | Limites de tamanho, validação de conteúdo, chaves geradas, limitação de requisições e isolamento de processamento. | Alto |
| T-005 | Roubo de sessão ou tomada de conta | Acesso completo aos arquivos do proprietário. | Cookies seguros, duração adequada de sessão, proteção CSRF quando aplicável, MFA/passkeys quando disponíveis e recuperação segura da conta. | Alto |
| T-006 | Inconsistência entre metadados e objetos | Objetos órfãos, downloads quebrados ou perda acidental de dados. | Transições explícitas de estado, operações idempotentes, limpeza compensatória e reconciliação. | Médio |
| T-007 | Exposição ou injeção no banco de dados | Divulgação ou alteração de metadados. | Consultas parametrizadas, credenciais apenas no servidor, papéis restritos, validação de entradas e restrições de acesso. | Alto |
| T-008 | Dados sensíveis em logs ou mensagens de erro | Tokens, URLs assinadas, nomes ou detalhes privados vazam para operadores ou provedores de logs. | Logs estruturados com redação; nunca registrar conteúdo ou segredos; restringir acesso e retenção. | Médio |
| T-009 | Comprometimento de backup ou falha de recuperação | Divulgação prolongada ou perda permanente de arquivos. | Criptografar e restringir backups, definir retenção e testar restauração de metadados e objetos. | Alto |
| T-010 | Comprometimento de dependência ou cadeia de suprimentos | Código malicioso obtém acesso à aplicação ou ao armazenamento. | Fixar e revisar dependências, atualizar regularmente, acompanhar alertas e minimizar permissões. | Médio |
| T-011 | Cross-site scripting ou prévia insegura de arquivos | Conteúdo controlado por atacante executa na origem da aplicação. | Escapar saídas, política de segurança de conteúdo restritiva, cabeçalhos seguros para download e isolamento de prévias não confiáveis. | Alto |
| T-012 | Negação de serviço / abuso de cotas | Excesso de armazenamento, transferência ou computação; aumento de custos e interrupção. | Cotas por conta, limitação de requisições, limites de envio, monitoramento e alertas de custo. | Médio |

### 5. Requisitos de projeto de segurança

Antes do uso em produção, a implementação deverá demonstrar:

- Verificações de autorização em todas as operações de arquivos, não apenas na navegação das páginas.
- Ausência de confiança em propriedade, chaves, MIME types ou tamanhos informados pelo cliente.
- Armazenamento privado por padrão; sem bucket público ou listagem irrestrita.
- Validação no servidor e permissões de armazenamento estritamente limitadas.
- Gerenciamento seguro de sessões e processo de recuperação de conta revisado.
- Tratamento seguro de nomes e prévias de arquivos não confiáveis.
- Remoção de segredos e URLs assinadas dos logs.
- Comportamento explícito de consistência e recuperação para envios/exclusões parciais.
- Restauração testada de metadados do banco e conteúdo dos objetos.
- Monitoramento de volume anormal de envios, padrões de acesso e custos de armazenamento.

### 6. Cenários de verificação de segurança

Um futuro plano de testes deverá incluir pelo menos:

1. Solicitar um arquivo sem estar autenticado.
2. Trocar o identificador de um arquivo pelo identificador de outro usuário.
3. Reutilizar uma URL assinada expirada.
4. Tentar usar uma URL de envio para outro objeto ou método HTTP.
5. Enviar um arquivo maior que o limite configurado.
6. Enviar nome de arquivo e MIME type enganosos.
7. Tentar traversal de diretório por meio do nome do arquivo.
8. Simular sucesso no upload do objeto seguido de falha nos metadados.
9. Simular exclusão dos metadados seguida de falha na exclusão do objeto.
10. Inspecionar pacotes do navegador e requisições de rede em busca de credenciais.
11. Verificar se logs não contêm senhas, tokens, URLs assinadas ou conteúdo.
12. Restaurar um backup em ambiente isolado e verificar a consistência entre metadados e objetos.

### 7. Riscos residuais e revisão

Nenhum projeto elimina todos os riscos. Indisponibilidade de provedores, dispositivos de usuários comprometidos, pessoas internas mal-intencionadas, solicitações legais, vulnerabilidades de software e ações operacionais acidentais continuam possíveis. Antes da produção, o projeto deverá definir objetivos aceitáveis de recuperação, retenção e resposta a incidentes.

Este modelo de ameaças deverá ser revisado quando forem escolhidos o banco de dados, provedor de autenticação, armazenamento de objetos, fluxo de envio e ambiente de implantação. Cada decisão arquitetural aceita deverá referenciar as ameaças e os controles pertinentes em [DECISIONS.md](DECISIONS.md).

---

## Document control · Controle do documento

This is a preliminary threat model. Risk ratings and mitigation directions are hypotheses for design review, not proof of security.

Este é um modelo preliminar de ameaças. Classificações de risco e direções de mitigação são hipóteses para revisão de projeto, não comprovação de segurança.
