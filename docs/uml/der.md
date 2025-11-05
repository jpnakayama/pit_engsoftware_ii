# DER — Esquema Lógico (PIT II)

> **Imagem (export):** abaixo

![der](./der.png)

---

## Delta ES I → ES II (o que mudou)
**Resumo:** alinhamos o esquema às **migrations reais**, com PK/FK, integridade e unicidades.

### Adições
- **`order_items`** com FKs: (`order_id` → `orders.id` CASCADE) e (`product_id` → `products.id` RESTRICT).
- **`loyalty_ledger`** (`user_id` → `users.id` CASCADE) para histórico de pontos.
- **`reviews`** (`order_id` → `orders.id` CASCADE) com unicidade **1 review por pedido**.

### Alterações
- **`orders`**
  - `status` como ENUM: `awaiting_payment, preparing, ready, delivered, canceled`.
  - `delivery_type` como ENUM: `retirada, delivery` (obrigatório).
  - `bonus_cents` (default `0`), `total_cents` (pode ser nulo até checkout), `paid_at` (nulo até pagamento).
- **`users`**
  - `email` **UNIQUE**.

### Integridade/Índices
- `orders.user_id` → **ON DELETE CASCADE**  
- `order_items.order_id` → **ON DELETE CASCADE**  
- `order_items.product_id` → **ON DELETE RESTRICT**  
- `users.email` → **UNIQUE**  
- `reviews.order_id` → **UNIQUE** (garante 1 review por pedido)

---

## Tabelas (campos principais)

### `users`
- `id (PK) : INTEGER`
- `name : VARCHAR`
- `email : VARCHAR (UNIQUE)`
- `password_hash : VARCHAR`
- `created_at : DATETIME`
- `updated_at : DATETIME`

### `products`
- `id (PK) : INTEGER`
- `name : VARCHAR`
- `description : TEXT NULL`
- `price_cents : INTEGER`
- `is_cupcake_of_month : BOOLEAN DEFAULT 0`
- `month_discount_percent : INTEGER DEFAULT 0`
- `image_url : VARCHAR NULL`
- `created_at : DATETIME`
- `updated_at : DATETIME`

### `orders`
- `id (PK) : INTEGER`
- `user_id (FK→users.id) : INTEGER`
- `status : ENUM{awaiting_payment, preparing, ready, delivered, canceled}`
- `delivery_type : ENUM{retirada, delivery}`
- `bonus_cents : INTEGER DEFAULT 0`
- `total_cents : INTEGER NULL`
- `paid_at : DATETIME NULL`
- `created_at : DATETIME`
- `updated_at : DATETIME`

### `order_items`
- `id (PK) : INTEGER`
- `order_id (FK→orders.id) : INTEGER`
- `product_id (FK→products.id) : INTEGER`
- `quantity : INTEGER`
- `unit_price_cents : INTEGER`
- `note : TEXT NULL`
- `created_at : DATETIME`
- `updated_at : DATETIME`

### `loyalty_ledger`
- `id (PK) : INTEGER`
- `user_id (FK→users.id) : INTEGER`
- `points_delta : INTEGER` *(pode ser negativo para ajustes)*
- `reason : VARCHAR NULL`
- `created_at : DATETIME`
- `updated_at : DATETIME`

### `reviews`
- `id (PK) : INTEGER`
- `order_id (FK→orders.id, UNIQUE) : INTEGER`
- `rating : INTEGER (1..5)`
- `comment : TEXT NULL`
- `created_at : DATETIME`
- `updated_at : DATETIME`
