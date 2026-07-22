"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";

const ACCEPTED_TYPES = ["image/png", "image/jpeg"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function clearSelection() {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      clearSelection();
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setError("Formato inválido. Envie uma imagem PNG ou JPG.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setError("A imagem deve ter no máximo 10 MB.");
      event.target.value = "";
      return;
    }

    setError(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  return (
    <main className="page-shell">
      <header className="hero">
        <span className="eyebrow">Laboratório 01</span>
        <h1>Leitor Estruturado de Prints</h1>
        <p>
          Envie uma captura de tela para validar a imagem e preparar a extração
          estruturada dos dados.
        </p>
      </header>

      <section className="workspace" aria-label="Área de processamento">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <span className="step-label">Etapa 1</span>
              <h2>Selecionar imagem</h2>
            </div>
            <span className="status-badge">Fundação do MVP</span>
          </div>

          <label className="drop-zone" htmlFor="print-file">
            <strong>Escolha um print</strong>
            <span>PNG ou JPG, com até 10 MB</span>
            <input
              id="print-file"
              name="print-file"
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleFileChange}
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
                <button type="button" className="text-button" onClick={clearSelection}>
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
        </article>

        <article className="panel result-panel">
          <div className="panel-heading">
            <div>
              <span className="step-label">Etapa 2</span>
              <h2>Resultado estruturado</h2>
            </div>
          </div>

          <div className="result-placeholder">
            <p>O OCR ainda não foi conectado nesta etapa.</p>
            <ul>
              <li>Texto bruto extraído</li>
              <li>Blocos identificados</li>
              <li>Campos estruturados</li>
              <li>Nível de confiança</li>
            </ul>
          </div>

          <button type="button" className="primary-button" disabled>
            Analisar print — próxima etapa
          </button>
        </article>
      </section>

      <footer className="project-footer">
        <span>LEA-100 em andamento</span>
        <span>Sem envio ou armazenamento da imagem</span>
      </footer>
    </main>
  );
}
