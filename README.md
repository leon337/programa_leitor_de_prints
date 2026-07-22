# Laboratório 01 — Leitor Estruturado de Prints

Aplicação para receber uma captura de tela, extrair o conteúdo visível e transformar as informações em dados estruturados revisáveis.

## Aplicação publicada

- URL: https://programa-leitor-de-prints.vercel.app
- Estado do deployment: `READY`
- Versão atual: fundação do MVP, ainda sem OCR

## Estado atual

- Item em andamento: `LEA-100`
- Fase: fundação do MVP
- Interface de upload: criada
- Validação PNG/JPG: criada
- Pré-visualização local: criada
- Build de produção: validado na Vercel
- TypeScript: validado na Vercel
- Lint separado: pendente
- OCR: pendente
- Supabase: não configurado
- Vercel: configurada e publicada

## Objetivo do MVP

1. Enviar uma imagem em PNG ou JPG.
2. Extrair textos da imagem com OCR.
3. Identificar blocos como títulos, campos, valores, datas, listas e tabelas.
4. Exibir o texto original e o resultado estruturado.
5. Permitir revisão e exportação em JSON.

## Fluxo

```text
Upload da imagem
    ↓
Validação e preparação
    ↓
OCR
    ↓
Organização semântica
    ↓
JSON estruturado
    ↓
Revisão pelo usuário
```

## Arquitetura inicial

- Frontend: Next.js + TypeScript
- Hospedagem: Vercel
- Banco e armazenamento futuros: Supabase
- OCR inicial: mecanismo configurável
- Estruturação: regras locais no MVP; IA como evolução

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

## Entidade principal

```json
{
  "arquivo": "print.png",
  "texto_bruto": "...",
  "blocos": [],
  "dados_estruturados": {},
  "confianca": 0.0,
  "criado_em": "ISO-8601"
}
```

## Privacidade

- A fundação atual processa apenas a seleção e a pré-visualização local.
- A imagem não é enviada nem armazenada.
- Persistência exige autorização explícita.

## Documentação

- [Estado do projeto](PROJECT_STATE.md)
- [Roadmap](ROADMAP.md)
- [Constituição](docs/CONSTITUICAO_DO_PROJETO.md)
- [Decisões](docs/DECISOES.md)
- [Procedimentos](docs/SKILLS.md)
- [Manual operacional](docs/MANUAL_DO_PROJETO.md)
- [Changelog](CHANGELOG.md)
