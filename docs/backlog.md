---


## `docs/backlog.md`
> **Escopo + MVP + DoD** (Etapa 1).


```markdown
# Projeto App da Loja de Cupcakes — Etapa 1: Escopo e MVP


## 1) Objetivo do MVP
Construir o fluxo essencial para o cliente comprar cupcakes com **retirada na loja (com bônus)** ou **delivery simples**, incluindo **cadastro/login**, **vitrine de produtos**, **carrinho e checkout com Pix simulado**, **acompanhamento de status do pedido** e **programa de fidelidade** básico.


## 2) Personas (resumo)
- **Cliente final**: quer comprar rapidamente, pagar por Pix e acompanhar status/retirada; valoriza promo do “Cupcake do Mês” e pontos de fidelidade.
- **Atendente/ADM** (mínimo nesta versão): atualiza status do pedido no painel interno simples (pode ser via rota protegida; interface mínima nesta fase).


## 3) Escopo do MVP (MoSCoW)
- **Must**
- Autenticação (cadastro/login)
- Listagem e detalhe de produtos
- Carrinho (adicionar/remover)
- Checkout com Pix simulado (QR fictício)
- Acompanhamento de status (awaiting_payment → preparing → ready → delivered)
- Retirada na loja com bônus automático
- Fidelidade: pontos proporcionais ao valor pago
- **Should**
- Destaque do “Cupcake do Mês” com desconto limitado a 1 unidade
- Seed de produtos para vitrine
- **Could**
- Avaliação pós-compra (nota + comentário)
- Notificações simples
- Chat simples (texto)
- **Won’t (por enquanto)**
- Integração real com gateway de pagamento
- Catálogo complexo (variações, combos, estoque avançado)
- App mobile nativo


## 4) User Stories do MVP (HUs) com Critérios de Aceitação
> Priorização: **A** (núcleo do MVP), **B** (desejável), **C** (pode ficar para depois).


### H01 — Cadastro de Usuário (A)
**Como** visitante, **quero** criar uma conta com nome, e‑mail e senha **para** poder comprar.
- **Aceite**
- Campo nome, e‑mail único, senha (mín. 8; hash no backend).
- Validações de formato; mensagens claras de erro.
- **H09 (opcional)** → `reviews` → `/orders/:id/review` → testes integração review.

> Consulte também o **One-pager do projeto**: ../onepager.md