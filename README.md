# Laboratório 01 — Leitor Estruturado de Prints

Aplicação para receber uma captura de tela, extrair o conteúdo visível e transformar as informações em dados estruturados.

## Objetivo do MVP

1. Enviar uma imagem em PNG ou JPG.
2. Extrair textos da imagem com OCR.
3. Identificar blocos como títulos, campos, valores, datas, listas e tabelas.
4. Exibir o texto original e o resultado estruturado.
5. Permitir exportação em JSON.

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
- Banco e armazenamento: Supabase
- OCR inicial: Tesseract.js ou serviço externo configurável
- Estruturação: regras locais no MVP; IA como evolução

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

## Limites do MVP

- Não garantir leitura perfeita de imagens borradas ou cortadas.
- Não interpretar automaticamente qualquer tipo de documento com precisão total.
- Não armazenar imagens sem autorização explícita do usuário.

## Estado

Planejamento inicial.