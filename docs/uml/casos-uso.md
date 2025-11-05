# Diagrama de Casos de Uso — PIT II (MVP)

> **Imagem (export):** abaixo

![casos-uso](./casos-uso.png)

---

## Delta ES I → ES II (o que mudou)

**Resumo:** consolidamos os casos de uso para refletirem exatamente o MVP **implementado**. Foco nos três fluxos nucleares: compra, fidelidade e avaliação.

### Mantidos/Ajustados
- **UC1 — Realizar Compra (Pix simulado):** vitrine → carrinho → checkout (`delivery_type` = retirada|delivery) → cria `Order` em `awaiting_payment`.  
- **UC2 — Fidelidade (pontuar no pagamento):** pontos lançados **no pagamento** do pedido: `floor(total_cents / 1000)`.  
- **UC3 — Avaliar Pedido:** permitido apenas com `status ∈ {ready, delivered}` e **1 review** por pedido.

### Fora do escopo agora (postergados)
- Resgate/uso de pontos em compra futura (redeem).
- Integração com gateway Pix/logística real.
- Backoffice/admin.

---

## Descrição dos Casos de Uso

### UC1 — Realizar Compra (Pix simulado)
**Atores:** Cliente  
**Objetivo:** Finalizar uma compra, escolhendo retirada ou delivery, e gerar pedido para pagamento.

**Fluxo Principal:**
1. Cliente navega na **Vitrine** e adiciona itens ao **Carrinho**.
2. Cliente acessa **Checkout** e seleciona `delivery_type`:
   - `retirada` (aplica **bônus**: `bonus_cents = 200`);
   - `delivery` (sem bônus).
3. Sistema cria `Order` em `awaiting_payment` com `subtotal`, `bonus_cents` e `total_cents`.
4. Sistema exibe dados de pagamento Pix **simulado** (QR/txid mock).
5. Caso de uso termina com pedido aguardando pagamento.

**Regras/Notas:**
- Totais calculados no checkout.
- `delivery_type` obrigatório.
- Autenticação (login/signup) pode ser tratada como **«include»** deste UC.

---

### UC2 — Fidelidade (pontuar no pagamento)
**Atores:** Cliente  
**Objetivo:** Registrar pontos quando um pedido é pago.

**Fluxo Principal:**
1. Cliente realiza o **pagamento** de um pedido `awaiting_payment`.
2. Sistema muda status para `preparing`.
3. Sistema lança pontos em `LoyaltyLedger`:
   - `points_delta = floor(total_cents / 1000)`.

**Regras/Notas:**
- Pontos apenas **no pagamento**.
- Extrato/saldo disponível em `/loyalty/summary`.

---

### UC3 — Avaliar Pedido
**Atores:** Cliente  
**Objetivo:** Registrar avaliação (1..5) e comentário opcional para um pedido concluído/preparado.

**Fluxo Principal:**
1. Cliente acessa o **Pedido** e opta por **Avaliar**.
2. Sistema verifica elegibilidade:
   - `status ∈ {ready, delivered}`.
   - Não existe review anterior para o mesmo `order_id`.
3. Cliente informa `rating (1..5)` e `comment` (opcional).
4. Sistema salva a `Review` (uma por pedido).

**Fluxos Alternativos/Erros:**
- **Status inválido:** retorna erro (400).
- **Review duplicada:** retorna erro (409).

---

## Anotações do Diagrama (para draw.io)
- **Ator:** `Cliente`, à esquerda (fora da moldura “Cupcakes — MVP”).  
- **Casos:** três elipses dentro da moldura:
  - UC1 Realizar Compra (Pix simulado)
  - UC2 Fidelidade (pontuar no pagamento)
  - UC3 Avaliar Pedido
- **Associações:** linhas do ator para cada UC.
- **Notas (sugestão):**
  - UC1: “Vitrine → Carrinho → Checkout; delivery_type: retirada|delivery; resultado: awaiting_payment”.
  - UC2: “pontos = floor(total_cents/1000); evento: pagamento”.
  - UC3: “status ∈ {ready, delivered}; 1 review/pedido”.
- (Opcional) **«include» Autenticar (Login/Signup)** a partir do UC1.

---

## Como editar/exportar
1. Abra `casos-uso.drawio` no diagrams.net.  
2. Ajuste posicionamento/textos se necessário.  
3. **File → Export as → PNG** → salve como `docs/uml/casos-uso.png`.  
4. Verifique aqui no GitHub se a imagem aparece corretamente.
