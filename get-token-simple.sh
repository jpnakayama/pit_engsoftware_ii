#!/bin/bash
# Versão simplificada que funciona no Git Bash do Windows

RESPONSE=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${1:-cliente@example.com}\",\"password\":\"${2:-minhasenha123}\"}")

# Verifica se houve erro
if echo "$RESPONSE" | grep -q "\"message\""; then
  echo "$RESPONSE" >&2
  exit 1
fi

# Extrai o token usando uma abordagem que funciona no Git Bash
# Usa um arquivo temporário para evitar problemas com stdin
TEMP_FILE=$(mktemp 2>/dev/null || echo "/tmp/token-$$.json")
echo "$RESPONSE" > "$TEMP_FILE"

# Tenta diferentes métodos
if command -v jq &> /dev/null; then
  jq -r '.token' "$TEMP_FILE"
elif command -v node &> /dev/null; then
  node -e "const fs=require('fs'); const d=JSON.parse(fs.readFileSync('$TEMP_FILE','utf8')); console.log(d.token);"
elif command -v python3 &> /dev/null; then
  python3 -c "import json; print(json.load(open('$TEMP_FILE'))['token'])"
elif command -v python &> /dev/null; then
  python -c "import json; print(json.load(open('$TEMP_FILE'))['token'])"
else
  # Fallback: extrai manualmente
  grep -o '"token":"[^"]*"' "$TEMP_FILE" | sed 's/"token":"\([^"]*\)"/\1/'
fi

rm -f "$TEMP_FILE"

