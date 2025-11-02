# One-pager — App da Loja de Cupcakes (PIT II)

**Sumário executivo**  
Este projeto dá continuidade ao trabalho da PIT I, entregando um **MVP funcional** de pedidos de cupcakes com foco em **retirada rápida** (bônus automático), **programa de fidelidade** simples e **avaliação pós-compra**. O usuário navega pela vitrine, adiciona itens ao carrinho, realiza **checkout Pix simulado** e acompanha o **status do pedido** até a retirada/entrega. A cada compra paga, o cliente **acumula pontos** (1 ponto a cada R$10). A solução prioriza **clareza, consistência e simplicidade**, com backend Node/Express, banco relacional e páginas HTML mínimas para navegação. A validação será feita com **testes automatizados** e **testes com 5 colegas**, registrando evidências e melhorias.

---

## 1) Objetivo
Facilitar pedidos de cupcakes com uma experiência enxuta, transparente e confiável, reduzindo atrito no fluxo de compra e incentivando retorno com bônus e pontos.

## 2) Público-alvo
Clientes da loja (interior de SP), sobretudo quem prefere **retirar na loja** e quer agilidade, clareza de preço/tempo e benefícios simples (bônus e pontos).

## 3) Proposta de valor
- **Rapidez e simplicidade:** vitrine → carrinho → checkout Pix (simulado) em poucos passos.  
- **Transparência:** status do pedido (“aguardando pagamento”, “preparando”, “pronto”, “entregue”).  
- **Benefícios:** bônus de retirada (R$2,00) e **fidelidade** por gasto.

## 4) Escopo (MVP)
- **Autenticação**: cadastro/login.  
- **Vitrine**: listagem de produtos com preço.  
- **Carrinho & Checkout**: seleção de entrega (retirada/delivery), bônus automático na retirada e **Pix simulado**.  
- **Pedidos**: acompanhamento de status (awaiting_payment → preparing → ready → delivered | canceled).  
- **Fidelidade**: cálculo e extrato de pontos (1 ponto a cada R$10).  
- **Avaliação pós-compra**: 1 avaliação (nota 1–5 + comentário) por pedido pronto/entregue.

## 5) Fora de escopo (nesta fase)
- Gateway Pix real, logística de delivery real, painel administrativo completo, catálogo avançado (estoque, categorias, variações).

## 6) Métricas de sucesso (acadêmicas)
- Fluxo ponta-a-ponta executável (demo local).  
- **≥ 5 validações** de colegas com feedbacks registrados e correções evidenciadas.  
- Testes automatizados básicos passando (auth, products, cart/checkout, loyalty).

## 7) Regras de negócio (essenciais)
- **Bônus de retirada:** `delivery_type='retirada'` ⇒ `bonus_cents=200`.  
- **Fidelidade:** `pontos = floor(total_cents / 1000)` (1 ponto a cada R$10).  
- **Status do pedido:** `awaiting_payment → preparing → ready → delivered | canceled`.  
- **Avaliação:** permitido apenas quando `status ∈ {ready, delivered}`; 1 por pedido.

## 8) Arquitetura & Stack
- **Backend:** Node.js + Express (REST).  
- **BD:** Relacional (SQLite dev / PostgreSQL prod) via Sequelize.  
- **Testes:** Jest + Supertest.  
- **Front (mínimo):** páginas HTML estáticas (Bootstrap) servidas pelo Express.  
- **Docs auxiliares:** OpenAPI (rotas principais) e coleção Postman/Insomnia.

## 9) Riscos & Mitigação
- **Tempo de UI/estilo:** manter HTML mínimo e estilizar depois (priorizar funcional).  
- **Escopo crescer demais:** foco no MVP e casos de uso definidos.  
- **Dados de teste pobres:** seeds de produtos e roteiro de testes com colegas.

## 10) Entregáveis relacionados
- **UML (classes, casos de uso, DER)**: ver `docs/uml/`.  
- **Dicionário de dados**: ver `docs/dic-dados.md`.  
- **IHC/UX** (protótipos, mapa de navegação, mensagens de erro): ver `docs/ihc/`.  
- **Evidências** (testes com 5 colegas + prints): ver `docs/evidencias/`.

---

> **Links úteis no repo:**  
> • UML (classes): `docs/uml/diagrama-classes.md`  
> • UML (casos de uso): `docs/uml/casos-uso.md`  
> • DER: `docs/uml/der.md`  
> • Dicionário: `docs/dic-dados.md`  
> • IHC (protótipos): `docs/ihc/prototipos/README.md`  
> • IHC (mapa): `docs/ihc/fluxos/mapa-navegacao.md`  
> • Erros (IHC): `docs/ihc/mensagens-erro.md`
