# Diagrama de Classes — App Loja de Cupcakes

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
