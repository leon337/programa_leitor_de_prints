# Roadmap

## Fase 1 — Fundação do MVP

Status: Em andamento

- [x] Criar repositório e projeto no Linear.
- [x] Criar branch da LEA-100.
- [x] Criar estrutura Next.js com TypeScript.
- [x] Criar interface de upload e pré-visualização.
- [x] Validar PNG/JPG e limite de tamanho.
- [x] Validar instalação das dependências na Vercel.
- [x] Validar TypeScript e build de produção na Vercel.
- [ ] Executar `npm run lint` separadamente.

## Fase 2 — Extração OCR

- [ ] Integrar mecanismo de OCR.
- [ ] Exibir texto bruto.
- [ ] Exibir confiança da leitura quando disponível.
- [ ] Tratar erros e imagens sem texto.

## Fase 3 — Estruturação

- [ ] Identificar linhas, blocos, campos e valores.
- [ ] Normalizar datas e números.
- [ ] Produzir JSON estruturado.
- [ ] Permitir revisão manual.

## Fase 4 — Exportação e persistência

- [ ] Exportar resultado em JSON.
- [ ] Definir política de armazenamento.
- [ ] Integrar Supabase após autorização explícita.

## Fase 5 — Publicação

- [x] Autorizar e criar o projeto na Vercel.
- [x] Publicar a fundação e obter estado `READY`.
- [x] Verificar a aplicação publicada com HTTP 200.
- [ ] Executar testes de aceitação completos.
- [ ] Preparar versão demonstrável do MVP com OCR.
