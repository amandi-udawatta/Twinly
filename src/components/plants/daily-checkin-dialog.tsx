"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface DailyCheckInPlant {
  id: string;
  nickname: string | null;
  species: string | null;
}

interface DailyCheckInDialogProps {
  open: boolean;
  plants: DailyCheckInPlant[];
  onClose: () => void;
}

const selectClassName =
  "flex h-10 w-full rounded-md border border-input bg-[#0D0D0D] px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

function plantLabel(plant: DailyCheckInPlant): string {
  if (plant.nickname && plant.species) {
    return `${plant.nickname} (${plant.species})`;
  }
  return plant.nickname || plant.species || "Unnamed plant";
}

/** Extract plant id from a scanned Twinly QR URL (internal only). */
function plantIdFromQrValue(raw: string): string | null {
  const trimmed = raw.trim();
  const scanMatch = trimmed.match(/\/scan\/([0-9a-f-]{36})/i);
  if (scanMatch) return scanMatch[1];
  const checkinMatch = trimmed.match(/\/plants\/([0-9a-f-]{36})/i);
  if (checkinMatch) return checkinMatch[1];
  return null;
}

export function DailyCheckInDialog({
  open,
  plants,
  onClose,
}: DailyCheckInDialogProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [selectedPlantId, setSelectedPlantId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraSupported, setCameraSupported] = useState(false);

  const goToCheckIn = useCallback(
    (plantId: string) => {
      onClose();
      router.push(`/plants/${plantId}/checkin`);
    },
    [onClose, router],
  );

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraActive(false);
  }, []);

  useEffect(() => {
    if (!open) {
      stopCamera();
      setSelectedPlantId("");
      setError(null);
      return;
    }

    setCameraSupported(
      typeof window !== "undefined" && "BarcodeDetector" in window,
    );
  }, [open, stopCamera]);

  useEffect(() => {
    if (!open || !cameraActive || !cameraSupported) return;

    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        const detector = new BarcodeDetector({ formats: ["qr_code"] });

        intervalId = setInterval(async () => {
          if (!videoRef.current || cancelled) return;
          try {
            const codes = await detector.detect(videoRef.current);
            const value = codes[0]?.rawValue;
            if (!value) return;
            const plantId = plantIdFromQrValue(value);
            if (plantId) {
              stopCamera();
              goToCheckIn(plantId);
            }
          } catch {
            // ignore per-frame detection errors
          }
        }, 500);
      } catch {
        setError(
          "Could not open the camera. Pick your plant from the list below instead.",
        );
        stopCamera();
      }
    };

    void start();

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
      stopCamera();
    };
  }, [open, cameraActive, cameraSupported, goToCheckIn, stopCamera]);

  if (!open) return null;

  const startFromDropdown = () => {
    if (!selectedPlantId) {
      setError("Choose a plant to check in.");
      return;
    }
    goToCheckIn(selectedPlantId);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="daily-checkin-title"
    >
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
        <h2
          id="daily-checkin-title"
          className="font-heading text-xl font-semibold"
        >
          Daily check-in
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Scan your plant&apos;s QR tag or pick it by name to start today&apos;s
          check-in.
        </p>

        {cameraSupported ? (
          <div className="mt-5 space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Scan QR code
            </p>
            {!cameraActive ? (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setError(null);
                  setCameraActive(true);
                }}
              >
                Open camera
              </Button>
            ) : (
              <div className="overflow-hidden rounded-lg border border-border bg-black">
                <video
                  ref={videoRef}
                  className="aspect-video w-full object-cover"
                  muted
                  playsInline
                />
              </div>
            )}
          </div>
        ) : null}

        <div className={cn("space-y-2", cameraSupported ? "mt-6" : "mt-5")}>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Or choose a plant
          </p>
          <Label htmlFor="checkin-plant" className="sr-only">
            Plant
          </Label>
          <select
            id="checkin-plant"
            value={selectedPlantId}
            onChange={(event) => {
              setSelectedPlantId(event.target.value);
              setError(null);
            }}
            className={selectClassName}
          >
            <option value="">Select nickname…</option>
            {plants.map((plant) => (
              <option key={plant.id} value={plant.id}>
                {plantLabel(plant)}
              </option>
            ))}
          </select>
        </div>

        {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

        <div className="mt-6 flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => {
              stopCamera();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button type="button" className="flex-1" onClick={startFromDropdown}>
            Start check-in
          </Button>
        </div>
      </div>
    </div>
  );
}
