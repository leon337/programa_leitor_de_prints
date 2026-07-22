# Decisões do Projeto

## DEC-001 — Stack inicial

Status: Aprovada

A fundação do MVP utiliza Next.js, React e TypeScript, com App Router.

## DEC-002 — Processamento inicial

Status: Aprovada e implementada parcialmente

O OCR inicial utiliza Tesseract.js 7 no navegador, com os idiomas português e inglês. A imagem permanece local e somente os recursos técnicos do mecanismo e dos idiomas são baixados durante a primeira execução. A estruturação completa continuará com regras locais antes de uma eventual camada de IA.

## DEC-003 — Privacidade das imagens

Status: Aprovada

A imagem selecionada permanece local no navegador. Nenhum arquivo é enviado ao servidor ou armazenado sem autorização explícita.

## DEC-004 — Infraestrutura externa

Status: Aprovada e atualizada

A Vercel foi autorizada explicitamente em 2026-07-21. A fundação permanece publicada em produção e a integração OCR foi validada em um deployment de preview. O Supabase permanece não configurado e continua exigindo autorização específica.

## DEC-005 — Fluxo operacional

Status: Aprovada

GitHub mantém o estado técnico permanente e Linear acompanha a execução. A tarefa atual é a LEA-100.
