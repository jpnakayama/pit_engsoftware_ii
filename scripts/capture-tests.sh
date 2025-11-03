#!/usr/bin/env bash
set -e

DATE=$(date +%Y%m%d-%H%M%S)
OUTDIR="docs/evidencias/automatizados/$DATE"
mkdir -p "$OUTDIR"

# contexto
echo "Commit:" $(git rev-parse --short HEAD)           | tee "$OUTDIR/contexto.txt"
echo "Node:" $(node -v)                                 | tee -a "$OUTDIR/contexto.txt"
echo "NPM:" $(npm -v)                                   | tee -a "$OUTDIR/contexto.txt"

# saída dos testes (legível)
npx jest --runInBand | tee "$OUTDIR/jest-run.txt"

# cobertura (resumo em texto)
npx jest --coverage --coverageReporters="text-summary" \
  | tee "$OUTDIR/jest-coverage-summary.txt"

# cobertura (lcov – opcional, útil pra anexar)
npx jest --coverage --coverageReporters="lcov" >/dev/null 2>&1 || true
if [ -f coverage/lcov-report/index.html ]; then
  # salva o HTML da cobertura desta execução
  mkdir -p "$OUTDIR/coverage"
  cp -r coverage/lcov-report "$OUTDIR/coverage/"
fi

echo "Arquivos salvos em: $OUTDIR"
