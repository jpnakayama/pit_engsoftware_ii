# Evidências — Testes Automatizados (PIT II)

Este documento comprova a execução dos testes automatizados do projeto, incluindo **saída completa**, **cobertura** e **artefatos** arquivados no repositório.

---

## 1) Contexto da Execução

- **Commit:** `<preencher após execução>`  
- **Data/Hora:** `<AAAA-MM-DD HH:MM BRT>`  
- **Ambiente:** Node `<vXX>` / NPM `<vXX>`  
- **Comando usado:** `./scripts/capture-tests.sh`

> O script cria uma pasta com timestamp em `docs/evidencias/automatizados/<YYYYMMDD-HHMMSS>/`.

**Artefatos desta execução (links):**

- Saída do Jest: `docs/evidencias/automatizados/<YYYYMMDD-HHMMSS>/jest-run.txt`  
- Cobertura (resumo): `docs/evidencias/automatizados/<YYYYMMDD-HHMMSS>/jest-coverage-summary.txt`  
- Cobertura (HTML): `docs/evidencias/automatizados/<YYYYMMDD-HHMMSS>/coverage/lcov-report/index.html`  
- Contexto (commit/Node/NPM): `docs/evidencias/automatizados/<YYYYMMDD-HHMMSS>/contexto.txt`  

---

## 2) Como Reproduzir

1. Instalar dependências:
   ```bash
   npm install

2. Executar a captura:
   chmod +x scripts/capture-tests.sh
   ./scripts/capture-tests.sh