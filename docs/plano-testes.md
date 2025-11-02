# Plano de Testes — App da Loja de Cupcakes


## Objetivos
Garantir que o **fluxo do MVP** funcione ponta-a-ponta e que regras de negócio (bônus, fidelidade, desconto do mês, status) estejam corretas.


## Escopo
- **Unitários**: regras em `services/` (bônus retirada, pontos fidelidade, desconto do mês, transição de status).
- **Integração**: rotas principais (`/auth/*`, `/products`, `/cart/*`, `/checkout/pix`, `/orders/:id/*`, `/loyalty/summary`).
- **Testes com colegas (5 pessoas)**: checklist funcional (cadastro → compra → status) e coleta de prints.


## Critérios de Sucesso
- Cobertura mínima: **≥ 70%** statements/branches nas camadas de serviço.
- Todos os testes de integração “felizes” passam; cenários de erro tratados (ex.: login inválido, estoque 0, pagamento não confirmado).


## Estratégia
1. **Unitários (ex.: Jest)**
- `bonusService`: aplica `bonus_cents = 200` quando `delivery_type='retirada'`.
- `loyaltyService`: retorna `floor(total_pago/1000)`.
- `discountService`: aplica `month_discount_percent` até 1 unidade.
- `orderStatusService`: transições válidas e bloqueio de inválidas.


2. **Integração (ex.: Supertest)**
- **Auth**: signup/login, token obrigatório em rotas protegidas.
- **Products**: lista com paginação e destaque do mês.
- **Cart**: add/remove/list e subtotal.
- **Checkout**: cria pedido `awaiting_payment`, devolve QR simulado.
- **Pagamento/Status**: `pay → preparing` e leitura de `status` até `ready`.
- **Fidelidade**: após pagamento confirmado, extrato atualizado.


3. **Testes com colegas**
- Formulário com: Nome; Data; O que testou e **funcionou**; O que testou e **não funcionou** (com print); Funcionalidade **não testada** (por quê).
- Salvar prints e respostas em `docs/relato-testes-colegas/`.


## Como executar
```bash
npm test # roda unit + integração
npm run test:unit # apenas unitários
npm run test:integration # apenas integração