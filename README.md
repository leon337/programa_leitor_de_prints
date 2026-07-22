# Laboratório 01 — Leitor Estruturado de Prints

Aplicação para receber uma captura de tela, extrair o conteúdo visível e transformar as informações em dados estruturados revisáveis.

## Ambientes

### Produção

- URL: https://programa-leitor-de-prints.vercel.app
- Versão: fundação anterior, sem OCR
- Situação: não alterada

### Preview atual para reteste

- URL: https://programa-leitor-de-prints-opzna7eml-predix-ai-br.vercel.app
- Versão: `0.3.0`
- Estado: `READY`
- Lint: aprovado
- TypeScript: aprovado
- Build: aprovado
- Resposta HTTP: `200`

### Preview anterior

- URL: https://programa-leitor-de-prints-korzf10t8-predix-ai-br.vercel.app
- Versão: OCR inicial, sem as correções de precisão

## Estado atual

- Item em andamento: `LEA-100`
- Fase: melhoria e validação da extração OCR
- Upload e pré-visualização: implementados
- Validação PNG/JPG e 10 MB: implementada
- OCR local: Tesseract.js 7 em português e inglês
- Recorte da área útil: implementado
- Ampliação, contraste e redução de ruído: implementados
- Inversão para fundos escuros: implementada
- Filtro por confiança: implementado
- Separação espacial: linhas, colunas e blocos
- Texto bruto e texto filtrado: separados
- Indicador de qualidade geral: implementado
- JSON: títulos, cabeçalho, colunas, blocos, campos e coordenadas
- Supabase: não configurado
- Promoção para produção: não autorizada
- Aprovação final do OCR: pendente de reteste

## Fluxo atual

```text
Upload da imagem
    ↓
Recorte da área útil
    ↓
Ampliação + contraste + redução de ruído
    ↓
OCR local no navegador
    ↓
Filtro por confiança e conteúdo significativo
    ↓
Separação espacial de linhas, colunas e blocos
    ↓
Texto bruto + texto filtrado + qualidade
    ↓
JSON estruturado revisável
```

## Como executar o reteste

1. Abra o preview atual.
2. Selecione a mesma imagem usada no primeiro diagnóstico.
3. Use `Conteúdo central` para excluir parte das barras externas ou ajuste as quatro margens manualmente.
4. Clique em `Atualizar prévia` e confirme visualmente o recorte.
5. Comece com pré-processamento `Equilibrado`.
6. Use organização `Duas colunas` para a imagem de teste anterior ou compare com o modo automático.
7. Mantenha a confiança mínima em `45%` no primeiro reteste.
8. Clique em `Analisar print`.
9. Compare texto bruto, texto filtrado, qualidade, colunas, blocos e JSON.

## Arquitetura

- Frontend: Next.js + React + TypeScript
- OCR: Tesseract.js executado no navegador
- Pré-processamento: Canvas API no navegador
- Estruturação espacial: TSV do OCR, coordenadas e regras locais
- Hospedagem: Vercel
- Banco e armazenamento futuros: Supabase, somente após autorização
- Camada de IA: possível evolução futura, fora do estágio atual

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

## Exemplo resumido de saída

```json
{
  "arquivo": "print.png",
  "texto_bruto": "...",
  "texto_filtrado": "...",
  "confianca_ocr": 0.86,
  "qualidade_geral": {
    "score": 82.4,
    "label": "média",
    "palavras_mantidas": 74,
    "itens_descartados": 11
  },
  "dados_estruturados": {
    "titulos": [],
    "cabecalho": [],
    "colunas": [],
    "campos_detectados": {}
  },
  "processado_localmente": true
}
```

## Privacidade

- A imagem é processada localmente no navegador.
- O recorte e a imagem pré-processada não são enviados ao servidor.
- O aplicativo não armazena o print nesta etapa.
- O mecanismo e os arquivos de idioma do OCR podem ser baixados pela Internet na primeira execução.
- Persistência exige autorização explícita.

## Limitações atuais

- A precisão ainda depende da resolução, contraste, tamanho do texto e qualidade do recorte.
- A separação de colunas e títulos utiliza heurísticas e precisa ser validada no reteste.
- Datas, números e tabelas ainda não possuem normalização completa.
- O resultado deve ser revisado por uma pessoa.
- A versão 0.3.0 não será promovida para produção antes da aprovação explícita.

## Documentação

- [Estado do projeto](PROJECT_STATE.md)
- [Roadmap](ROADMAP.md)
- [Constituição](docs/CONSTITUICAO_DO_PROJETO.md)
- [Decisões](docs/DECISOES.md)
- [Procedimentos](docs/SKILLS.md)
- [Manual operacional](docs/MANUAL_DO_PROJETO.md)
- [Changelog](CHANGELOG.md)
