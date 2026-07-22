export type CropMargins = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type ProcessingPreset = "soft" | "balanced" | "high-contrast";

export type ProcessedImageMetadata = {
  originalWidth: number;
  originalHeight: number;
  processedWidth: number;
  processedHeight: number;
  scaleFactor: number;
  cropPercent: CropMargins;
  cropPixels: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  preset: ProcessingPreset;
  inverted: boolean;
  meanLuminanceBeforeInversion: number;
};

export type ProcessedImage = {
  canvas: HTMLCanvasElement;
  dataUrl: string;
  metadata: ProcessedImageMetadata;
};

const MAX_PROCESSED_WIDTH = 2800;
const MAX_PROCESSED_HEIGHT = 2400;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Não foi possível carregar a imagem selecionada."));
    };

    image.src = objectUrl;
  });
}

function calculateMeanLuminance(data: Uint8ClampedArray) {
  let total = 0;
  let samples = 0;

  for (let index = 0; index < data.length; index += 64) {
    total += data[index];
    samples += 1;
  }

  return samples === 0 ? 255 : total / samples;
}

function calculateOtsuThreshold(data: Uint8ClampedArray) {
  const histogram = new Array<number>(256).fill(0);
  let pixels = 0;

  for (let index = 0; index < data.length; index += 4) {
    histogram[data[index]] += 1;
    pixels += 1;
  }

  let weightedTotal = 0;
  for (let value = 0; value < histogram.length; value += 1) {
    weightedTotal += value * histogram[value];
  }

  let backgroundWeight = 0;
  let backgroundSum = 0;
  let bestThreshold = 127;
  let maximumVariance = 0;

  for (let value = 0; value < histogram.length; value += 1) {
    backgroundWeight += histogram[value];

    if (backgroundWeight === 0) {
      continue;
    }

    const foregroundWeight = pixels - backgroundWeight;
    if (foregroundWeight === 0) {
      break;
    }

    backgroundSum += value * histogram[value];
    const backgroundMean = backgroundSum / backgroundWeight;
    const foregroundMean = (weightedTotal - backgroundSum) / foregroundWeight;
    const variance =
      backgroundWeight * foregroundWeight * (backgroundMean - foregroundMean) ** 2;

    if (variance > maximumVariance) {
      maximumVariance = variance;
      bestThreshold = value;
    }
  }

  return bestThreshold;
}

function normalizeMargins(margins: CropMargins): CropMargins {
  const normalized = {
    top: clamp(margins.top, 0, 45),
    right: clamp(margins.right, 0, 45),
    bottom: clamp(margins.bottom, 0, 45),
    left: clamp(margins.left, 0, 45),
  };

  const horizontalTotal = normalized.left + normalized.right;
  const verticalTotal = normalized.top + normalized.bottom;

  if (horizontalTotal >= 90) {
    const correction = (horizontalTotal - 89) / 2;
    normalized.left -= correction;
    normalized.right -= correction;
  }

  if (verticalTotal >= 90) {
    const correction = (verticalTotal - 89) / 2;
    normalized.top -= correction;
    normalized.bottom -= correction;
  }

  return normalized;
}

export async function preprocessImage(
  file: File,
  cropMargins: CropMargins,
  preset: ProcessingPreset,
  autoInvert: boolean,
): Promise<ProcessedImage> {
  const image = await loadImage(file);
  const margins = normalizeMargins(cropMargins);

  const cropPixels = {
    top: Math.round((image.naturalHeight * margins.top) / 100),
    right: Math.round((image.naturalWidth * margins.right) / 100),
    bottom: Math.round((image.naturalHeight * margins.bottom) / 100),
    left: Math.round((image.naturalWidth * margins.left) / 100),
  };

  const croppedWidth = Math.max(
    1,
    image.naturalWidth - cropPixels.left - cropPixels.right,
  );
  const croppedHeight = Math.max(
    1,
    image.naturalHeight - cropPixels.top - cropPixels.bottom,
  );

  const desiredScale = clamp(1900 / croppedWidth, 1.5, 2.6);
  const dimensionScale = Math.min(
    MAX_PROCESSED_WIDTH / croppedWidth,
    MAX_PROCESSED_HEIGHT / croppedHeight,
  );
  const scaleFactor = Math.max(1, Math.min(desiredScale, dimensionScale));
  const processedWidth = Math.max(1, Math.round(croppedWidth * scaleFactor));
  const processedHeight = Math.max(1, Math.round(croppedHeight * scaleFactor));

  const canvas = document.createElement("canvas");
  canvas.width = processedWidth;
  canvas.height = processedHeight;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    throw new Error("O navegador não disponibilizou o processamento de imagem.");
  }

  const contrast = preset === "soft" ? 1.2 : preset === "balanced" ? 1.5 : 1.85;
  const blur = preset === "soft" ? 0 : preset === "balanced" ? 0.25 : 0.4;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.filter = `grayscale(1) contrast(${contrast}) blur(${blur}px)`;
  context.drawImage(
    image,
    cropPixels.left,
    cropPixels.top,
    croppedWidth,
    croppedHeight,
    0,
    0,
    processedWidth,
    processedHeight,
  );
  context.filter = "none";

  const imageData = context.getImageData(0, 0, processedWidth, processedHeight);
  const meanLuminance = calculateMeanLuminance(imageData.data);
  const shouldInvert = autoInvert && meanLuminance < 125;

  if (shouldInvert) {
    for (let index = 0; index < imageData.data.length; index += 4) {
      const inverted = 255 - imageData.data[index];
      imageData.data[index] = inverted;
      imageData.data[index + 1] = inverted;
      imageData.data[index + 2] = inverted;
    }
  }

  if (preset === "high-contrast") {
    const threshold = calculateOtsuThreshold(imageData.data);

    for (let index = 0; index < imageData.data.length; index += 4) {
      const value = imageData.data[index] >= threshold ? 255 : 0;
      imageData.data[index] = value;
      imageData.data[index + 1] = value;
      imageData.data[index + 2] = value;
    }
  }

  context.putImageData(imageData, 0, 0);

  return {
    canvas,
    dataUrl: canvas.toDataURL("image/png"),
    metadata: {
      originalWidth: image.naturalWidth,
      originalHeight: image.naturalHeight,
      processedWidth,
      processedHeight,
      scaleFactor: Number(scaleFactor.toFixed(2)),
      cropPercent: margins,
      cropPixels,
      preset,
      inverted: shouldInvert,
      meanLuminanceBeforeInversion: Number(meanLuminance.toFixed(1)),
    },
  };
}
