# Decision Log · Igor Cloud

[English](#english) · [Português](#português)

> Status: initialized. No architecture decision is recorded as approved in this document yet.

This log records decisions that materially affect the project's architecture, security, operation or long-term maintenance. Proposals and investigations must not be presented as approved decisions.

## English

### How to record a decision

For each decision, add an entry with:

- **ID:** sequential identifier, such as DEC-001.
- **Status:** Proposed, Accepted, Rejected, or Superseded.
- **Date:** date the decision was made.
- **Context:** the problem and constraints.
- **Options considered:** realistic alternatives.
- **Decision:** the selected option, if accepted.
- **Consequences:** trade-offs, risks and follow-up work.

### Decision register

| ID | Topic | Status | Date |
|---|---|---|---|
| — | No decisions formally recorded | — | — |

Current research reference (not an accepted decision):\n\n- [Technical research and provider comparison](TECHNICAL_RESEARCH.md) — database, authentication and object storage options; research snapshot 2026-11-20.\n- [Product requirements](REQUIREMENTS.md) — proposed functional/non-functional requirements and MVP boundaries; not yet approved.\n- [Threat model](THREAT_MODEL.md) — preliminary threat register and security verification scenarios; not an audit or implementation evidence.\n\nPotential topics to evaluate (not decisions):

- Metadata database selection.
- Authentication and session management.
- Upload strategy: application server or short-lived signed URLs.
- Object key and file metadata model.
- File size, type and quota policies.
- Backup, retention and deletion behavior.
- Deployment and observability.

## Português

### Como registrar uma decisão

Para cada decisão, adicione um registro contendo:

- **ID:** identificador sequencial, como DEC-001.
- **Situação:** Proposta, Aceita, Rejeitada ou Substituída.
- **Data:** data em que a decisão foi tomada.
- **Contexto:** problema e restrições envolvidos.
- **Alternativas avaliadas:** opções realistas consideradas.
- **Decisão:** opção escolhida, quando aceita.
- **Consequências:** vantagens, limitações, riscos e trabalhos posteriores.

### Registro de decisões

| ID | Tema | Situação | Data |
|---|---|---|---|
| — | Nenhuma decisão formalmente registrada | — | — |

Referência de pesquisa atual (não representa decisão aceita):\n\n- [Pesquisa técnica e comparação de provedores](TECHNICAL_RESEARCH.md) — opções de banco de dados, autenticação e armazenamento de objetos; pesquisa em 20/11/2026.\n- [Requisitos do produto](REQUIREMENTS.md) — requisitos funcionais/não funcionais e limites propostos para o MVP; ainda não aprovados.\n- [Modelo de ameaças](THREAT_MODEL.md) — registro preliminar de ameaças e cenários de verificação; não é auditoria nem comprovação de implementação.\n\nTemas que poderão ser avaliados (não são decisões):

- Escolha do banco de dados dos metadados.
- Autenticação e gerenciamento de sessões.
- Estratégia de envio: servidor da aplicação ou URLs assinadas de curta duração.
- Modelo de chaves de objetos e metadados dos arquivos.
- Limites de tamanho, tipos de arquivo e cotas.
- Backup, retenção e exclusão.
- Implantação e observabilidade.

---

A decision is considered accepted only when its status is explicitly changed to **Accepted** and its context, rationale and consequences are documented.

Uma decisão só será considerada aceita quando sua situação for explicitamente alterada para **Aceita**, com contexto, justificativa e consequências documentados.
