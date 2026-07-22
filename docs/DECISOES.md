# Decisões do Projeto

## DEC-001 — Stack inicial

Status: Aprovada

A fundação do MVP utiliza Next.js, React e TypeScript, com App Router.

## DEC-002 — Processamento e melhoria do OCR

Status: Aprovada e implementada para reteste

O OCR utiliza Tesseract.js 7 no navegador, com os idiomas português e inglês. A imagem permanece local e somente os recursos técnicos do mecanismo e dos idiomas são baixados durante a primeira execução.

Após o primeiro teste funcional, o usuário aprovou o diagnóstico de precisão parcial e autorizou a seguinte estratégia:

- recorte configurável da área útil;
- ampliação da imagem;
- escala de cinza, contraste e redução leve de ruído;
- inversão automática de imagens escuras;
- modo de alto contraste com limiarização automática;
- filtragem de palavras por confiança e conteúdo significativo;
- uso das posições do OCR para separar linhas, colunas e blocos;
- preservação do texto bruto em saída separada;
- geração de texto filtrado e dados estruturados;
- indicador de qualidade geral diferente da confiança global do OCR.

A estratégia deve ser validada por reteste humano antes de ser considerada aprovada para produção.

## DEC-003 — Privacidade das imagens

Status: Aprovada

A imagem selecionada, o recorte e o pré-processamento permanecem no navegador. Nenhum arquivo é enviado ao servidor ou armazenado sem autorização explícita.

## DEC-004 — Infraestrutura externa

Status: Aprovada e atualizada

A Vercel foi autorizada explicitamente em 2026-07-21. A fundação permanece publicada em produção e as versões de OCR permanecem em deployments de preview isolados. O Supabase permanece não configurado e continua exigindo autorização específica.

## DEC-005 — Fluxo operacional

Status: Aprovada

GitHub mantém o estado técnico permanente e Linear acompanha a execução. A tarefa atual é a LEA-100, que não pode ser concluída antes do reteste, da aprovação dos critérios e da sincronização final.
