# Diagrama de Classes — App Loja de Cupcakes

> **Delta ES I → ES II (Diagrama de Classes)**
> **Resumo:** o modelo foi enxugado para refletir o MVP implementado e alinhado às migrations reais.

### Adições
- **OrderItem** (explícito): guarda `quantity` e `unit_price_cents` congelados no momento da compra.
- **LoyaltyLedger**: histórico de pontos (ganhos/ajustes) por `user_id`.
- **Review** (1–0..1 por pedido): `rating (1..5)` + `comment`.

### Alterações
- **Order**
  - Novo `status` com ciclo: `awaiting_payment → preparing → ready → delivered | canceled`.
  - `delivery_type` (`retirada`|`delivery`) e **`bonus_cents`** (bônus fixo na retirada).
  - `total_cents` e `paid_at` definidos durante checkout/pagamento.
- **Product**
  - Campos para vitrine mínima: `is_cupcake_of_month`, `month_discount_percent`, `image_url` (opcional).
- **User**
  - Campos mínimos de auth (`name`, `email` único, `password_hash`).

### Remoções / Fora do escopo (agora)
- Entidades auxiliares não usadas no MVP (ex.: catálogo avançado, estoque, chat, notificações).
- Regras de resgate/uso de pontos (mantidas como futuro).

### Relacionamentos consolidados
- `User 1—N Order`
- `Order 1—N OrderItem`
- `OrderItem N—1 Product`
- `User 1—N LoyaltyLedger`
- `Order 1—0..1 Review`

### Regras relevantes (refinadas)
- **Bônus retirada:** `delivery_type='retirada'` ⇒ `bonus_cents=200`.
- **Pontos:** `floor(total_cents/1000)` (1 ponto a cada R$10), lançados no **pagamento**.
- **Avaliação:** permitida só com `status in (ready, delivered)`; **uma** por pedido.


> (Quando o PNG estiver pronto, insira aqui:)
> **Figura 1 — Diagrama de Classes**
> ![diagrama-classes](./diagrama-classes.png)

## Classes e Atributos (alinhados às migrations)

**User**
- id: INTEGER (PK)  
- name: TEXT (not null)  
- email: TEXT (unique, not null)  
- password_hash: TEXT (not null)  
- created_at: DATE, updated_at: DATE

**Product**
- id: INTEGER (PK)  
- name: TEXT (not null)  
- description: TEXT (nullable)  
- price_cents: INTEGER (not null)  
- is_ready_now: BOOLEAN (default false)  
- is_cupcake_of_month: BOOLEAN (default false)  
- month_discount_percent: INTEGER (default 0)  
- image_url: TEXT (nullable)  
- created_at: DATE, updated_at: DATE

**Order**
- id: INTEGER (PK)  
- user_id: INTEGER (FK → User.id, onDelete CASCADE)  
- status: ENUM('created','awaiting_payment','preparing','ready','delivered','canceled') (default 'created')  
- delivery_type: ENUM('retirada','delivery') (nullable)  
- bonus_cents: INTEGER (default 0)  
- total_cents: INTEGER (nullable)  
- paid_at: DATE (nullable)  
- created_at: DATE, updated_at: DATE

**OrderItem**
- id: INTEGER (PK)  
- order_id: INTEGER (FK → Order.id, onDelete CASCADE)  
- product_id: INTEGER (FK → Product.id, onDelete RESTRICT)  
- quantity: INTEGER (not null)  
- unit_price_cents: INTEGER (not null)  
- note: TEXT (nullable)  
- created_at: DATE, updated_at: DATE

**LoyaltyLedger**
- id: INTEGER (PK)  
- user_id: INTEGER (FK → User.id, onDelete CASCADE)  
- points_delta: INTEGER (not null)  
- reason: TEXT (nullable)  
- created_at: DATE, updated_at: DATE

**Review**
- id: INTEGER (PK)  
- order_id: INTEGER (FK → Order.id, onDelete CASCADE)  
- rating: INTEGER (1..5, not null)  
- comment: TEXT (nullable)  
- created_at: DATE, updated_at: DATE

## Relacionamentos
- User **1—N** Order  
- Order **1—N** OrderItem  
- OrderItem **N—1** Product  
- User **1—N** LoyaltyLedger  
- Order **1—0..1** Review

## Regras relevantes (resumo)
- Bônus de retirada: `delivery_type='retirada'` ⇒ `bonus_cents=200`.  
- Fidelidade: `floor(total_cents/1000)` pontos no pagamento.  
- Fluxo de status: `awaiting_payment → preparing → ready → delivered | canceled`.  
- Review: 1 por pedido, apenas se `status in ('ready','delivered')`.
