"use client";

/* eslint-disable @next/next/no-img-element */

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  FileImage,
  Gauge,
  ImageUp,
  Loader2,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ChangeEvent, useMemo, useRef, useState } from "react";

type AnalysisResult = {
  filename: string;
  fake_probability: number;
  label: "fake" | "real";
  heatmap_png_base64: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8000";

const sampleSignals = [
  { label: "Grad-CAM heatmap", value: "Region evidence" },
  { label: "Classifier score", value: "Binary probability" },
  { label: "Investigation status", value: "Image MVP" },
];

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const probabilityPercent = useMemo(() => {
    if (!result) return 0;
    return Math.round(result.fake_probability * 100);
  }, [result]);

  const confidenceTone = result?.label === "fake" ? "rose" : "emerald";

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setResult(null);
    setSelectedFile(file);
    setPreviewUrl((currentUrl) => {
      if (currentUrl) URL.revokeObjectURL(currentUrl);
      return URL.createObjectURL(file);
    });
  }

  async function analyzeSelectedImage() {
    if (!selectedFile) {
      setError("Choose an image before starting analysis.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${API_BASE_URL}/predict/image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.detail || "The analysis request failed.");
      }

      const payload = (await response.json()) as AnalysisResult;
      setResult(payload);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to reach the analysis backend.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  function resetInvestigation() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <main className="min-h-screen">
      <section className="mx-auto grid min-h-screen w-full max-w-7xl gap-8 px-4 py-5 sm:px-6 lg:grid-cols-[360px_1fr] lg:px-8">
        <aside className="flex flex-col gap-4 rounded-lg border border-slate-200/80 bg-white/85 p-4 shadow-soft-panel backdrop-blur">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-950 text-white">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-slate-950">
                  TruthLens AI
                </p>
                <p className="text-sm text-slate-500">Forensic workbench</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              MVP
            </span>
          </div>

          <div className="grid gap-3">
            {sampleSignals.map((signal) => (
              <div
                key={signal.label}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
                  {signal.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-950">
                  {signal.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-auto rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              Backend required
            </div>
            Run the FastAPI server at <code>localhost:8000</code> before
            starting an image investigation.
          </div>
        </aside>

        <div className="grid gap-5">
          <header className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200/80 bg-white/85 p-5 shadow-soft-panel backdrop-blur md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
                Deepfake Image Analysis
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Upload an image, run model inference, and compare the source
                image against the generated forensic heatmap.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <ImageUp className="h-4 w-4" aria-hidden="true" />
                Upload
              </button>
              <button
                type="button"
                onClick={resetInvestigation}
                className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-slate-700 transition hover:bg-slate-50"
                aria-label="Reset investigation"
                title="Reset investigation"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </header>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            <section className="rounded-lg border border-slate-200/80 bg-white/90 p-4 shadow-soft-panel">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileChange}
              />

              {!previewUrl ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex min-h-[420px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-6 text-center transition hover:border-blue-400 hover:bg-blue-50/50"
                >
                  <FileImage className="h-12 w-12 text-slate-400" aria-hidden="true" />
                  <span className="mt-4 text-base font-semibold text-slate-950">
                    Select an image for analysis
                  </span>
                  <span className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    JPG, PNG, and other browser-supported image formats can be
                    sent to the FastAPI inference service.
                  </span>
                </button>
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  <ImagePanel title="Source Image" src={previewUrl} alt="Uploaded source image" />
                  <ImagePanel
                    title="Forensic Heatmap"
                    src={
                      result
                        ? `data:image/png;base64,${result.heatmap_png_base64}`
                        : previewUrl
                    }
                    alt="Generated forensic heatmap"
                    muted={!result}
                  />
                </div>
              )}
            </section>

            <aside className="grid content-start gap-5">
              <section className="rounded-lg border border-slate-200/80 bg-white/90 p-5 shadow-soft-panel">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Result</p>
                    <p className="mt-1 text-xl font-semibold text-slate-950">
                      {result ? result.label.toUpperCase() : "Pending"}
                    </p>
                  </div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-md ${
                      result?.label === "fake"
                        ? "bg-rose-50 text-rose-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {result?.label === "fake" ? (
                      <ShieldAlert className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-600">Fake probability</span>
                    <span className="font-semibold text-slate-950">
                      {result ? `${probabilityPercent}%` : "0%"}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      className={`h-full ${
                        confidenceTone === "rose" ? "bg-rose-500" : "bg-emerald-500"
                      }`}
                      initial={false}
                      animate={{ width: `${probabilityPercent}%` }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={analyzeSelectedImage}
                  disabled={!selectedFile || isAnalyzing}
                  className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isAnalyzing ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Gauge className="h-4 w-4" aria-hidden="true" />
                  )}
                  {isAnalyzing ? "Analyzing" : "Run Analysis"}
                </button>
              </section>

              <section className="rounded-lg border border-slate-200/80 bg-white/90 p-5 shadow-soft-panel">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                  <BarChart3 className="h-4 w-4 text-blue-600" aria-hidden="true" />
                  Investigation Details
                </div>
                <dl className="mt-4 grid gap-3 text-sm">
                  <DetailRow label="File" value={selectedFile?.name || "No image selected"} />
                  <DetailRow
                    label="Size"
                    value={
                      selectedFile
                        ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                        : "-"
                    }
                  />
                  <DetailRow
                    label="Model output"
                    value={result ? result.fake_probability.toFixed(4) : "-"}
                  />
                </dl>
              </section>

              <AnimatePresence>
                {error ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      <AlertCircle className="h-4 w-4" aria-hidden="true" />
                      Analysis failed
                    </div>
                    <p className="mt-2 leading-6">{error}</p>
                  </motion.div>
                ) : result ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      Analysis complete
                    </div>
                    <p className="mt-2 leading-6">
                      Heatmap generated for {result.filename}.
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

function ImagePanel({
  title,
  src,
  alt,
  muted = false,
}: {
  title: string;
  src: string;
  alt: string;
  muted?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950">
      <div className="flex h-11 items-center justify-between border-b border-white/10 px-3">
        <p className="truncate text-sm font-semibold text-white">{title}</p>
        {muted ? (
          <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/70">
            Awaiting result
          </span>
        ) : null}
      </div>
      <div className="relative flex aspect-[4/3] items-center justify-center bg-slate-900">
        <img
          src={src}
          alt={alt}
          className={`h-full w-full object-contain ${muted ? "opacity-45 grayscale" : ""}`}
        />
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[96px_1fr] gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
      <dt className="text-slate-500">{label}</dt>
      <dd className="min-w-0 truncate font-medium text-slate-900" title={value}>
        {value}
      </dd>
    </div>
  );
}
