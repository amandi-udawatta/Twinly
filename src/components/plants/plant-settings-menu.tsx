"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";

import {
  deletePlant,
  updatePlant,
  type PlantActionResult,
} from "@/app/plants/[id]/actions";
import {
  dashboardCard,
  dashboardCtaPrimary,
  dashboardCtaSecondary,
  dashboardInput,
  dashboardMuted,
  dashboardPanel,
  dashboardPanelTitle,
  twinlyLabel,
} from "@/components/dashboard/dashboard-theme";
import { PhotoDropzone } from "@/components/plants/photo-dropzone";
import { ErrorBanner } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface PlantSettingsPlant {
  id: string;
  nickname: string | null;
  image_url: string | null;
}

interface PlantSettingsMenuProps {
  plant: PlantSettingsPlant;
  displayName: string;
  checkinCount: number;
}

const menuPanelClassName =
  "absolute right-0 z-40 mt-2 min-w-[11rem] overflow-hidden rounded-2xl border border-white/10 bg-black/50 py-1 font-poppins shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-md";

const menuItemClassName =
  "w-full px-4 py-2.5 text-left text-sm text-white/85 transition-colors hover:bg-white/10";

/** Below fixed SiteHeader (z-[100]); main uses pt-24 for the same offset. */
const dialogOverlayClassName =
  "fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-black/70 px-4 pb-6 pt-24 font-poppins sm:px-6 sm:pt-28";

const dialogPanelClassName = cn(
  "w-full overflow-y-auto p-6",
  dashboardPanel,
);

const settingsTriggerClassName = cn(dashboardCtaPrimary, "h-9 px-4 text-sm");

const deleteCtaClassName =
  "flex-1 rounded-full border border-red-500/40 bg-red-500/15 px-6 py-2.5 font-poppins text-sm font-medium text-red-400 shadow-md transition-all hover:scale-[1.02] hover:bg-red-500/25 active:scale-[0.98]";

export function PlantSettingsMenu({
  plant,
  displayName,
  checkinCount,
}: PlantSettingsMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className={settingsTriggerClassName}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
        >
          Plant settings
        </button>
        {menuOpen ? (
          <>
            <button
              type="button"
              className="fixed inset-0 z-30"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            />
            <div role="menu" className={menuPanelClassName}>
              <button
                type="button"
                role="menuitem"
                className={menuItemClassName}
                onClick={() => {
                  setMenuOpen(false);
                  setEditOpen(true);
                }}
              >
                Edit plant
              </button>
              <button
                type="button"
                role="menuitem"
                className={cn(menuItemClassName, "text-red-400 hover:bg-red-500/10")}
                onClick={() => {
                  setMenuOpen(false);
                  setDeleteOpen(true);
                }}
              >
                Delete plant
              </button>
            </div>
          </>
        ) : null}
      </div>

      <EditPlantDialog
        key={editOpen ? "edit-open" : "edit-closed"}
        open={editOpen}
        plant={plant}
        onClose={() => setEditOpen(false)}
      />

      <DeletePlantDialog
        open={deleteOpen}
        plantId={plant.id}
        displayName={displayName}
        checkinCount={checkinCount}
        onClose={() => setDeleteOpen(false)}
      />
    </>
  );
}

function EditPlantDialog({
  open,
  plant,
  onClose,
}: {
  open: boolean;
  plant: PlantSettingsPlant;
  onClose: () => void;
}) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [nickname, setNickname] = useState(plant.nickname ?? "");

  const boundUpdate = updatePlant.bind(null, plant.id);
  const [state, formAction, pending] = useActionState<
    PlantActionResult,
    FormData
  >(boundUpdate, {});

  useEffect(() => {
    if (!open) {
      setFiles([]);
      return;
    }
    setNickname(plant.nickname ?? "");
  }, [open, plant.nickname]);

  useEffect(() => {
    if (state.success) {
      onClose();
      router.refresh();
    }
  }, [state.success, onClose, router]);

  if (!open) return null;

  const submit = (formData: FormData) => {
    if (files[0]) {
      formData.set("image", files[0]);
    }
    formAction(formData);
  };

  return (
    <div
      className={dialogOverlayClassName}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-plant-title"
    >
      <div
        className={cn(
          dialogPanelClassName,
          "max-h-[calc(100vh-7rem)] max-w-lg sm:max-h-[calc(100vh-8rem)]",
        )}
      >
        <h2 id="edit-plant-title" className={dashboardPanelTitle}>
          Edit plant
        </h2>
        <p className={cn("mt-2", dashboardMuted)}>
          You can change the nickname and cover photo only. Species, age, and
          history stay as registered at setup.
        </p>

        {state.error ? (
          <div className="mt-4">
            <ErrorBanner message={state.error} />
          </div>
        ) : null}

        <form action={submit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label className={twinlyLabel}>Cover photo (optional)</Label>
            {plant.image_url && files.length === 0 ? (
              <div
                className={cn(
                  "relative aspect-[4/3] overflow-hidden rounded-xl",
                  dashboardCard,
                )}
              >
                <Image
                  src={plant.image_url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 512px) 100vw, 512px"
                />
              </div>
            ) : null}
            <PhotoDropzone
              maxFiles={1}
              onFilesChange={setFiles}
              label="Replace cover photo"
              appearance="twinly"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-nickname" className={twinlyLabel}>
              Nickname
            </Label>
            <Input
              id="edit-nickname"
              name="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. chillie 1"
              className={dashboardInput}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              className={cn("h-auto flex-1", dashboardCtaSecondary)}
              onClick={onClose}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={cn("h-auto flex-1", dashboardCtaPrimary)}
              disabled={pending}
            >
              {pending ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeletePlantDialog({
  open,
  plantId,
  displayName,
  checkinCount,
  onClose,
}: {
  open: boolean;
  plantId: string;
  displayName: string;
  checkinCount: number;
  onClose: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!open) return null;

  const checkinLabel =
    checkinCount === 1
      ? "1 check-in"
      : `${checkinCount} check-ins`;

  const onConfirm = () => {
    setError(null);
    startTransition(async () => {
      const result = await deletePlant(plantId);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div
      className={dialogOverlayClassName}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-plant-title"
    >
      <div className={cn(dialogPanelClassName, "max-w-md")}>
        <h2
          id="delete-plant-title"
          className={cn(dashboardPanelTitle, "text-red-400")}
        >
          Delete plant?
        </h2>
        <p className={cn("mt-2", dashboardMuted)}>
          <span className="font-medium text-white">{displayName}</span> and all
          data will be removed permanently, including{" "}
          {checkinCount > 0 ? checkinLabel : "any check-ins"} and photos in
          storage. This cannot be undone.
        </p>

        {error ? (
          <div className="mt-4">
            <ErrorBanner message={error} />
          </div>
        ) : null}

        <div className="mt-6 flex gap-3">
          <Button
            type="button"
            className={cn("h-auto flex-1", dashboardCtaSecondary)}
            onClick={onClose}
            disabled={pending}
          >
            Cancel
          </Button>
          <button
            type="button"
            className={cn(deleteCtaClassName, pending && "pointer-events-none opacity-50")}
            disabled={pending}
            onClick={onConfirm}
          >
            {pending ? "Deleting…" : "Delete plant"}
          </button>
        </div>
      </div>
    </div>
  );
}
