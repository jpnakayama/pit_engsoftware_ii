# PIT II — App da Loja de Cupcakes

MVP funcional de pedidos com **retirada (bônus)**, **fidelidade**, **status do pedido** e **avaliação pós-compra**.  
Backend Node/Express + Sequelize; páginas HTML mínimas servidas pelo próprio Express.

---

## 🔗 Documentação do Projeto

- **One-pager**: [`docs/onepager.md`](docs/onepager.md)
- **UML (classes)**: [`docs/uml/diagrama-classes.md`](docs/uml/diagrama-classes.md)
- **UML (casos de uso)**: [`docs/uml/casos-uso.md`](docs/uml/casos-uso.md)
- **DER**: [`docs/uml/der.md`](docs/uml/der.md)
- **Dicionário de dados**: [`docs/dic-dados.md`](docs/dic-dados.md)
- **IHC Protótipos**: [`docs/ihc/prototipos/README.md`](docs/ihc/prototipos/README.md)
- **Mapa de Navegação**: [`docs/ihc/fluxos/mapa-navegacao.md`](docs/ihc/fluxos/mapa-navegacao.md)
- **Mensagens de Erro (IHC)**: [`docs/ihc/mensagens-erro.md`](docs/ihc/mensagens-erro.md)

### API
- **OpenAPI**: [`docs/api/openapi.yaml`](docs/api/openapi.yaml)
- **Coleção Postman**: [`docs/api/postman_collection.json`](docs/api/postman_collection.json)

### Evidências
- **Testes automatizados (saída + cobertura)**: [`docs/evidencias/testes-automatizados.md`](docs/evidencias/testes-automatizados.md)

##### Vídeo e Validação de Colegas
- **Vídeo (YouTube):** ver `docs/video/link.txt`
- **PDF — 5 opiniões/testes de colegas:** `docs/evidencias/validacao-colegas.pdf`
- **Relatos individuais (Markdown):** `docs/evidencias/testes-colegas/`
- **Resumo consolidado:** `docs/evidencias/validacao-resumo.md`

---

## 🚀 Como rodar

### Requisitos
- Node 18+ (recomendado 20+)

### Instalação e dev
```bash
npm install
npm run db:migrate
npm run dev
```

### Testes
```bash
npm test
```