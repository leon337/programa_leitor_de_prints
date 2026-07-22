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
- [ ] Testar a precisão com imagens reais.
- [ ] Aprovar o comportamento do OCR.

## Fase 3 — Estruturação

- [x] Gerar estrutura preliminar com texto e linhas.
- [ ] Identificar blocos, campos e valores.
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
- [x] Criar preview isolado com OCR.
- [x] Validar lint, TypeScript, build e HTTP 200 no preview.
- [ ] Executar testes de aceitação completos.
- [ ] Promover o OCR para produção após aprovação.
