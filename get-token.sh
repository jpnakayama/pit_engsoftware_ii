#!/bin/bash
# Script para extrair token de autenticação

RESPONSE=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$1\",\"password\":\"$2\"}")

# Verifica se houve erro
if echo "$RESPONSE" | grep -q "error\|Error\|message"; then
  echo "$RESPONSE" >&2
  exit 1
fi

# Extrai o token usando jq (se disponível) ou outras opções
if command -v jq &> /dev/null; then
  echo "$RESPONSE" | jq -r '.token'
elif command -v node &> /dev/null; then
  # Node.js - salva temporariamente e lê (mais confiável no Git Bash do Windows)
  TEMP_FILE=$(mktemp)
  echo "$RESPONSE" > "$TEMP_FILE"
  node -e "const data = JSON.parse(require('fs').readFileSync('$TEMP_FILE', 'utf-8')); console.log(data.token);"
  rm -f "$TEMP_FILE"
elif command -v python3 &> /dev/null; then
  echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])" 2>/dev/null
elif command -v python &> /dev/null; then
  echo "$RESPONSE" | python -c "import sys, json; print(json.load(sys.stdin)['token'])" 2>/dev/null
else
  # Fallback usando sed/awk (menos robusto)
  echo "$RESPONSE" | sed -n 's/.*"token":"\([^"]*\)".*/\1/p'
fi

