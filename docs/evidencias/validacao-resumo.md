# Validação com 5 colegas — Resumo

> Período: 07–10/11/2025  
> Versão testada: `v1.0.0-mvp`

## Participantes e arquivos
- 01 — Bruno — 07/11/2025 `docs/evidencias/testes-colegas/12-bruno-07-11-2025.md`
- 02 — Flávia — 07/11/2025 → `docs/evidencias/testes-colegas/02-flavia-07-11-2025.md`
- 03 — Rodrigo — 10/11/2025 → `docs/evidencias/testes-colegas/03-rodrigo-10-11-2025.md`
- 04 — Sabrina — 10/11/2025 → `docs/evidencias/testes-colegas/04-sabrina-10-11-2025.md`
- 05 — Vanessa — 10/11/2025 → `docs/evidencias/testes-colegas/05-vanessa-10-11-2025.md`

## Achados recorrentes
1. **Carrinho: decremento unitário** — botão “remover” apaga todas as unidades do item.  
   - *Ação sugerida:* adicionar botões **(+/–)** por linha e manter o botão de remover total.
2. **Feedback visual ao adicionar** — uso de `alert` é intrusivo; sugerem **toast**/badge de quantidade no menu.
3. **Responsividade** — em zoom alto/mobile, a vitrine “estoura”.  
   - *Ação sugerida:* quebrar descrição longa (`word-break`) e ajustar paddings.

## Itens positivos
- Fluxo de compra simples e direto, com mensagens claras.
- Bônus de retirada aplicado corretamente no checkout.
- Lançamento de pontos no pagamento validado por pares.
- Bloqueio de avaliação duplicada funcionando (409).

## Melhorias aplicadas (preencher após correção)
- [ ] Carrinho com **(+/–)** e cálculo em tempo real. *(commit: …)*
- [ ] **Toast** ao adicionar item + badge de quantidade no menu. *(commit: …)*
- [ ] Ajustes de **responsividade** (grid/word-break/padding). *(commit: …)*
- [ ] **Placeholder** `no-image.png` e revisão de seeds. *(commit: …)*

## Conclusão
O MVP atendeu ao roteiro de ponta a ponta em todos os ambientes testados. As melhorias sugeridas são pontuais de UX e não impedem o uso. Após aplicar as quatro correções acima, recomenda-se uma **nova execução do script de testes** e atualização das evidências.
