#!/usr/bin/env bash
set -e

DATE=$(date +%Y%m%d-%H%M%S)
OUTDIR="docs/evidencias/automatizados/$DATE"
mkdir -p "$OUTDIR"

# Contexto
echo "Commit: $(git rev-parse --short HEAD)"            | tee "$OUTDIR/contexto.txt"
echo "Node: $(node -v)"                                  | tee -a "$OUTDIR/contexto.txt"
echo "NPM: $(npm -v)"                                    | tee -a "$OUTDIR/contexto.txt"
echo "Timestamp: $DATE"                                  | tee -a "$OUTDIR/contexto.txt"

# Saída legível
npx jest --runInBand | tee "$OUTDIR/jest-run.txt"

# Saída em JSON (p/ automação)
npx jest --json --outputFile "$OUTDIR/jest-run.json" --runInBand >/dev/null

# Cobertura (resumo texto + HTML)
npx jest --coverage --coverageReporters="text-summary" \
  | tee "$OUTDIR/jest-coverage-summary.txt"
npx jest --coverage --coverageReporters="lcov" >/dev/null 2>&1 || true
if [ -d coverage/lcov-report ]; then
  mkdir -p "$OUTDIR/coverage"
  cp -r coverage/lcov-report "$OUTDIR/coverage/"
fi

# Atualiza o markdown automaticamente
node scripts/update-evidences.js "$OUTDIR"
echo "✔ Artefatos em: $OUTDIR"
