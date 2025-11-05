# Mensagens de Erro — Padrões (MVP)

## Autenticação
- **401** `Credenciais inválidas.`  
  *Ação sugerida:* verifique e-mail/senha e tente novamente.

## Produtos / Vitrine
- **500** `Erro ao carregar produtos. Tente recarregar a página.`

## Carrinho
- **400** `Quantidade inválida.`  
- **404** `Item não encontrado no carrinho.`

## Checkout
- **400** `Carrinho vazio.`  
- **400** `delivery_type inválido. Selecione retirada ou delivery.`

## Pedidos
- **404** `Pedido não encontrado.`  
- **400** `Pedido não está aguardando pagamento.` (ao pagar)  
- **400** `Transição de status inválida.` (ao avançar)

## Avaliação
- **400** `Pedido não pode ser avaliado neste status.`  
- **409** `Pedido já avaliado.`  
- **400** `rating deve estar entre 1 e 5.`

## Fidelidade
- **401** `Não autorizado. Faça login para ver seu saldo.`

---
**Padrões de escrita**
- Frases curtas, diretas, sem jargão.
- Dizer **o que houve** e **o que o usuário pode fazer**.
- Em telas, exibir alerta visual (ex.: Bootstrap `alert-danger`) e manter foco no campo relevante.
