# Mensagens de Erro (padronizadas)

## Autenticação
- 400 `Dados inválidos (senha >= 8).`
- 401 `Credenciais inválidas.`
- 401 `Token ausente.` / `Token inválido ou expirado.`

## Carrinho/Produtos
- 400 `Produto/quantidade inválidos`
- 404 `Produto não encontrado`
- 404 `Item não encontrado no carrinho`

## Checkout/Pedido
- 400 `delivery_type inválido (retirada|delivery)`
- 400 `Carrinho vazio`
- 400 `Pedido não está aguardando pagamento`
- 404 `Pedido não encontrado`
- 400 `Transição inválida: {status_atual} → {status_novo}`

## Avaliação
- 400 `rating deve estar entre 1 e 5`
- 400 `Pedido com status '{status}' não pode ser avaliado`
- 409 `Pedido já avaliado`
