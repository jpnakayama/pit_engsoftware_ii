// Atualiza docs/evidencias/testes-automatizados.md com dados reais da última execução
const fs = require('fs');
const path = require('path');

const outDir = process.argv[2];
if (!outDir) {
  console.error('Use: node scripts/update-evidences.js docs/evidencias/automatizados/<timestamp>');
  process.exit(1);
}

// Lê artefatos
const ctx = fs.readFileSync(path.join(outDir, 'contexto.txt'), 'utf8');
const jestJSON = JSON.parse(fs.readFileSync(path.join(outDir, 'jest-run.json'), 'utf8'));
const covTxt = fs.readFileSync(path.join(outDir, 'jest-coverage-summary.txt'), 'utf8');

const commit = (ctx.match(/Commit:\s*(.+)/) || [])[1] || '<commit>';
const nodev = (ctx.match(/Node:\s*(.+)/) || [])[1] || '<node>';
const npm = (ctx.match(/NPM:\s*(.+)/) || [])[1] || '<npm>';
const ts = path.basename(outDir);

// Métricas Jest
const testResults = jestJSON.testResults || [];
const numSuites = testResults.length;
const summary = jestJSON.numTotalTests !== undefined ? {
  totalTests: jestJSON.numTotalTests,
  passed: jestJSON.numPassedTests,
  failed: jestJSON.numFailedTests,
  time: (jestJSON.startTime && jestJSON.success !== undefined) ? '' : ''
} : { totalTests: '?', passed: '?', failed: '?' };

// Cobertura (regex simples)
function grab(label) {
  const re = new RegExp(label + ':\\s*(\\d+\\.?\\d*)%','i');
  const m = covTxt.match(re);
  return m ? m[1] + '%' : '—';
}
const covLines = grab('Lines');
const covStmts = grab('Stmts|Statements'); // algumas versões usam Stmts
const covBranches = grab('Branches');
const covFuncs = grab('Funcs|Functions');

// Gera seção desta execução
const section = `
## Execução ${ts}

**Commit:** \`${commit}\`  
**Ambiente:** Node \`${nodev}\` / NPM \`${npm}\`  

**Resultados:**
- Suites: **${numSuites}**
- Tests: **${summary.totalTests}** | Passaram: **${summary.passed}** | Falharam: **${summary.failed}**

**Cobertura:**
- Lines: **${covLines}** | Stmts: **${covStmts}** | Branches: **${covBranches}** | Funcs: **${covFuncs}**

**Artefatos:**
- Saída: \`${outDir}/jest-run.txt\`
- JSON: \`${outDir}/jest-run.json\`
- Cobertura (resumo): \`${outDir}/jest-coverage-summary.txt\`
- Cobertura (HTML): \`${outDir}/coverage/lcov-report/index.html\`

---
`;

// Atualiza/Cria o arquivo MD
const mdFile = path.join('docs', 'evidencias', 'testes-automatizados.md');
let md = '';
if (fs.existsSync(mdFile)) {
  md = fs.readFileSync(mdFile, 'utf8');
} else {
  md = `# Evidências — Testes Automatizados (PIT II)

Este documento comprova execuções de testes com saída e cobertura versionadas.

`;
}

// Insere a nova seção no topo (após o título)
const parts = md.split('\n');
let insertAt = 1;
while (insertAt < parts.length && parts[insertAt].trim() === '') insertAt++;
parts.splice(insertAt, 0, section.trim() + '\n');
const updated = parts.join('\n');
fs.writeFileSync(mdFile, updated, 'utf8');

// Atualiza/Adiciona linha de histórico
const histHeader = '## Histórico de Execuções';
if (!updated.includes(histHeader)) {
  fs.appendFileSync(mdFile, `

${histHeader}

| Data/Hora (BRT) | Commit | Suites | Tests | Lines | Obs. |
|---|---|---|---|---|---|
`, 'utf8');
}
const histRow = `| ${ts} | ${commit} | ${numSuites} | ${summary.totalTests} | ${covLines} | Execução automatizada |\n`;
fs.appendFileSync(mdFile, histRow, 'utf8');

console.log(`✔ Atualizado ${mdFile}`);
