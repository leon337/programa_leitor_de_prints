# Estado do Projeto

## Identificação

- Projeto: Laboratório 01 — Leitor Estruturado de Prints
- Repositório: `leon337/programa_leitor_de_prints`
- Item atual: `LEA-100`
- Status: Em andamento
- Branch de trabalho: `leonpcsn/lea-100-lab-01-definir-e-implementar-o-mvp-do-leitor-de-prints`

## Objetivo atual

Executar a matriz complementar de testes do OCR e, após a coleta dos resultados, preparar a correção do normalizador espacial e semântico.

## Diagnóstico inicial

O primeiro teste funcional com uma imagem real foi aprovado como diagnóstico, não como aprovação final do OCR.

- Execução do OCR: `PASS`.
- Texto bruto, confiança e JSON preliminar: `PASS`.
- Precisão geral: `PARCIAL`.
- Separação de colunas: `FAIL`.
- Remoção de ruído externo: `FAIL`.
- Confiança média observada: aproximadamente 75%.

## Reteste da mesma imagem — aprovado

O reteste foi executado com recorte, pré-processamento equilibrado, organização em duas colunas, confiança mínima de 60% e inversão automática.

### Configuração utilizada

- Recorte superior: 10%.
- Recorte direito: 3%.
- Recorte inferior: 7%.
- Recorte esquerdo: 3%.
- Pré-processamento: equilibrado.
- Organização espacial: duas colunas.
- Confiança mínima por palavra: 60%.
- Inversão automática: ativada.

### Resultados

- Confiança global do OCR: 90%.
- Confiança média das palavras mantidas: 95,2%.
- Qualidade geral calculada: 96,2%.
- Palavras mantidas: 63.
- Itens descartados: 8.
- Colunas detectadas: 2.
- Ruídos do navegador e do sistema: removidos pelo recorte.
- Reconhecimento do conteúdo principal: aprovado para esta imagem.
- Separação exata de blocos e ordem de leitura: parcial.
- Estrutura semântica e campos detectados: ainda incompletos.

O usuário aprovou formalmente o resultado deste reteste como validação da mesma imagem. Essa aprovação não conclui a Fase 2 nem a LEA-100.

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
- Indicador de qualidade geral.
- Dados estruturados com títulos, cabeçalho, colunas, blocos, campos e coordenadas percentuais.
- Prévia comparativa entre imagem original e imagem pré-processada.
- Processamento local sem persistência.

## Infraestrutura

### Produção atual

- URL: `https://programa-leitor-de-prints.vercel.app`
- Deployment: `dpl_7TUVwu6GdSvSsg8MSF6wtFwfQcTn`
- Conteúdo: fundação anterior, sem OCR.
- Situação: não alterada.

### Preview para testes

- URL: `https://programa-leitor-de-prints-opzna7eml-predix-ai-br.vercel.app`
- Deployment: `dpl_pSPq8Sv6n4ZC6QcBjt8qFLHKwEhj`
- Estado: `READY`.
- Resposta HTTP: `200`.
- Lint: aprovado.
- Build Next.js: aprovado.
- TypeScript: aprovado.
- Ambiente: preview isolado, sem promoção para produção.

## Testes complementares autorizados

- Imagem clara e simples.
- Imagem com texto pequeno.
- Imagem com tabela, formulário ou outra estrutura diferente.

Os testes ainda não foram executados porque as três imagens representativas não foram fornecidas nesta etapa.

## Normalizador — correções preparadas para a próxima execução

Após os testes complementares, avaliar e corrigir:

- reconstrução de títulos quebrados;
- ordem de leitura vertical e horizontal;
- linhas que atravessam duas colunas;
- elementos próximos à divisão central;
- classificação de título, descrição, etapa, lista, botão e selo;
- qualidade técnica separada da qualidade semântica;
- preenchimento de `campos_detectados`;
- normalização posterior de datas, números e tabelas.

## Restrições preservadas

- Não promover o OCR para produção.
- Não configurar Supabase.
- Não concluir a LEA-100.

## Bloqueios

Nenhum bloqueio estrutural. A execução da matriz complementar depende do fornecimento das imagens de teste. A aprovação funcional completa permanece bloqueada até esses testes e a revisão do normalizador.

## Próxima etapa

Receber as três imagens representativas, executar os testes complementares no preview e registrar uma comparação única antes de alterar o normalizador.