"use client";

/**
 * QR code for /scan/{plantId} with download-as-PNG helper.
 */

import { useRef } from "react";
import QRCode from "react-qr-code";

import { Button } from "@/components/ui/button";

interface QrDisplayProps {
  plantId: string;
  appUrl: string;
}

export function QrDisplay({ plantId, appUrl }: QrDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scanUrl = `${appUrl}/scan/${plantId}`;

  const downloadPng = () => {
    const svg = containerRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const link = document.createElement("a");
      link.download = `twinly-plant-${plantId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-card p-8">
      <div ref={containerRef} className="rounded-lg bg-white p-4">
        <QRCode value={scanUrl} size={200} />
      </div>
      <p className="max-w-sm text-center text-sm text-muted-foreground">
        Scan to open check-in for this plant. Print or place near your plant.
      </p>
      <Button type="button" onClick={downloadPng} variant="outline">
        Download QR as PNG
      </Button>
    </div>
  );
}
