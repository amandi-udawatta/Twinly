"use client";

/**
 * Plant registration: upload photo → manual details → optional AI name suggestion.
 */

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";

import { savePlant } from "@/app/plants/new/actions";
import { savePlantInitialState } from "@/app/plants/new/types";
import type { AppAppearance } from "@/components/dashboard/dashboard-theme";
import {
  dashboardCard,
  dashboardCtaPrimary,
  dashboardCtaSecondary,
  dashboardInput,
  dashboardMuted,
  twinlyLabel,
  twinlySelect,
} from "@/components/dashboard/dashboard-theme";
import { PhotoDropzone } from "@/components/plants/photo-dropzone";
import { ErrorBanner, LoadingState } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SpeciesSuggestion } from "@/services/geminiService";
import { cn } from "@/lib/utils";

type Step = "upload" | "details";

const defaultSelectClassName =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

interface RegisterPlantWizardProps {
  appearance?: AppAppearance;
}

export function RegisterPlantWizard({
  appearance = "default",
}: RegisterPlantWizardProps) {
  const isTwinly = appearance === "twinly";
  const [step, setStep] = useState<Step>("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [species, setSpecies] = useState("");
  const [suggesting, setSuggesting] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  const [saveState, saveAction, savePending] = useActionState(
    savePlant,
    savePlantInitialState,
  );

  const suggestSpecies = async () => {
    if (files.length === 0) {
      setSuggestError("Upload a photo first.");
      return;
    }

    setSuggesting(true);
    setSuggestError(null);

    try {
      const formData = new FormData();
      formData.append("image", files[0]);

      const res = await fetch("/api/register-plant", {
        method: "POST",
        body: formData,
      });

      const json = (await res.json()) as SpeciesSuggestion | { error: string };

      if (!res.ok || "error" in json) {
        const err = "error" in json ? json.error : "Could not suggest a name.";
        setSuggestError(err);
        return;
      }

      setSpecies(json.species);
    } catch (e) {
      setSuggestError(
        e instanceof Error ? e.message : "Could not suggest a name.",
      );
    } finally {
      setSuggesting(false);
    }
  };

  const submitWithImage = (formData: FormData) => {
    if (files[0]) {
      formData.set("image", files[0]);
    }
    formData.set("species", species);
    saveAction(formData);
  };

  const stepHintClass = cn(
    "font-poppins text-sm",
    isTwinly ? dashboardMuted : "text-muted-foreground",
  );

  if (step === "upload") {
    return (
      <UploadStep
        files={files}
        onFilesChange={setFiles}
        onContinue={() => {
          if (files.length === 0) return;
          setStep("details");
        }}
        isTwinly={isTwinly}
        stepHintClass={stepHintClass}
        appearance={appearance}
      />
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 font-poppins">
      <p className={stepHintClass}>
        Step 2 of 2 — Fill in your plant&apos;s details. Use AI only if you need
        help naming it.
      </p>
      {files[0] ? <CoverPhotoPreview file={files[0]} isTwinly={isTwinly} /> : null}
      {saveState.error ? <ErrorBanner message={saveState.error} /> : null}
      {suggestError ? <ErrorBanner message={suggestError} /> : null}
      <form action={submitWithImage} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="species" className={isTwinly ? twinlyLabel : undefined}>
            Plant name *
          </Label>
          <SpeciesNameRow
            species={species}
            onSpeciesChange={setSpecies}
            suggesting={suggesting}
            hasPhoto={files.length > 0}
            onSuggestSpecies={suggestSpecies}
            isTwinly={isTwinly}
          />
        </div>
        {suggesting ? (
          <LoadingState message="Twinly is looking at your photo…" />
        ) : null}
        <div className="space-y-2">
          <Label htmlFor="nickname" className={isTwinly ? twinlyLabel : undefined}>
            Nickname
          </Label>
          <Input
            id="nickname"
            name="nickname"
            placeholder="e.g. Sunny"
            className={isTwinly ? dashboardInput : undefined}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ageAmount" className={isTwinly ? twinlyLabel : undefined}>
            Approximate age
          </Label>
          <div className="flex gap-2">
            <Input
              id="ageAmount"
              name="ageAmount"
              type="number"
              min={1}
              placeholder="e.g. 3"
              className={cn("flex-1", isTwinly && dashboardInput)}
            />
            <select
              id="ageUnit"
              name="ageUnit"
              defaultValue="weeks"
              className={cn(
                isTwinly ? twinlySelect : defaultSelectClassName,
                "h-9 w-32 shrink-0",
              )}
            >
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="years">Years</option>
            </select>
          </div>
          <p
            className={cn(
              "font-poppins text-xs",
              isTwinly ? dashboardMuted : "text-muted-foreground",
            )}
          >
            Optional. Age increases by one day for each day since registration.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="historyNote" className={isTwinly ? twinlyLabel : undefined}>
            History note
          </Label>
          <Textarea
            id="historyNote"
            name="historyNote"
            rows={3}
            placeholder="Repotted recently, past issues…"
            className={isTwinly ? dashboardInput : undefined}
          />
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant={isTwinly ? "ghost" : "outline"}
            onClick={() => setStep("upload")}
            className={isTwinly ? cn("h-auto", dashboardCtaSecondary) : undefined}
          >
            Back
          </Button>
          <Button
            type="submit"
            className={cn("flex-1", isTwinly && dashboardCtaPrimary)}
            disabled={savePending || !species.trim()}
          >
            {savePending ? "Saving…" : "Save plant"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function CoverPhotoPreview({
  file,
  isTwinly,
}: {
  file: File;
  isTwinly: boolean;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!previewUrl) {
    return null;
  }

  return (
    <div className="space-y-2 font-poppins">
      <p
        className={cn(
          "text-sm font-medium",
          isTwinly ? "text-white/90" : undefined,
        )}
      >
        Cover photo
      </p>
      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden rounded-xl border",
          isTwinly ? dashboardCard : "border-border bg-muted",
        )}
      >
        <Image
          src={previewUrl}
          alt="Plant cover preview"
          fill
          className="object-cover"
          sizes="(max-width: 576px) 100vw, 576px"
          unoptimized
        />
      </div>
      <p
        className={cn(
          "text-xs",
          isTwinly ? dashboardMuted : "text-muted-foreground",
        )}
      >
        This will be your plant&apos;s cover on the dashboard after you save.
      </p>
    </div>
  );
}

function UploadStep({
  files,
  onFilesChange,
  onContinue,
  isTwinly,
  stepHintClass,
  appearance,
}: {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onContinue: () => void;
  isTwinly: boolean;
  stepHintClass: string;
  appearance: AppAppearance;
}) {
  return (
    <div className="mx-auto max-w-xl space-y-6 font-poppins">
      <p className={stepHintClass}>
        Step 1 of 2 — Add a cover photo for your plant.
      </p>
      <PhotoDropzone
        maxFiles={1}
        onFilesChange={onFilesChange}
        label="Drop your plant photo here"
        appearance={appearance}
      />
      <Button
        type="button"
        className={cn("w-full", isTwinly && dashboardCtaPrimary)}
        onClick={onContinue}
        disabled={files.length === 0}
      >
        Continue
      </Button>
    </div>
  );
}

function SpeciesNameRow({
  species,
  onSpeciesChange,
  suggesting,
  hasPhoto,
  onSuggestSpecies,
  isTwinly,
}: {
  species: string;
  onSpeciesChange: (value: string) => void;
  suggesting: boolean;
  hasPhoto: boolean;
  onSuggestSpecies: () => void;
  isTwinly: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Input
        id="species"
        name="species"
        required
        value={species}
        onChange={(e) => onSpeciesChange(e.target.value)}
        placeholder="e.g. tomato, chilli, pepper"
        className={cn("flex-1", isTwinly && dashboardInput)}
      />
      <Button
        type="button"
        variant={isTwinly ? "ghost" : "outline"}
        onClick={onSuggestSpecies}
        disabled={suggesting || !hasPhoto}
        className={isTwinly ? cn("h-auto shrink-0", dashboardCtaSecondary) : "shrink-0"}
      >
        {suggesting ? "Suggesting…" : "Suggest from photo"}
      </Button>
    </div>
  );
}
