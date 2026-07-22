# Laboratório 01 — Leitor Estruturado de Prints

Aplicação para receber uma captura de tela, extrair o conteúdo visível e transformar as informações em dados estruturados revisáveis.

## Ambientes

### Produção

- URL: https://programa-leitor-de-prints.vercel.app
- Versão: fundação anterior, sem OCR

### Preview da integração OCR

- URL: https://programa-leitor-de-prints-korzf10t8-predix-ai-br.vercel.app
- Estado: `READY`
- Lint: aprovado
- TypeScript: aprovado
- Build: aprovado
- Resposta HTTP: `200`

## Estado atual

- Item em andamento: `LEA-100`
- Fase: extração OCR
- Upload e pré-visualização: implementados
- Validação PNG/JPG e 10 MB: implementada
- OCR local: integrado com Tesseract.js 7
- Idiomas: português e inglês
- Texto bruto: exibido e editável
- Confiança: exibida quando disponível
- JSON preliminar: arquivo, texto, linhas e confiança
- Supabase: não configurado
- Promoção para produção: pendente de teste e aprovação

## Fluxo atual

```text
Upload da imagem
    ↓
Validação local
    ↓
OCR no navegador
    ↓
Texto bruto + confiança
    ↓
JSON preliminar
    ↓
Revisão do usuário
```

## Arquitetura inicial

- Frontend: Next.js + React + TypeScript
- OCR: Tesseract.js executado no navegador
- Hospedagem: Vercel
- Banco e armazenamento futuros: Supabase
- Estruturação: regras locais no MVP; IA como evolução futura

## Executar localmente

Requisito: Node.js 20.9 ou superior.

```bash
npm install
npm run dev
```

Validações:

```bash
npm run lint
npm run build
```

O comando `npm run build` também executa o lint antes da compilação.

## Estrutura preliminar

```json
{
  "arquivo": "print.png",
  "texto_bruto": "...",
  "linhas": ["..."],
  "confianca": 0.92,
  "processado_localmente": true
}
```

## Privacidade

- A imagem é processada localmente no navegador.
- O aplicativo não envia nem armazena o print nesta etapa.
- O mecanismo e os arquivos de idioma do OCR podem ser baixados pela Internet na primeira execução.
- Persistência exige autorização explícita.

## Limitações atuais

- A precisão depende da nitidez, resolução, contraste e tamanho do texto.
- O JSON ainda não identifica automaticamente campos, datas, valores ou tabelas.
- A integração OCR precisa ser testada com imagens reais antes da promoção para produção.

## Documentação

- [Estado do projeto](PROJECT_STATE.md)
- [Roadmap](ROADMAP.md)
- [Constituição](docs/CONSTITUICAO_DO_PROJETO.md)
- [Decisões](docs/DECISOES.md)
- [Procedimentos](docs/SKILLS.md)
- [Manual operacional](docs/MANUAL_DO_PROJETO.md)
- [Changelog](CHANGELOG.md)
