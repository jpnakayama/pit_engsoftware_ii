# App da Loja de Cupcakes — PIT II (Eng. de Software)


Repositório do projeto da disciplina (PIT II). Fluxo essencial de compra com **retirada com bônus**, **Pix simulado**, **acompanhamento de status** e **fidelidade**.


> Repositório: https://github.com/jpnakayama/pit_engsoftware_ii


## Visão Geral
- **Front-end**: HTML/CSS/JS (Bootstrap) ou framework equivalente simples.
- **Back-end**: MVC (ex.: Node.js + Express) — front/back **testados**.
- **Banco de Dados**: PostgreSQL (produção) e/ou SQLite (desenvolvimento).
- **Testes**: unitários e de integração (ex.: Jest/Supertest ou equivalentes).


## Documentação
- **One-pager:** docs/onepager.md
- **UML (classes):** docs/uml/diagrama-classes.md
- **UML (casos de uso):** docs/uml/casos-uso.md
- **DER:** docs/uml/der.md
- **IHC Protótipos:** docs/ihc/prototipos/README.md
- **Mapa de Navegação:** docs/ihc/fluxos/mapa-navegacao.md
- **Mensagens de Erro:** docs/ihc/mensagens-erro.md


## Como rodar (exemplo com Node.js)
```bash
# 1) Clonar e instalar
git clone https://github.com/jpnakayama/pit_engsoftware_ii
cd pit_eng_software
npm install


# 2) Variáveis de ambiente (exemplo)
cp .env.example .env # ajuste credenciais do BD


# 3) Banco (desenvolvimento)
# se usar ORM/migrations, rode a migration/seed
npm run db:migrate
npm run db:seed


# 4) Executar aplicação e testes
npm run dev
npm test