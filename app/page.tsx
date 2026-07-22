"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { createWorker } from "tesseract.js";

const ACCEPTED_TYPES = ["image/png", "image/jpeg"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

type OcrState = "idle" | "processing" | "success" | "error";

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

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ocrState, setOcrState] = useState<OcrState>("idle");
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatus, setOcrStatus] = useState("Aguardando uma imagem.");
  const [extractedText, setExtractedText] = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const structuredPreview = useMemo(() => {
    const lines = extractedText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    return {
      arquivo: selectedFile?.name ?? null,
      texto_bruto: extractedText,
      linhas: lines,
      confianca: confidence === null ? null : Number((confidence / 100).toFixed(4)),
      processado_localmente: true,
    };
  }, [confidence, extractedText, selectedFile]);

  function resetOcr() {
    setOcrState("idle");
    setOcrProgress(0);
    setOcrStatus("Aguardando uma imagem.");
    setExtractedText("");
    setConfidence(null);
  }

  function clearSelection() {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    resetOcr();

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
    resetOcr();
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleAnalyze() {
    if (!selectedFile || ocrState === "processing") {
      return;
    }

    setError(null);
    setOcrState("processing");
    setOcrProgress(0);
    setOcrStatus("Preparando o OCR local.");
    setExtractedText("");
    setConfidence(null);

    let worker: Awaited<ReturnType<typeof createWorker>> | null = null;

    try {
      worker = await createWorker(["por", "eng"], 1, {
        logger: (message) => {
          if (typeof message.progress === "number") {
            setOcrProgress(Math.round(message.progress * 100));
          }

          if (message.status) {
            setOcrStatus(formatOcrStatus(message.status));
          }
        },
      });

      const result = await worker.recognize(selectedFile);
      const text = result.data.text.trim();

      if (!text) {
        setOcrState("error");
        setOcrStatus("Nenhum texto foi identificado. Tente uma imagem mais nítida.");
        return;
      }

      setExtractedText(text);
      setConfidence(result.data.confidence);
      setOcrProgress(100);
      setOcrStatus("Texto extraído. Revise o conteúdo antes de continuar.");
      setOcrState("success");
    } catch (caughtError) {
      console.error(caughtError);
      setOcrState("error");
      setOcrStatus(
        "Não foi possível executar o OCR. Verifique a conexão e tente novamente.",
      );
    } finally {
      if (worker) {
        await worker.terminate();
      }
    }
  }

  return (
    <main className="page-shell">
      <header className="hero">
        <span className="eyebrow">Laboratório 01</span>
        <h1>Leitor Estruturado de Prints</h1>
        <p>
          Selecione uma captura de tela, execute o OCR no navegador e revise o
          conteúdo antes da estruturação final.
        </p>
      </header>

      <section className="workspace" aria-label="Área de processamento">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <span className="step-label">Etapa 1</span>
              <h2>Selecionar imagem</h2>
            </div>
            <span className="status-badge">OCR local</span>
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

              <div className="image-frame">
                <Image
                  src={previewUrl}
                  alt="Pré-visualização do print selecionado"
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  unoptimized
                />
              </div>
            </div>
          ) : (
            <div className="empty-preview">
              <span>Nenhuma imagem selecionada.</span>
            </div>
          )}

          <button
            type="button"
            className="primary-button"
            onClick={handleAnalyze}
            disabled={!selectedFile || ocrState === "processing"}
          >
            {ocrState === "processing" ? "Analisando..." : "Analisar print"}
          </button>

          <p className="privacy-note">
            A imagem é processada localmente no navegador e não é salva pelo
            aplicativo.
          </p>
        </article>

        <article className="panel result-panel">
          <div className="panel-heading">
            <div>
              <span className="step-label">Etapa 2</span>
              <h2>Resultado do OCR</h2>
            </div>
            {confidence !== null ? (
              <span className="confidence-badge">
                Confiança: {confidence.toFixed(1)}%
              </span>
            ) : null}
          </div>

          <div className={`ocr-status ocr-status-${ocrState}`} aria-live="polite">
            <div className="progress-header">
              <strong>{ocrStatus}</strong>
              <span>{ocrProgress}%</span>
            </div>
            <progress max={100} value={ocrProgress} />
          </div>

          <label className="field-label" htmlFor="raw-text">
            Texto bruto extraído
          </label>
          <textarea
            id="raw-text"
            className="text-result"
            value={extractedText}
            onChange={(event) => setExtractedText(event.target.value)}
            placeholder="O texto reconhecido aparecerá aqui."
            disabled={ocrState === "processing"}
          />

          <div className="json-heading">
            <span className="field-label">Estrutura preliminar</span>
            <span>Normalização completa: próxima etapa</span>
          </div>
          <pre className="json-preview">
            {JSON.stringify(structuredPreview, null, 2)}
          </pre>
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
