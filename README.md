<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=rect&color=0:080B14,45:21143A,100:6D28D9&height=170&section=header&text=IGOR%20CLOUD&fontSize=46&fontColor=FFFFFF&fontAlignY=42&desc=PERSONAL%20CLOUD%20STORAGE%20PROJECT&descSize=13&descAlignY=68&animation=fadeIn" />

**A personal cloud storage project focused on file organization, controlled access and a clear engineering foundation.**

</div>

[![Status](https://img.shields.io/badge/status-early%20development-8B5CF6?style=for-the-badge)](#development-status)
[![License: MIT](https://img.shields.io/badge/license-MIT-2563EB?style=for-the-badge)](LICENSE)

> Building a personal space for files — with deliberate architecture, incremental delivery and transparent documentation.

[English](#english) · [Português](#português)

---

## English

### Overview

Igor Cloud is a personal project exploring the foundations of a cloud file storage application. Its intended purpose is to let an individual store, organize and access files through a straightforward interface.

This repository is currently in the documentation and planning stage. It does **not** contain a working storage service, and it is not ready for production use.

### Project Objectives

- Establish a maintainable foundation for a personal cloud storage application.
- Explore object storage through Cloudflare R2.
- Design clear file organization and metadata management.
- Plan authentication and authorization before exposing stored content.
- Build incrementally, validating each capability before documenting it as complete.

### Planned Technology Direction

| Technology | Intended responsibility | Status |
|---|---|---|
| Next.js | Application framework and user interface | Planned |
| Cloudflare R2 | Object storage for file content | Planned |

These are intended technology choices, not implemented integrations. The stack may be refined as technical decisions are validated.

### Scope and Feature Status

| Capability | Current status |
|---|---|
| Initial project documentation | Available |
| Application scaffold and interface | Not implemented |
| User authentication | Not implemented |
| File upload and download | Not implemented |
| File organization and metadata | Not implemented |
| Cloudflare R2 integration | Not implemented |
| Access control | Not implemented |
| Automated tests and deployment | Not implemented |

### Architecture Direction

The initial direction separates the application layer from binary object storage:

1. **Application layer:** Next.js will provide the user-facing application and server-side application logic.
2. **Object storage:** Cloudflare R2 is the planned destination for file objects.
3. **Metadata layer:** file names, object keys, ownership and other metadata will require a structured data model. The database choice is still open.
4. **Access layer:** authentication and authorization must be designed before private files can be accessed.
5. **Validation and observability:** input validation, error handling, logging and tests will be introduced as the application takes shape.

No production architecture or security guarantees are claimed at this stage. See [the architecture notes](docs/ARCHITECTURE.md) for the current design direction and open decisions.

### Security Principles

Security is a design requirement, not a feature to add at the end. The project intends to follow these principles:

- Keep credentials and secrets out of source control.
- Validate file metadata and uploads on the server.
- Enforce authorization on every operation involving private files.
- Avoid exposing storage credentials or unrestricted object access to the client.
- Define file size and type limits before enabling uploads.
- Document security-relevant decisions and known limitations.

These are project principles; they should not be interpreted as implemented controls. For reporting a vulnerability, read [SECURITY.md](SECURITY.md).

### Roadmap

- [x] Create the public repository.
- [x] Define the initial project direction and intended technology choices.
- [x] Document scope, status and initial architecture direction.
- [x] Add contribution and security guidance.
- [ ] Choose and document the metadata database.
- [ ] Establish the application scaffold.
- [ ] Build the initial interface.
- [ ] Design the file and metadata model.
- [ ] Integrate Cloudflare R2.
- [ ] Implement authentication and authorization.
- [ ] Implement upload, download and file organization.
- [ ] Add validation, error handling, logging and automated tests.
- [ ] Prepare deployment and operational documentation.

### Development Status

**Early development — documentation and planning.**

There is no installation or local run command yet because the application scaffold has not been created. Setup instructions will be added once there is runnable application code.

### Project Documentation

- [Architecture notes](docs/ARCHITECTURE.md)
- [Architecture decision log](docs/DECISIONS.md)
- [Contribution guide](CONTRIBUTING.md)
- [Security policy](SECURITY.md)
- [Issue and pull request templates](.github/)
- [License](LICENSE)

---

## Português

### Visão Geral

Igor Cloud é um projeto pessoal que explora os fundamentos de uma aplicação de armazenamento de arquivos em nuvem. A proposta é permitir que uma pessoa armazene, organize e acesse seus arquivos por meio de uma interface simples.

Atualmente, este repositório está na etapa de documentação e planejamento. Ele **ainda não contém um serviço funcional de armazenamento** e não está pronto para uso em produção.

### Objetivos

- Estabelecer uma base sustentável para uma aplicação pessoal de armazenamento em nuvem.
- Explorar o armazenamento de objetos por meio do Cloudflare R2.
- Projetar uma organização clara de arquivos e metadados.
- Planejar autenticação e autorização antes de disponibilizar o acesso aos arquivos.
- Desenvolver gradualmente, validando cada capacidade antes de documentá-la como concluída.

### Direção Tecnológica Planejada

| Tecnologia | Responsabilidade prevista | Situação |
|---|---|---|
| Next.js | Framework da aplicação e interface | Planejado |
| Cloudflare R2 | Armazenamento dos arquivos | Planejado |

Essas tecnologias representam escolhas iniciais, não integrações já implementadas. A stack poderá ser refinada conforme as decisões técnicas forem validadas.

### Escopo e Situação das Funcionalidades

| Capacidade | Situação atual |
|---|---|
| Documentação inicial do projeto | Disponível |
| Estrutura da aplicação e interface | Não implementadas |
| Autenticação de usuários | Não implementada |
| Envio e download de arquivos | Não implementados |
| Organização de arquivos e metadados | Não implementada |
| Integração com Cloudflare R2 | Não implementada |
| Controle de acesso | Não implementado |
| Testes automatizados e implantação | Não implementados |

### Direção da Arquitetura

A proposta inicial separa a camada da aplicação do armazenamento dos arquivos:

1. **Camada da aplicação:** o Next.js deverá fornecer a interface e a lógica da aplicação no servidor.
2. **Armazenamento de objetos:** o Cloudflare R2 é a opção planejada para guardar os arquivos.
3. **Camada de metadados:** nomes, chaves dos objetos, propriedade e demais informações exigirão um modelo de dados estruturado. A escolha do banco de dados permanece em aberto.
4. **Camada de acesso:** autenticação e autorização deverão ser projetadas antes que arquivos privados possam ser acessados.
5. **Validação e observabilidade:** validação de entradas, tratamento de erros, registros e testes serão introduzidos conforme a aplicação evoluir.

Neste estágio, não há uma arquitetura de produção nem garantias de segurança implementadas. Consulte as [notas de arquitetura](docs/ARCHITECTURE.md) para conhecer a direção atual e as decisões pendentes.

### Princípios de Segurança

Segurança é um requisito de projeto, não uma funcionalidade para ser adicionada no final. O projeto pretende seguir estes princípios:

- Manter credenciais e segredos fora do controle de versão.
- Validar metadados e arquivos enviados no servidor.
- Exigir autorização em todas as operações envolvendo arquivos privados.
- Não expor credenciais de armazenamento nem acesso irrestrito aos objetos no cliente.
- Definir limites de tamanho e tipo antes de habilitar envios.
- Documentar decisões relevantes para a segurança e limitações conhecidas.

Esses pontos são princípios planejados; não devem ser interpretados como controles já implementados. Para comunicar uma vulnerabilidade, consulte [SECURITY.md](SECURITY.md).

### Planejamento

- [x] Criar o repositório público.
- [x] Definir a proposta inicial e as tecnologias pretendidas.
- [x] Documentar escopo, situação e direção inicial da arquitetura.
- [x] Adicionar orientações de contribuição e segurança.
- [ ] Escolher e documentar o banco de dados dos metadados.
- [ ] Estabelecer a estrutura da aplicação.
- [ ] Desenvolver a interface inicial.
- [ ] Projetar o modelo de arquivos e metadados.
- [ ] Integrar o Cloudflare R2.
- [ ] Implementar autenticação e autorização.
- [ ] Implementar envio, download e organização de arquivos.
- [ ] Adicionar validação, tratamento de erros, logs e testes automatizados.
- [ ] Preparar a documentação de implantação e operação.

### Estado do Desenvolvimento

**Estágio inicial — documentação e planejamento.**

Ainda não existem comandos de instalação ou execução local porque a estrutura da aplicação não foi criada. As instruções serão adicionadas quando houver código executável.

### Documentação do Projeto

- [Notas de arquitetura](docs/ARCHITECTURE.md)
- [Registro de decisões arquiteturais](docs/DECISIONS.md)
- [Guia de contribuição](CONTRIBUTING.md)
- [Política de segurança](SECURITY.md)
- [Modelos de issues e pull requests](.github/)
- [Licença](LICENSE)

---

## Project Principles · Princípios do Projeto

- **Clarity · Clareza:** communicate scope and implementation status honestly.
- **Incremental delivery · Evolução gradual:** build and validate in manageable stages.
- **Maintainability · Manutenibilidade:** prefer understandable, documented technical decisions.
- **Security by design · Segurança desde o projeto:** consider access control and data protection from the beginning.
- **Honest documentation · Documentação responsável:** never describe planned behavior as implemented.

---

## License

This project is licensed under the [MIT License](LICENSE).

<div align="center">

[Back to GitHub Profile · Voltar ao Perfil](https://github.com/francisigorsilva)

</div>
