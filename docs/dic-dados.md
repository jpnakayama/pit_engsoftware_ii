# Dicionário de Dados — App da Loja de Cupcakes


> Convenções: `*_id` chaves estrangeiras; `*_cents` valores monetários em centavos; timestamps ISO.


## Tabela: `users`
| Campo | Tipo | Nulável | Descrição | Regras |
|----------------|----------|---------|-------------------------------------------|--------|
| id | SERIAL PK| não | Identificador do usuário | único |
| name | TEXT | não | Nome completo | |
| email | TEXT | não | E-mail | único |
| password_hash | TEXT | não | Hash da senha | |
| created_at | TIMESTAMP| sim | Criação | default NOW() |


## Tabela: `products`
| Campo | Tipo | Nulável | Descrição | Regras |
|------------------------|-----------|---------|---------------------------------------------|--------|
| id | SERIAL PK | não | Produto | |
| name | TEXT | não | Nome | |
| description | TEXT | sim | Descrição | |
| price_cents | INTEGER | não | Preço em centavos | >0 |
| is_ready_now | BOOLEAN | sim | Disponível imediato | default false |
| is_cupcake_of_month | BOOLEAN | sim | Destaque mês | default false |
| month_discount_percent | INTEGER | sim | % desconto “do mês” | 0–100 |
| image_url | TEXT | sim | URL imagem | |


## Tabela: `orders`
| Campo | Tipo | Nulável | Descrição | Regras |
|---------------|-----------|---------|-------------------------------------------|--------|
| id | SERIAL PK | não | Pedido | |
| user_id | INTEGER FK| sim | → `users.id` | |
| status | TEXT | não | created/awaiting_payment/preparing/ready/delivered/canceled | CHECK |
| delivery_type | TEXT | não | retirada/delivery | CHECK |
| bonus_cents | INTEGER | sim | Bônus por retirada | default 0 |
| total_cents | INTEGER | não | Total do pedido (centavos) | >0 |
| created_at | TIMESTAMP | sim | Criação | default NOW() |
| paid_at | TIMESTAMP | sim | Pagamento confirmado | |


## Tabela: `order_items`
| Campo | Tipo | Nulável | Descrição | Regras |
|-----------------|-----------|---------|----------------------|--------|
| id | SERIAL PK | não | Item do pedido | |
| order_id | INTEGER FK| não | → `orders.id` | ON DELETE CASCADE |
| product_id | INTEGER FK| não | → `products.id` | |
| quantity | INTEGER | não | Quantidade | >0 |
| unit_price_cents| INTEGER | não | Preço unitário (¢) | >0 |
| note | TEXT | sim | Observação opcional | |


## Tabela: `addresses`
| Campo | Tipo | Nulável | Descrição | Regras |
|-----------|-----------|---------|----------|--------|
| id | SERIAL PK | não | Endereço | |
| user_id | INTEGER FK| não | → `users.id` | |
| cep | TEXT | sim | CEP | |
| street | TEXT | sim | Rua | |
| number | TEXT | sim | Número | |
| complement| TEXT | sim | Comp. | |
| city | TEXT | sim | Cidade | |
| state | TEXT | sim | UF | |


- **Bônus retirada**: desconto fixo aplicado quando `delivery_type='retirada'`.