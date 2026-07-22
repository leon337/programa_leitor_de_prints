"use client";

import Image from "next/image";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createWorker, PSM } from "tesseract.js";
import {
  CropMargins,
  preprocessImage,
  ProcessedImage,
  ProcessingPreset,
} from "@/lib/image-processing";
import {
  buildOcrDocument,
  LayoutMode,
  OcrDocument,
} from "@/lib/ocr-structure";

const ACCEPTED_TYPES = ["image/png", "image/jpeg"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const DEFAULT_CROP: CropMargins = { top: 0, right: 0, bottom: 0, left: 0 };
const CONTENT_CROP: CropMargins = { top: 8, right: 3, bottom: 7, left: 3 };

type OcrState = "idle" | "processing" | "success" | "error";
type CropSide = keyof CropMargins;

type RangeControlProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

function formatOcrStatus(status: string) {
  const labels: Record<string, string> = {
    "loading tesseract core": "Carregando o mecanismo de OCR",
    "initializing tesseract": "Inicializando o OCR",
    "loading language traineddata": "Carregando os idiomas português e inglês",
    "initializing api": "Preparando a análise da imagem",
    "recognizing text": "Reconhecendo o texto",
  };

  return labels[status] ?? "Processando a imagem";
}

function RangeControl({ label, value, onChange }: RangeControlProps) {
  return (
    <label className="range-control">
      <span>
        {label}
        <strong>{value}%</strong>
      </span>
      <input
        type="range"
        min="0"
        max="35"
        step="1"
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(Number(event.target.value))
        }
      />
    </label>
  );
}

function initialJson(selectedFile: File | null) {
  return {
    arquivo: selectedFile?.name ?? null,
    texto_bruto: "",
    texto_filtrado: "",
    confianca_ocr: null,
    qualidade_geral: null,
    dados_estruturados: {
      titulos: [],
      cabecalho: [],
      colunas: [],
      campos_detectados: {},
    },
    processamento_local: true,
  };
}

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedPreviewUrl, setProcessedPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ocrState, setOcrState] = useState<OcrState>("idle");
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatus, setOcrStatus] = useState("Aguardando uma imagem.");
  const [extractedText, setExtractedText] = useState("");
  const [structuredDocument, setStructuredDocument] = useState<OcrDocument | null>(null);
  const [cropMargins, setCropMargins] = useState<CropMargins>(DEFAULT_CROP);
  const [processingPreset, setProcessingPreset] =
    useState<ProcessingPreset>("balanced");
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("auto");
  const [minimumWordConfidence, setMinimumWordConfidence] = useState(45);
  const [autoInvert, setAutoInvert] = useState(true);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const jsonOutput = useMemo(() => {
    if (!structuredDocument) {
      return initialJson(selectedFile);
    }

    return {
      arquivo: structuredDocument.file,
      texto_bruto: extractedText,
      texto_filtrado: structuredDocument.filteredText,
      linhas: structuredDocument.lines,
      confianca_ocr: structuredDocument.ocrConfidence,
      qualidade_geral: structuredDocument.generalQuality,
      dados_estruturados: {
        titulos: structuredDocument.structuredData.titles,
        cabecalho: structuredDocument.structuredData.header,
        colunas: structuredDocument.structuredData.columns,
        campos_detectados: structuredDocument.structuredData.detectedFields,
      },
      processamento: structuredDocument.processing,
      processado_localmente: structuredDocument.localProcessing,
    };
  }, [extractedText, selectedFile, structuredDocument]);

  function resetOcr() {
    setOcrState("idle");
    setOcrProgress(0);
    setOcrStatus(selectedFile ? "Configuração alterada. Atualize a prévia." : "Aguardando uma imagem.");
    setExtractedText("");
    setStructuredDocument(null);
    setProcessedPreviewUrl(null);
    setError(null);
  }

  function clearSelection() {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProcessedPreviewUrl(null);
    setError(null);
    setOcrState("idle");
    setOcrProgress(0);
    setOcrStatus("Aguardando uma imagem.");
    setExtractedText("");
    setStructuredDocument(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      clearSelection();
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      clearSelection();
      setError("Formato inválido. Envie uma imagem PNG ou JPG.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      clearSelection();
      setError("A imagem deve ter no máximo 10 MB.");
      return;
    }

    setError(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setProcessedPreviewUrl(null);
    setOcrState("idle");
    setOcrProgress(0);
    setOcrStatus("Imagem carregada. Ajuste o recorte ou execute o OCR.");
    setExtractedText("");
    setStructuredDocument(null);
  }

  function updateCrop(side: CropSide, value: number) {
    setCropMargins((current) => ({ ...current, [side]: value }));
    resetOcr();
  }

  function applyCropPreset(margins: CropMargins) {
    setCropMargins(margins);
    resetOcr();
  }

  function updateSetting<T>(
    setter: Dispatch<SetStateAction<T>>,
    value: SetStateAction<T>,
  ) {
    setter(value);
    resetOcr();
  }

  async function prepareImage(): Promise<ProcessedImage> {
    if (!selectedFile) {
      throw new Error("Selecione uma imagem antes de continuar.");
    }

    setOcrStatus("Aplicando recorte, ampliação, contraste e redução de ruído.");
    setOcrProgress(5);

    const processed = await preprocessImage(
      selectedFile,
      cropMargins,
      processingPreset,
      autoInvert,
    );

    setProcessedPreviewUrl(processed.dataUrl);
    return processed;
  }

  async function handlePreview() {
    if (!selectedFile || ocrState === "processing") {
      return;
    }

    setError(null);
    setOcrState("processing");
    setOcrProgress(0);

    try {
      await prepareImage();
      setOcrProgress(100);
      setOcrStatus("Prévia processada. Ajuste os controles ou execute o OCR.");
      setOcrState("idle");
    } catch (caughtError) {
      console.error(caughtError);
      setOcrState("error");
      setOcrStatus("Não foi possível preparar a imagem.");
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Falha desconhecida no pré-processamento.",
      );
    }
  }

  async function handleAnalyze() {
    if (!selectedFile || ocrState === "processing") {
      return;
    }

    setError(null);
    setOcrState("processing");
    setOcrProgress(0);
    setExtractedText("");
    setStructuredDocument(null);

    let worker: Awaited<ReturnType<typeof createWorker>> | null = null;

    try {
      const processed = await prepareImage();

      setOcrStatus("Inicializando o OCR local.");
      worker = await createWorker(["por", "eng"], 1, {
        logger: (message: { progress?: number; status?: string }) => {
          if (typeof message.progress === "number") {
            setOcrProgress(Math.round(10 + message.progress * 90));
          }

          if (message.status) {
            setOcrStatus(formatOcrStatus(message.status));
          }
        },
      });

      await worker.setParameters({
        tessedit_pageseg_mode: PSM.AUTO,
        preserve_interword_spaces: "1",
        user_defined_dpi: "300",
      });

      const result = await worker.recognize(
        processed.canvas,
        {},
        { text: true, tsv: true },
      );
      const text = result.data.text.trim();

      if (!text) {
        setOcrState("error");
        setOcrProgress(100);
        setOcrStatus("Nenhum texto foi identificado. Ajuste o recorte ou o contraste.");
        return;
      }

      const document = buildOcrDocument({
        fileName: selectedFile.name,
        rawText: text,
        tsv: typeof result.data.tsv === "string" ? result.data.tsv : null,
        ocrConfidence: result.data.confidence,
        minimumWordConfidence,
        layoutMode,
        imageWidth: processed.canvas.width,
        imageHeight: processed.canvas.height,
        processingMetadata: processed.metadata,
      });

      setExtractedText(text);
      setStructuredDocument(document);
      setOcrProgress(100);
      setOcrStatus(
        `OCR concluído. Qualidade geral ${document.generalQuality.label}: ${document.generalQuality.score}%.`,
      );
      setOcrState("success");
    } catch (caughtError) {
      console.error(caughtError);
      setOcrState("error");
      setOcrStatus(
        "Não foi possível executar o OCR. Verifique a conexão e tente novamente.",
      );
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Falha desconhecida durante o OCR.",
      );
    } finally {
      if (worker) {
        await worker.terminate();
      }
    }
  }

  const quality = structuredDocument?.generalQuality ?? null;

  return (
    <main className="page-shell">
      <header className="hero">
        <span className="eyebrow">Laboratório 01</span>
        <h1>Leitor Estruturado de Prints</h1>
        <p>
          Recorte a área útil, melhore a imagem e execute um OCR local com separação
          de blocos, colunas e dados estruturados.
        </p>
      </header>

      <section className="workspace" aria-label="Área de processamento">
        <article className="panel input-panel">
          <div className="panel-heading">
            <div>
              <span className="step-label">Etapa 1</span>
              <h2>Preparar imagem</h2>
            </div>
            <span className="status-badge">OCR local aprimorado</span>
          </div>

          <label className="drop-zone" htmlFor="print-file">
            <strong>Escolha um print</strong>
            <span>PNG ou JPG, com até 10 MB</span>
            <input
              ref={fileInputRef}
              id="print-file"
              name="print-file"
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleFileChange}
              disabled={ocrState === "processing"}
            />
          </label>

          {error ? <p className="error-message">{error}</p> : null}

          <section className="settings-card" aria-label="Configuração do OCR">
            <div className="settings-heading">
              <div>
                <span className="step-label">Recorte</span>
                <h3>Área útil da imagem</h3>
              </div>
              <div className="preset-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => applyCropPreset(DEFAULT_CROP)}
                  disabled={ocrState === "processing"}
                >
                  Tela inteira
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => applyCropPreset(CONTENT_CROP)}
                  disabled={ocrState === "processing"}
                >
                  Conteúdo central
                </button>
              </div>
            </div>

            <div className="crop-grid">
              <RangeControl
                label="Topo"
                value={cropMargins.top}
                onChange={(value) => updateCrop("top", value)}
              />
              <RangeControl
                label="Direita"
                value={cropMargins.right}
                onChange={(value) => updateCrop("right", value)}
              />
              <RangeControl
                label="Base"
                value={cropMargins.bottom}
                onChange={(value) => updateCrop("bottom", value)}
              />
              <RangeControl
                label="Esquerda"
                value={cropMargins.left}
                onChange={(value) => updateCrop("left", value)}
              />
            </div>

            <div className="select-grid">
              <label>
                <span>Pré-processamento</span>
                <select
                  value={processingPreset}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                    updateSetting(
                      setProcessingPreset,
                      event.target.value as ProcessingPreset,
                    )
                  }
                  disabled={ocrState === "processing"}
                >
                  <option value="soft">Suave</option>
                  <option value="balanced">Equilibrado</option>
                  <option value="high-contrast">Alto contraste</option>
                </select>
              </label>

              <label>
                <span>Organização espacial</span>
                <select
                  value={layoutMode}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                    updateSetting(setLayoutMode, event.target.value as LayoutMode)
                  }
                  disabled={ocrState === "processing"}
                >
                  <option value="auto">Detectar automaticamente</option>
                  <option value="single-column">Uma coluna</option>
                  <option value="two-columns">Duas colunas</option>
                </select>
              </label>
            </div>

            <label className="range-control confidence-control">
              <span>
                Confiança mínima por palavra
                <strong>{minimumWordConfidence}%</strong>
              </span>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={minimumWordConfidence}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  updateSetting(setMinimumWordConfidence, Number(event.target.value))
                }
                disabled={ocrState === "processing"}
              />
            </label>

            <label className="check-control">
              <input
                type="checkbox"
                checked={autoInvert}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  updateSetting(setAutoInvert, event.target.checked)
                }
                disabled={ocrState === "processing"}
              />
              <span>Inverter automaticamente imagens com fundo escuro</span>
            </label>
          </section>

          {selectedFile && previewUrl ? (
            <div className="preview-card">
              <div className="preview-header">
                <div>
                  <strong>{selectedFile.name}</strong>
                  <span>{(selectedFile.size / 1024).toFixed(1)} KB</span>
                </div>
                <button
                  type="button"
                  className="text-button"
                  onClick={clearSelection}
                  disabled={ocrState === "processing"}
                >
                  Remover
                </button>
              </div>

              <div className="preview-comparison">
                <div>
                  <span className="preview-label">Original</span>
                  <div className="image-frame compact-frame">
                    <Image
                      src={previewUrl}
                      alt="Imagem original selecionada"
                      fill
                      sizes="(max-width: 900px) 100vw, 25vw"
                      unoptimized
                    />
                  </div>
                </div>

                <div>
                  <span className="preview-label">Pré-processada</span>
                  <div className="image-frame compact-frame">
                    {processedPreviewUrl ? (
                      <Image
                        src={processedPreviewUrl}
                        alt="Imagem recortada e pré-processada"
                        fill
                        sizes="(max-width: 900px) 100vw, 25vw"
                        unoptimized
                      />
                    ) : (
                      <span className="frame-placeholder">
                        Gere a prévia para conferir o recorte.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-preview">
              <span>Nenhuma imagem selecionada.</span>
            </div>
          )}

          <div className="button-row">
            <button
              type="button"
              className="secondary-button preview-button"
              onClick={handlePreview}
              disabled={!selectedFile || ocrState === "processing"}
            >
              Atualizar prévia
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={handleAnalyze}
              disabled={!selectedFile || ocrState === "processing"}
            >
              {ocrState === "processing" ? "Analisando..." : "Analisar print"}
            </button>
          </div>

          <p className="privacy-note">
            A imagem, o recorte e o OCR permanecem no navegador. Nenhum print é
            enviado ao servidor ou salvo no Supabase.
          </p>
        </article>

        <article className="panel result-panel">
          <div className="panel-heading">
            <div>
              <span className="step-label">Etapa 2</span>
              <h2>Resultado revisável</h2>
            </div>
            <div className="badge-group">
              {structuredDocument ? (
                <span className="confidence-badge">
                  OCR: {(structuredDocument.ocrConfidence * 100).toFixed(1)}%
                </span>
              ) : null}
              {quality ? (
                <span className={`quality-badge quality-${quality.label}`}>
                  Qualidade: {quality.score}%
                </span>
              ) : null}
            </div>
          </div>

          <div className={`ocr-status ocr-status-${ocrState}`} aria-live="polite">
            <div className="progress-header">
              <strong>{ocrStatus}</strong>
              <span>{ocrProgress}%</span>
            </div>
            <progress max={100} value={ocrProgress} />
          </div>

          {quality ? (
            <div className="quality-grid" aria-label="Indicadores de qualidade">
              <div>
                <span>Palavras mantidas</span>
                <strong>{quality.retainedWords}</strong>
              </div>
              <div>
                <span>Itens descartados</span>
                <strong>{quality.discardedTokens}</strong>
              </div>
              <div>
                <span>Confiança média</span>
                <strong>{quality.averageWordConfidence}%</strong>
              </div>
              <div>
                <span>Colunas</span>
                <strong>{structuredDocument?.processing.detectedColumns ?? 0}</strong>
              </div>
            </div>
          ) : null}

          <label className="field-label" htmlFor="raw-text">
            Texto bruto extraído
          </label>
          <textarea
            id="raw-text"
            className="text-result"
            value={extractedText}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              setExtractedText(event.target.value)
            }
            placeholder="O texto reconhecido aparecerá aqui."
            disabled={ocrState === "processing"}
          />
          <p className="field-help">
            Este campo preserva a leitura original. Edições manuais não recalculam os
            blocos espaciais.
          </p>

          <label className="field-label" htmlFor="filtered-text">
            Texto filtrado e organizado
          </label>
          <textarea
            id="filtered-text"
            className="text-result filtered-result"
            value={structuredDocument?.filteredText ?? ""}
            placeholder="O texto aprovado pelo filtro de confiança aparecerá aqui."
            readOnly
          />

          <div className="json-heading">
            <span className="field-label">Dados estruturados</span>
            <span>Blocos, colunas, campos, qualidade e processamento</span>
          </div>
          <pre className="json-preview">{JSON.stringify(jsonOutput, null, 2)}</pre>
        </article>
      </section>

      <footer className="project-footer">
        <span>LEA-100 em andamento</span>
        <span>OCR em português e inglês</span>
        <span>Sem persistência no Supabase</span>
      </footer>
    </main>
  );
}
