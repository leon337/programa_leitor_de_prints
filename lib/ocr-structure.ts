import type { ProcessedImageMetadata } from "./image-processing";

export type LayoutMode = "auto" | "single-column" | "two-columns";

export type BoundingBox = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
};

export type StructuredBlock = {
  id: string;
  column: number;
  text: string;
  lines: string[];
  confidence: number;
  bboxPercent: BoundingBox;
};

export type StructuredColumn = {
  order: number;
  blocks: StructuredBlock[];
};

export type QualityResult = {
  score: number;
  label: "alta" | "média" | "baixa";
  averageWordConfidence: number;
  retainedWordRatio: number;
  discardedTokens: number;
  retainedWords: number;
  totalTokens: number;
};

export type OcrDocument = {
  file: string;
  rawText: string;
  filteredText: string;
  lines: string[];
  ocrConfidence: number;
  generalQuality: QualityResult;
  structuredData: {
    titles: string[];
    header: string[];
    columns: StructuredColumn[];
    detectedFields: Record<string, string>;
  };
  processing: ProcessedImageMetadata & {
    layoutMode: LayoutMode;
    detectedColumns: number;
    minimumWordConfidence: number;
  };
  localProcessing: true;
};

type TsvWord = {
  text: string;
  confidence: number;
  page: number;
  block: number;
  paragraph: number;
  line: number;
  bbox: BoundingBox;
};

type TextLine = {
  text: string;
  confidence: number;
  block: number;
  paragraph: number;
  line: number;
  words: TsvWord[];
  bbox: BoundingBox;
};

type BuildDocumentOptions = {
  fileName: string;
  rawText: string;
  tsv: string | null | undefined;
  ocrConfidence: number;
  minimumWordConfidence: number;
  layoutMode: LayoutMode;
  imageWidth: number;
  imageHeight: number;
  processingMetadata: ProcessedImageMetadata;
};

function round(value: number, digits = 2) {
  const multiplier = 10 ** digits;
  return Math.round(value * multiplier) / multiplier;
}

function normalizeWhitespace(value: string) {
  return value
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?%])/g, "$1")
    .trim();
}

function isMeaningfulToken(text: string) {
  const compact = text.trim();
  if (!compact) {
    return false;
  }

  const alphanumeric = compact.match(/[A-Za-zÀ-ÖØ-öø-ÿ0-9]/g)?.length ?? 0;
  return alphanumeric > 0 && alphanumeric / compact.length >= 0.25;
}

function parseTsv(tsv: string | null | undefined) {
  if (!tsv) {
    return [] as TsvWord[];
  }

  const rows = tsv.split(/\r?\n/).slice(1);
  const words: TsvWord[] = [];

  for (const row of rows) {
    if (!row.trim()) {
      continue;
    }

    const columns = row.split("\t");
    if (columns.length < 12 || Number(columns[0]) !== 5) {
      continue;
    }

    const text = columns.slice(11).join("\t").trim();
    const confidence = Number(columns[10]);
    const left = Number(columns[6]);
    const top = Number(columns[7]);
    const width = Number(columns[8]);
    const height = Number(columns[9]);

    if (
      !Number.isFinite(confidence) ||
      !Number.isFinite(left) ||
      !Number.isFinite(top) ||
      !Number.isFinite(width) ||
      !Number.isFinite(height)
    ) {
      continue;
    }

    words.push({
      text,
      confidence,
      page: Number(columns[1]),
      block: Number(columns[2]),
      paragraph: Number(columns[3]),
      line: Number(columns[4]),
      bbox: {
        x0: left,
        y0: top,
        x1: left + width,
        y1: top + height,
      },
    });
  }

  return words;
}

function combineBoundingBoxes(boxes: BoundingBox[]): BoundingBox {
  return {
    x0: Math.min(...boxes.map((box) => box.x0)),
    y0: Math.min(...boxes.map((box) => box.y0)),
    x1: Math.max(...boxes.map((box) => box.x1)),
    y1: Math.max(...boxes.map((box) => box.y1)),
  };
}

function weightedConfidence(words: TsvWord[]) {
  const totalWeight = words.reduce((total, word) => total + Math.max(1, word.text.length), 0);

  if (totalWeight === 0) {
    return 0;
  }

  const total = words.reduce(
    (sum, word) => sum + word.confidence * Math.max(1, word.text.length),
    0,
  );

  return total / totalWeight;
}

function buildLines(words: TsvWord[]): TextLine[] {
  const lineGroups = new Map<string, TsvWord[]>();

  for (const word of words) {
    const key = `${word.page}:${word.block}:${word.paragraph}:${word.line}`;
    const current = lineGroups.get(key) ?? [];
    current.push(word);
    lineGroups.set(key, current);
  }

  return Array.from(lineGroups.values())
    .map((lineWords) => {
      const orderedWords = [...lineWords].sort((a, b) => a.bbox.x0 - b.bbox.x0);
      const first = orderedWords[0];

      return {
        text: normalizeWhitespace(orderedWords.map((word) => word.text).join(" ")),
        confidence: weightedConfidence(orderedWords),
        block: first.block,
        paragraph: first.paragraph,
        line: first.line,
        words: orderedWords,
        bbox: combineBoundingBoxes(orderedWords.map((word) => word.bbox)),
      };
    })
    .filter((line) => line.text)
    .sort((a, b) => {
      const verticalDifference = a.bbox.y0 - b.bbox.y0;
      return Math.abs(verticalDifference) > 8
        ? verticalDifference
        : a.bbox.x0 - b.bbox.x0;
    });
}

function median(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  const ordered = [...values].sort((a, b) => a - b);
  const middle = Math.floor(ordered.length / 2);

  return ordered.length % 2 === 0
    ? (ordered[middle - 1] + ordered[middle]) / 2
    : ordered[middle];
}

function detectColumnSplit(
  words: TsvWord[],
  imageWidth: number,
  imageHeight: number,
  layoutMode: LayoutMode,
) {
  if (layoutMode === "single-column") {
    return null;
  }

  if (layoutMode === "two-columns") {
    return imageWidth / 2;
  }

  const candidates = words.filter((word) => {
    const centerY = (word.bbox.y0 + word.bbox.y1) / 2;
    return centerY > imageHeight * 0.18;
  });

  if (candidates.length < 8) {
    return null;
  }

  const binCount = 48;
  const bins = new Array<number>(binCount).fill(0);

  for (const word of candidates) {
    const start = Math.max(0, Math.floor((word.bbox.x0 / imageWidth) * binCount));
    const end = Math.min(
      binCount - 1,
      Math.ceil((word.bbox.x1 / imageWidth) * binCount),
    );

    for (let index = start; index <= end; index += 1) {
      bins[index] += 1;
    }
  }

  const searchStart = Math.floor(binCount * 0.32);
  const searchEnd = Math.ceil(binCount * 0.68);
  let bestBin = searchStart;

  for (let index = searchStart + 1; index <= searchEnd; index += 1) {
    if (bins[index] < bins[bestBin]) {
      bestBin = index;
    }
  }

  const split = ((bestBin + 0.5) / binCount) * imageWidth;
  const leftWords = candidates.filter((word) => word.bbox.x1 < split).length;
  const rightWords = candidates.filter((word) => word.bbox.x0 > split).length;
  const crossingWords = candidates.filter(
    (word) => word.bbox.x0 <= split && word.bbox.x1 >= split,
  ).length;
  const averageDensity = bins.reduce((sum, value) => sum + value, 0) / bins.length;
  const valleyIsClear = bins[bestBin] <= Math.max(1, averageDensity * 0.35);
  const sidesAreUseful = leftWords >= 4 && rightWords >= 4;
  const crossingIsLimited = crossingWords <= Math.max(2, candidates.length * 0.08);

  return valleyIsClear && sidesAreUseful && crossingIsLimited ? split : null;
}

function toPercentBox(box: BoundingBox, width: number, height: number): BoundingBox {
  return {
    x0: round((box.x0 / width) * 100),
    y0: round((box.y0 / height) * 100),
    x1: round((box.x1 / width) * 100),
    y1: round((box.y1 / height) * 100),
  };
}

function buildBlocks(
  lines: TextLine[],
  column: number,
  imageWidth: number,
  imageHeight: number,
): StructuredBlock[] {
  if (lines.length === 0) {
    return [];
  }

  const lineHeights = lines.map((line) => line.bbox.y1 - line.bbox.y0);
  const typicalLineHeight = Math.max(8, median(lineHeights));
  const blocks: TextLine[][] = [];
  let current: TextLine[] = [];

  for (const line of lines) {
    const previous = current.at(-1);
    const verticalGap = previous ? line.bbox.y0 - previous.bbox.y1 : 0;
    const changedTesseractBlock = previous ? line.block !== previous.block : false;
    const shouldStartNewBlock =
      current.length > 0 &&
      (verticalGap > typicalLineHeight * 1.65 ||
        (changedTesseractBlock && verticalGap > typicalLineHeight * 0.55));

    if (shouldStartNewBlock) {
      blocks.push(current);
      current = [];
    }

    current.push(line);
  }

  if (current.length > 0) {
    blocks.push(current);
  }

  return blocks.map((blockLines, index) => {
    const words = blockLines.flatMap((line) => line.words);
    const bbox = combineBoundingBoxes(blockLines.map((line) => line.bbox));

    return {
      id: `col-${column}-block-${index + 1}`,
      column,
      text: blockLines.map((line) => line.text).join("\n"),
      lines: blockLines.map((line) => line.text),
      confidence: round(weightedConfidence(words), 1),
      bboxPercent: toPercentBox(bbox, imageWidth, imageHeight),
    };
  });
}

function detectFields(lines: TextLine[]) {
  const fields: Record<string, string> = {};

  for (const line of lines) {
    const match = line.text.match(/^([^:]{2,60}):\s*(.+)$/);
    if (!match) {
      continue;
    }

    const key = normalizeWhitespace(match[1]).toLowerCase().replace(/\s+/g, "_");
    const value = normalizeWhitespace(match[2]);

    if (key && value && !fields[key]) {
      fields[key] = value;
    }
  }

  return fields;
}

function detectTitles(lines: TextLine[]) {
  if (lines.length === 0) {
    return [] as string[];
  }

  const typicalHeight = Math.max(
    1,
    median(lines.map((line) => line.bbox.y1 - line.bbox.y0)),
  );

  return lines
    .filter((line) => {
      const height = line.bbox.y1 - line.bbox.y0;
      const shortEnough = line.text.length >= 3 && line.text.length <= 90;
      const looksUppercase =
        line.text.length <= 50 && line.text === line.text.toLocaleUpperCase("pt-BR");
      return shortEnough && (height >= typicalHeight * 1.3 || looksUppercase);
    })
    .map((line) => line.text)
    .filter((title, index, titles) => titles.indexOf(title) === index)
    .slice(0, 12);
}

function buildQuality(
  allTokens: TsvWord[],
  retainedWords: TsvWord[],
  blockCount: number,
): QualityResult {
  const meaningfulTokens = allTokens.filter((word) => isMeaningfulToken(word.text));
  const averageWordConfidence = weightedConfidence(retainedWords);
  const retainedWordRatio =
    meaningfulTokens.length === 0 ? 0 : retainedWords.length / meaningfulTokens.length;
  const structureScore = blockCount > 0 ? 100 : 0;
  const score = clampQuality(
    averageWordConfidence * 0.75 + retainedWordRatio * 100 * 0.15 + structureScore * 0.1,
  );

  return {
    score: round(score, 1),
    label: score >= 85 ? "alta" : score >= 65 ? "média" : "baixa",
    averageWordConfidence: round(averageWordConfidence, 1),
    retainedWordRatio: round(retainedWordRatio, 3),
    discardedTokens: Math.max(0, allTokens.length - retainedWords.length),
    retainedWords: retainedWords.length,
    totalTokens: allTokens.length,
  };
}

function clampQuality(value: number) {
  return Math.min(100, Math.max(0, value));
}

function fallbackLines(rawText: string): TextLine[] {
  return rawText
    .split(/\r?\n/)
    .map((text) => normalizeWhitespace(text))
    .filter(Boolean)
    .map((text, index) => ({
      text,
      confidence: 0,
      block: index + 1,
      paragraph: 1,
      line: 1,
      words: [],
      bbox: { x0: 0, y0: index * 20, x1: 100, y1: index * 20 + 16 },
    }));
}

export function buildOcrDocument(options: BuildDocumentOptions): OcrDocument {
  const allTokens = parseTsv(options.tsv);
  const retainedWords = allTokens.filter(
    (word) =>
      word.confidence >= options.minimumWordConfidence && isMeaningfulToken(word.text),
  );
  const lines = retainedWords.length > 0 ? buildLines(retainedWords) : fallbackLines(options.rawText);
  const split = detectColumnSplit(
    retainedWords,
    options.imageWidth,
    options.imageHeight,
    options.layoutMode,
  );

  const headerLines: TextLine[] = [];
  const columnLines = new Map<number, TextLine[]>();

  for (const line of lines) {
    if (!split) {
      const current = columnLines.get(1) ?? [];
      current.push(line);
      columnLines.set(1, current);
      continue;
    }

    const crossesSplit = line.bbox.x0 < split && line.bbox.x1 > split;
    const isNearTop = line.bbox.y0 < options.imageHeight * 0.24;

    if (crossesSplit && isNearTop) {
      headerLines.push(line);
      continue;
    }

    const centerX = (line.bbox.x0 + line.bbox.x1) / 2;
    const column = centerX < split ? 1 : 2;
    const current = columnLines.get(column) ?? [];
    current.push(line);
    columnLines.set(column, current);
  }

  const columns = Array.from(columnLines.entries())
    .sort(([first], [second]) => first - second)
    .map(([column, currentLines]) => ({
      order: column,
      blocks: buildBlocks(
        currentLines.sort((a, b) => a.bbox.y0 - b.bbox.y0),
        column,
        options.imageWidth,
        options.imageHeight,
      ),
    }));

  const blocks = columns.flatMap((column) => column.blocks);
  const filteredText = [
    ...headerLines.map((line) => line.text),
    ...columns.flatMap((column) => column.blocks.map((block) => block.text)),
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    file: options.fileName,
    rawText: options.rawText,
    filteredText,
    lines: lines.map((line) => line.text),
    ocrConfidence: round(options.ocrConfidence / 100, 4),
    generalQuality: buildQuality(allTokens, retainedWords, blocks.length),
    structuredData: {
      titles: detectTitles(lines),
      header: headerLines.map((line) => line.text),
      columns,
      detectedFields: detectFields(lines),
    },
    processing: {
      ...options.processingMetadata,
      layoutMode: options.layoutMode,
      detectedColumns: columns.length,
      minimumWordConfidence: options.minimumWordConfidence,
    },
    localProcessing: true,
  };
}
