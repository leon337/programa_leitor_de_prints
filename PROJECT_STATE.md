# Estado do Projeto

## Identificação

- Projeto: Laboratório 01 — Leitor Estruturado de Prints
- Repositório: `leon337/programa_leitor_de_prints`
- Item atual: `LEA-100`
- Status: Em andamento
- Branch de trabalho: `leonpcsn/lea-100-lab-01-definir-e-implementar-o-mvp-do-leitor-de-prints`

## Objetivo atual

Concluir os testes complementares do OCR com uma imagem clara e uma imagem contendo tabela, formulário ou estrutura diferente. Depois, consolidar a matriz de resultados e preparar a correção do normalizador espacial e semântico.

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

## Teste complementar — texto pequeno reprovado

O teste foi executado com uma captura da plataforma Olymptrade contendo menus, ativos, gráfico, escala de preços, painel de negociação, botões e textos pequenos distribuídos em várias regiões.

### Configuração utilizada

- Arquivo: `Captura de tela_2026-07-22_00-54-52.png`.
- Recorte superior: 13%.
- Recorte direito: 0%.
- Recorte inferior: 7%.
- Recorte esquerdo: 0%.
- Pré-processamento: equilibrado.
- Organização espacial solicitada: duas colunas.
- Confiança mínima por palavra: 40%.
- Inversão automática: habilitada; a imagem clara não foi invertida.

### Resultado técnico apresentado pelo aplicativo

- Confiança global do OCR: 90%.
- Qualidade geral calculada: 92,4%.
- Confiança média das palavras mantidas: 89,8%.
- Palavras mantidas: 5.
- Itens descartados: 3.
- Total de itens informado: 8.
- Colunas detectadas: 1.
- Texto filtrado reconhecido: `D 6.143,17`, `Conta demo` e `70.6803`.
- Campos detectados: vazio.

### Diagnóstico aprovado

- Execução do mecanismo OCR: `PASS`.
- Reconhecimento de texto pequeno: `FAIL`.
- Cobertura do conteúdo visível: `FAIL`.
- Organização espacial: `FAIL`.
- Estruturação semântica: `FAIL`.
- Resultado geral do teste: `REPROVADO`.

A qualidade calculada de 92,4% foi considerada superestimada, pois a maior parte do conteúdo visível não foi reconhecida. Também foram registradas as seguintes inconsistências:

- `retainedWords: 5`, `totalTokens: 8` e `retainedWordRatio: 1` não representam uma proporção coerente;
- o modo solicitado foi `two-columns`, mas apenas uma coluna foi detectada;
- saldo e preço foram classificados como títulos;
- `campos_detectados` permaneceu vazio;
- a métrica atual avalia confiança dos poucos textos reconhecidos, mas não mede cobertura real da imagem.

O usuário aprovou formalmente este diagnóstico como reprovado e não autorizou alterações no código nesta etapa.

## Correções implementadas anteriormente

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

## Matriz complementar

- Reteste da mesma imagem: aprovado.
- Imagem com texto pequeno: executado e reprovado.
- Imagem clara e simples: pendente.
- Imagem com tabela, formulário ou outra estrutura diferente: pendente.
- Consolidação única dos resultados: pendente.

## Normalizador — correções preparadas para avaliação posterior

Após a conclusão dos testes restantes, avaliar e corrigir:

- reconstrução de títulos quebrados;
- ordem de leitura vertical e horizontal;
- linhas que atravessam duas colunas;
- elementos próximos à divisão central;
- segmentação da imagem em regiões independentes;
- ampliação e OCR de cada região em múltiplas passagens;
- recomposição dos resultados por coordenadas;
- classificação de título, descrição, etapa, lista, botão, selo e campos de interface;
- qualidade técnica separada da qualidade semântica e da cobertura;
- correção da fórmula de proporção de palavras mantidas;
- preenchimento de `campos_detectados`;
- normalização posterior de datas, números e tabelas.

## Restrições preservadas

- Não alterar o código antes da conclusão dos testes autorizados.
- Não promover o OCR para produção.
- Não configurar Supabase.
- Não concluir a LEA-100.

## Bloqueios

Nenhum bloqueio estrutural. A conclusão da matriz depende do fornecimento e processamento de uma imagem clara e simples e de uma imagem com tabela, formulário ou estrutura diferente. A aprovação geral continua bloqueada até a consolidação dos testes e a futura revisão do normalizador.

## Próxima etapa

Receber e testar uma imagem clara e simples e uma imagem com tabela, formulário ou estrutura diferente. Depois, registrar uma comparação única da matriz antes de qualquer alteração no código.