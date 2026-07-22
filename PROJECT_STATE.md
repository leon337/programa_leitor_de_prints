# Estado do Projeto

## Identificação

- Projeto: Laboratório 01 — Leitor Estruturado de Prints
- Repositório: `leon337/programa_leitor_de_prints`
- Item atual: `LEA-100`
- Status: Em andamento
- Branch de trabalho: `leonpcsn/lea-100-lab-01-definir-e-implementar-o-mvp-do-leitor-de-prints`

## Objetivo atual

Melhorar a precisão do OCR local com recorte, pré-processamento, filtragem por confiança e organização espacial antes da aprovação funcional.

## Diagnóstico aprovado

O primeiro teste funcional com uma imagem real foi aprovado como diagnóstico, não como aprovação final do OCR.

- Execução do OCR: `PASS`.
- Texto bruto, confiança e JSON preliminar: `PASS`.
- Precisão geral: `PARCIAL`.
- Separação de colunas: `FAIL`.
- Remoção de ruído externo: `FAIL`.
- Estruturação semântica: ainda não implementada naquele teste.
- Confiança média observada: aproximadamente 75%.

Foram identificados leitura indevida de navegador e sistema, erros em acentos, mistura entre colunas, símbolos tratados como texto e ausência de estrutura semântica real.

## Correções implementadas

- Recorte local por margens superior, direita, inferior e esquerda.
- Presets para tela inteira e conteúdo central.
- Ampliação da imagem antes do OCR.
- Conversão para escala de cinza e aumento de contraste.
- Redução leve de ruído.
- Inversão automática para imagens com fundo escuro.
- Modo de alto contraste com limiarização automática.
- Filtro configurável por confiança mínima das palavras.
- Remoção de tokens sem conteúdo alfanumérico significativo.
- Uso das posições retornadas pelo OCR para organizar linhas, colunas e blocos.
- Modos automático, uma coluna e duas colunas.
- Separação entre texto bruto, texto filtrado e dados estruturados.
- Indicador de qualidade geral com palavras mantidas, itens descartados e confiança média.
- Dados estruturados com títulos, cabeçalho, colunas, blocos, campos e coordenadas percentuais.
- Prévia comparativa entre imagem original e imagem pré-processada.
- A imagem permanece local no navegador e não é persistida.

## Infraestrutura

### Produção atual

- URL: `https://programa-leitor-de-prints.vercel.app`
- Deployment: `dpl_7TUVwu6GdSvSsg8MSF6wtFwfQcTn`
- Conteúdo: fundação anterior, sem OCR.
- Situação: não alterada.

### Preview anterior do OCR

- URL: `https://programa-leitor-de-prints-korzf10t8-predix-ai-br.vercel.app`
- Deployment: `dpl_E9ddHmDoaNVB8GwEj3R79y5ojvsj`

### Novo preview para reteste

- URL: `https://programa-leitor-de-prints-opzna7eml-predix-ai-br.vercel.app`
- Deployment: `dpl_pSPq8Sv6n4ZC6QcBjt8qFLHKwEhj`
- Estado: `READY`
- Resposta HTTP: `200`
- Lint: aprovado.
- Build Next.js: aprovado.
- TypeScript: aprovado.
- Ambiente: preview isolado, sem promoção para produção.

## Pendente

- Repetir o teste com a mesma imagem usada no diagnóstico.
- Comparar texto bruto, texto filtrado, colunas, blocos e qualidade geral.
- Testar imagens claras, escuras e com textos pequenos.
- Ajustar os limiares conforme os resultados do reteste.
- Aprovar ou reprovar o comportamento do OCR.
- Continuar a normalização de datas, números e tabelas após a aprovação da precisão.
- Criar editor e exportação JSON.
- Preparar Supabase somente após autorização explícita.

## Bloqueios

Nenhum bloqueio estrutural. A aprovação funcional continua bloqueada até o reteste humano confirmar melhoria suficiente na precisão e na organização espacial.

## Próxima etapa

Executar o reteste no novo preview com a mesma imagem do primeiro diagnóstico e registrar a comparação antes de avançar.
