#!/usr/bin/env bash
set -e
BASE=${BASE:-http://localhost:3000}

echo "Signup/Login"
LOGIN=$(curl -s -X POST $BASE/auth/login -H "Content-Type: application/json" \
  -d '{"email":"cliente@example.com","password":"minhasenha123"}' \
  || true)
if [[ -z "$LOGIN" || "$LOGIN" == *"Credenciais inválidas"* ]]; then
  curl -s -X POST $BASE/auth/signup -H "Content-Type: application/json" \
    -d '{"name":"Cliente","email":"cliente@example.com","password":"minhasenha123"}' >/dev/null
  LOGIN=$(curl -s -X POST $BASE/auth/login -H "Content-Type: application/json" \
    -d '{"email":"cliente@example.com","password":"minhasenha123"}')
fi
TOKEN=$(node -e "process.stdout.write(JSON.parse(process.argv[1]).token)" "$LOGIN")
echo "Token OK"

echo "Produtos (mostrando os 2 primeiros):"
curl -s "$BASE/products" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const j=JSON.parse(d);console.log(JSON.stringify(j.items.slice(0,2),null,2))});"

PID=$(curl -s "$BASE/products" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const j=JSON.parse(d);process.stdout.write(String(j.items[0].id))});")
echo "Add carrinho (produto $PID)"
curl -s -X POST $BASE/cart/items -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"product_id\":$PID,\"quantity\":2}" >/dev/null

echo "Checkout Pix (retirada)"
CO=$(curl -s -X POST $BASE/checkout/pix -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"delivery_type":"retirada"}')
echo "$CO" | jq .
OID=$(echo "$CO" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const j=JSON.parse(d);process.stdout.write(String(j.order_id))});")

echo "Pagar pedido $OID"
curl -s -X POST $BASE/orders/$OID/pay -H "Authorization: Bearer $TOKEN" | jq .

echo "Avançar para ready"
curl -s -X POST $BASE/orders/$OID/advance -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"next_status":"ready"}' | jq .

echo "Avaliar pedido"
curl -s -X POST $BASE/orders/$OID/review -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"rating":5,"comment":"Perfeito!"}' | jq .

echo "Fidelidade (saldo/extrato)"
curl -s $BASE/loyalty/summary -H "Authorization: Bearer $TOKEN" | jq .
