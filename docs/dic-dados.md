# Dicionário de Dados — App Loja de Cupcakes

> **Origem (migration):** arquivo em `db/migrations/*` correspondente  
> **Validações/Regra:** regras de negócio aplicadas na API/serviços

## Tabela: users
| Campo          | Tipo     | Nulo | Origem (migration)                  | Validações/Regra                    |
|----------------|----------|------|-------------------------------------|-------------------------------------|
| id (PK)        | INTEGER  | não  | 20251101-001-create-users.js        | autoincremento                      |
| name           | TEXT     | não  | idem                                | —                                   |
| email          | TEXT     | não  | idem                                | único                               |
| password_hash  | TEXT     | não  | idem                                | hash de senha (bcrypt)              |
| created_at     | DATE     | sim  | idem                                | default NOW                         |
| updated_at     | DATE     | sim  | idem                                | —                                   |

## Tabela: products
| Campo                 | Tipo     | Nulo | Origem (migration)                     | Validações/Regra                       |
|-----------------------|----------|------|----------------------------------------|----------------------------------------|
| id (PK)               | INTEGER  | não  | 20251101-002-create-products.js        | autoincremento                         |
| name                  | TEXT     | não  | idem                                   | —                                      |
| description           | TEXT     | sim  | idem                                   | —                                      |
| price_cents           | INTEGER  | não  | idem                                   | ≥ 0                                    |
| is_ready_now          | BOOLEAN  | sim  | idem (default false)                   | —                                      |
| is_cupcake_of_month   | BOOLEAN  | sim  | idem (default false)                   | —                                      |
| month_discount_percent| INTEGER  | sim  | idem (default 0)                       | 0..100                                 |
| image_url             | TEXT     | sim  | idem                                   | URL opcional                           |
| created_at            | DATE     | sim  | idem                                   | default NOW                            |
| updated_at            | DATE     | sim  | idem                                   | —                                      |

## Tabela: orders
| Campo          | Tipo     | Nulo | Origem (migration)                     | Validações/Regra                                                   |
|----------------|----------|------|----------------------------------------|--------------------------------------------------------------------|
| id (PK)        | INTEGER  | não  | 20251102-001-create-orders.js          | autoincremento                                                     |
| user_id (FK)   | INTEGER  | não  | idem                                   | → users.id (CASCADE)                                               |
| status         | ENUM     | não  | idem                                   | 'created','awaiting_payment','preparing','ready','delivered','canceled' |
| delivery_type  | ENUM     | sim  | idem                                   | 'retirada','delivery'                                              |
| bonus_cents    | INTEGER  | não  | idem (default 0)                       | 200 se retirada, senão 0                                           |
| total_cents    | INTEGER  | sim  | idem                                   | calculado no checkout                                              |
| paid_at        | DATE     | sim  | 20251102-003-add-paid-at-to-orders.js  | setado na confirmação de pagamento                                 |
| created_at     | DATE     | sim  | 20251102-001-create-orders.js          | default NOW                                                        |
| updated_at     | DATE     | sim  | idem                                   | —                                                                  |

## Tabela: order_items
| Campo             | Tipo     | Nulo | Origem (migration)                       | Validações/Regra                |
|-------------------|----------|------|------------------------------------------|---------------------------------|
| id (PK)           | INTEGER  | não  | 20251102-002-create-order-items.js       | autoincremento                  |
| order_id (FK)     | INTEGER  | não  | idem                                     | → orders.id (CASCADE)           |
| product_id (FK)   | INTEGER  | não  | idem                                     | → products.id (RESTRICT)        |
| quantity          | INTEGER  | não  | idem                                     | ≥ 1                             |
| unit_price_cents  | INTEGER  | não  | idem                                     | copia do preço no momento       |
| note              | TEXT     | sim  | idem                                     | —                               |
| created_at        | DATE     | sim  | idem                                     | default NOW                     |
| updated_at        | DATE     | sim  | idem                                     | —                               |

## Tabela: loyalty_ledger
| Campo         | Tipo     | Nulo | Origem (migration)                         | Validações/Regra                          |
|---------------|----------|------|--------------------------------------------|-------------------------------------------|
| id (PK)       | INTEGER  | não  | 20251102-004-create-loyalty-ledger.js      | autoincremento                             |
| user_id (FK)  | INTEGER  | não  | idem                                       | → users.id (CASCADE)                      |
| points_delta  | INTEGER  | não  | idem                                       | pode ser positivo/negativo; aqui só +     |
| reason        | TEXT     | sim  | idem                                       | descritivo                                 |
| created_at    | DATE     | sim  | idem                                       | default NOW                                |
| updated_at    | DATE     | sim  | idem                                       | —                                          |

## Tabela: reviews
| Campo        | Tipo     | Nulo | Origem (migration)                       | Validações/Regra                                 |
|--------------|----------|------|------------------------------------------|--------------------------------------------------|
| id (PK)      | INTEGER  | não  | 20251102-005-create-reviews.js           | autoincremento                                   |
| order_id (FK)| INTEGER  | não  | idem                                     | → orders.id (CASCADE); 1 review por pedido       |
| rating       | INTEGER  | não  | idem                                     | 1..5                                             |
| comment      | TEXT     | sim  | idem                                     | —                                                |
| created_at   | DATE     | sim  | idem                                     | default NOW                                      |
| updated_at   | DATE     | sim  | idem                                     | —                                                |

## Checklist de consistência
- [ ] Dicionário = migrations (nomes/colunas/enum).  
- [ ] FKs/PKs documentadas.  
- [ ] Regras de negócio refletidas (bônus, pontos, status, review).
