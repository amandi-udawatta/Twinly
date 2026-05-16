"use client";

/**
 * Drag-and-drop photo upload (react-dropzone) with previews.
 * PRD: green glow on hover/drag for check-in and registration flows.
 */

import { useCallback, useEffect, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { ErrorBanner } from "@/components/ui/feedback";

import type { AppAppearance } from "@/components/dashboard/dashboard-theme";
import { dashboardMuted } from "@/components/dashboard/dashboard-theme";

interface PhotoDropzoneProps {
  maxFiles?: number;
  onFilesChange: (files: File[]) => void;
  disabled?: boolean;
  label?: string;
  appearance?: AppAppearance;
}

export function PhotoDropzone({
  maxFiles = 4,
  onFilesChange,
  disabled = false,
  label = "Drop photos here or click to upload",
  appearance = "default",
}: PhotoDropzoneProps) {
  const isTwinly = appearance === "twinly";
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      setError(null);
      if (rejected.length > 0) {
        setError(rejected[0]?.errors[0]?.message ?? "Invalid file");
        return;
      }
      const merged = [...files, ...accepted].slice(0, maxFiles);
      setFiles(merged);
      onFilesChange(merged);
    },
    [files, maxFiles, onFilesChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: maxFiles - files.length,
    disabled: disabled || files.length >= maxFiles,
    multiple: maxFiles > 1,
  });

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  const removeFile = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    onFilesChange(next);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors",
          isDragActive
            ? isTwinly
              ? "border-[#57B55D] bg-[#57B55D]/10 shadow-[0_0_24px_rgba(87,181,93,0.3)]"
              : "border-primary bg-primary/10 shadow-[0_0_24px_rgba(74,222,128,0.25)]"
            : isTwinly
              ? "border-white/20 hover:border-[#57B55D]/60 hover:bg-[#57B55D]/5"
              : "border-border hover:border-primary/60 hover:bg-primary/5",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <input {...getInputProps()} />
        <p className={cn("font-poppins text-sm", isTwinly ? dashboardMuted : "text-muted-foreground")}>
          {label}
        </p>
        <p className={cn("mt-1 font-poppins text-xs", isTwinly ? dashboardMuted : "text-muted-foreground")}>
          {files.length}/{maxFiles} images · JPG, PNG, WebP
        </p>
      </div>

      {error ? <ErrorBanner message={error} /> : null}

      {previews.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {previews.map((src, i) => (
            <li
              key={src}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border",
                isTwinly ? "border-white/15" : "border-border",
              )}
            >
              <Image
                src={src}
                alt={`Preview ${i + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute right-1 top-1 rounded bg-background/80 px-2 py-0.5 text-xs"
                disabled={disabled}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
