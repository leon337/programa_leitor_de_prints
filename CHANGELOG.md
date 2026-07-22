# Changelog

## [Não publicado]

### Adicionado

- Fundação do projeto Next.js com TypeScript.
- Interface para seleção e pré-visualização de PNG/JPG.
- Validação local de formato e limite de 10 MB.
- OCR local com Tesseract.js 7.
- Idiomas português e inglês no reconhecimento.
- Indicador de progresso e estado do OCR.
- Exibição e edição do texto bruto extraído.
- Exibição do nível de confiança quando disponível.
- Estrutura preliminar em JSON com arquivo, texto, linhas e confiança.
- Tratamento inicial de falhas e imagens sem texto.
- Workflow de CI para lint e build.
- Projeto `programa-leitor-de-prints` na Vercel.
- Preview OCR disponível em `https://programa-leitor-de-prints-korzf10t8-predix-ai-br.vercel.app`.

### Validado

- `npm run lint` concluído com sucesso no ambiente da Vercel.
- Compilação Next.js concluída com sucesso.
- Verificação TypeScript concluída com sucesso.
- Geração das páginas estáticas concluída.
- Preview criado com estado `READY` e resposta HTTP 200.

### Segurança e privacidade

- A imagem permanece no navegador e não é enviada nem armazenada.
- O Supabase permanece não configurado.
- A nova versão permanece em preview; a produção não foi substituída.

### Pendente

- Teste funcional do OCR com imagens reais.
- Normalização de campos, datas, números e tabelas.
- Exportação JSON.
- Aprovação antes da promoção para produção.
