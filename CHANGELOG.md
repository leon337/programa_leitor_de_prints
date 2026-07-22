# Changelog

## [Não publicado]

### Versão 0.3.0 — OCR aprimorado para reteste

#### Adicionado

- Recorte local por margens superior, direita, inferior e esquerda.
- Presets de recorte para tela inteira e conteúdo central.
- Prévia comparativa da imagem original e pré-processada.
- Ampliação automática antes do OCR.
- Processamento em escala de cinza com contraste ajustável.
- Redução leve de ruído e inversão automática para fundos escuros.
- Modo de alto contraste com limiarização automática.
- Filtro configurável por confiança mínima das palavras.
- Filtragem de símbolos sem conteúdo significativo.
- Organização espacial por linhas, colunas e blocos.
- Modos automático, uma coluna e duas colunas.
- Texto filtrado separado do texto bruto.
- Detecção inicial de títulos, cabeçalhos e campos chave-valor.
- Coordenadas percentuais dos blocos no JSON.
- Indicador de qualidade geral com confiança média, palavras mantidas e itens descartados.
- Novo preview: `https://programa-leitor-de-prints-opzna7eml-predix-ai-br.vercel.app`.

#### Validado

- `npm run lint`: aprovado na Vercel.
- Compilação Next.js: aprovada.
- Verificação TypeScript: aprovada.
- Geração estática: aprovada.
- Deployment `dpl_pSPq8Sv6n4ZC6QcBjt8qFLHKwEhj`: `READY`.
- Resposta HTTP do novo preview: `200`.

#### Diagnóstico registrado

- Primeiro teste real: execução funcional aprovada.
- Precisão geral: parcial.
- Confiança média observada: aproximadamente 75%.
- Falhas registradas: ruído externo, acentos, mistura de colunas e ausência de estrutura semântica final.
- Diagnóstico e correções aprovados pelo usuário.

### Versão 0.2.0 — Integração OCR inicial

#### Adicionado

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
- Preview OCR inicial em `https://programa-leitor-de-prints-korzf10t8-predix-ai-br.vercel.app`.

### Segurança e privacidade

- A imagem, o recorte e o OCR permanecem no navegador.
- Nenhum print é enviado nem armazenado.
- O Supabase permanece não configurado.
- A versão 0.3.0 permanece em preview; a produção não foi substituída.

### Pendente

- Reteste funcional com a mesma imagem do primeiro diagnóstico.
- Testes com imagens claras, escuras e textos pequenos.
- Aprovação do comportamento do OCR.
- Normalização de datas, números e tabelas.
- Exportação JSON.
- Autorização explícita antes de qualquer promoção para produção.
