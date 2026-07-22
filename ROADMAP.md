# Roadmap

## Fase 1 — Fundação do MVP

Status: Concluída

- [x] Criar repositório e projeto no Linear.
- [x] Criar branch da LEA-100.
- [x] Criar estrutura Next.js com TypeScript.
- [x] Criar interface de upload e pré-visualização.
- [x] Validar PNG/JPG e limite de tamanho.
- [x] Validar instalação das dependências na Vercel.
- [x] Validar TypeScript e build na Vercel.
- [x] Executar `npm run lint`.

## Fase 2 — Extração OCR

Status: Em andamento

- [x] Integrar Tesseract.js no navegador.
- [x] Configurar português e inglês.
- [x] Exibir progresso do processamento.
- [x] Exibir texto bruto.
- [x] Exibir confiança da leitura quando disponível.
- [x] Tratar falhas e imagens sem texto.
- [x] Executar primeiro teste com imagem real.
- [x] Registrar e aprovar o diagnóstico do primeiro teste.
- [x] Implementar recorte da área útil.
- [x] Implementar ampliação, contraste e redução de ruído.
- [x] Implementar inversão automática para fundos escuros.
- [x] Implementar filtro configurável por confiança.
- [x] Implementar separação espacial de linhas, colunas e blocos.
- [x] Implementar indicador de qualidade geral.
- [x] Retestar com a mesma imagem do primeiro diagnóstico.
- [x] Aprovar o resultado do reteste da mesma imagem.
- [ ] Testar uma imagem clara e simples.
- [x] Testar uma imagem com texto pequeno — resultado `REPROVADO` e diagnóstico aprovado.
- [ ] Testar uma imagem com tabela, formulário ou estrutura diferente.
- [ ] Consolidar a comparação da matriz de testes.
- [ ] Aprovar o comportamento geral do OCR.

## Fase 3 — Estruturação

Status: Iniciada parcialmente

- [x] Gerar estrutura preliminar com texto e linhas.
- [x] Separar texto bruto e texto filtrado.
- [x] Identificar títulos, cabeçalhos, colunas e blocos por posição.
- [x] Registrar coordenadas percentuais dos blocos.
- [x] Identificar campos simples no formato chave e valor.
- [ ] Validar a estrutura espacial na matriz complementar.
- [ ] Reconstruir títulos divididos em múltiplas linhas.
- [ ] Corrigir a ordem de leitura dos blocos.
- [ ] Impedir linhas que atravessem duas colunas.
- [ ] Tratar elementos próximos à divisão central.
- [ ] Segmentar interfaces complexas em regiões independentes.
- [ ] Executar OCR em múltiplas passagens para textos pequenos.
- [ ] Medir cobertura do conteúdo além da confiança das palavras.
- [ ] Corrigir a fórmula de proporção de palavras mantidas.
- [ ] Classificar título, descrição, etapa, lista, botão, selo e campos de interface.
- [ ] Separar qualidade técnica, qualidade semântica e cobertura.
- [ ] Preencher `campos_detectados` de forma útil.
- [ ] Normalizar datas e números.
- [ ] Identificar tabelas quando possível.
- [ ] Produzir JSON estruturado final.
- [ ] Permitir revisão manual dos campos.

## Fase 4 — Exportação e persistência

- [ ] Exportar resultado em JSON.
- [ ] Definir política de armazenamento.
- [ ] Integrar Supabase após autorização explícita.

## Fase 5 — Publicação

- [x] Criar o projeto na Vercel.
- [x] Publicar a fundação em produção.
- [x] Criar preview isolado com OCR inicial.
- [x] Criar novo preview isolado com as correções de precisão.
- [x] Validar lint, TypeScript, build e HTTP 200 no novo preview.
- [ ] Executar testes de aceitação completos.
- [ ] Promover o OCR para produção após aprovação explícita.