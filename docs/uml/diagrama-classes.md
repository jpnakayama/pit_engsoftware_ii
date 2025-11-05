# Diagrama de Classes — PIT II (MVP)

> **Fonte editável:** [`diagrama-classes.drawio`](./diagrama-classes.drawio)  
> **Imagem (export):** abaixo

![diagrama-classes](./diagrama-classes.png)

---

## Delta ES I → ES II (o que mudou)
**Resumo:** o modelo foi enxugado para refletir o MVP **implementado** e alinhado às migrations reais.

### Adições
- **OrderItem** (explícito): `quantity`, `unit_price_cents` congelados na compra.
- **LoyaltyLedger**: histórico de pontos por `user_id`.
- **Review** (1–0..1 por pedido): `rating (1..5)` + `comment`.

### Alterações
- **Order**
  - `status` com fluxo: `awaiting_payment → preparing → ready → delivered | canceled`.
  - `delivery_type` (`retirada`|`delivery`) e `bonus_cents` (bônus fixo na retirada).
  - `total_cents`/`paid_at` definidos em checkout/pagamento.
- **Product**
  - `is_cupcake_of_month`, `month_discount_percent`, `image_url` (opcional).
- **User**
  - `email` **único**; campos mínimos de auth.

### Relacionamentos consolidados
- `User 1—N Order`
- `Order 1—N OrderItem` (**composição** no lado de `Order`)
- `OrderItem N—1 Product`
- `User 1—N LoyaltyLedger`
- `Order 1—0..1 Review`

### Regras de negócio (essenciais)
- **Bônus retirada:** `delivery_type='retirada'` ⇒ `bonus_cents=200`.
- **Pontos:** `floor(total_cents / 1000)` no **pagamento** do pedido.
- **Avaliação:** permitida somente com `status ∈ {ready, delivered}`; **1 por pedido**.

---

## Como editar/exportar
1. Abra o `.drawio` no diagrams.net.  
2. Ajuste se necessário.  
3. **File → Export as → PNG** → salve em `docs/uml/diagrama-classes.png` (mesmo nome deste .md).  
4. Confirme aqui no GitHub que a imagem aparece.

