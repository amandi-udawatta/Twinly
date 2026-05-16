"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";

import {
  deletePlant,
  updatePlant,
  type PlantActionResult,
} from "@/app/plants/[id]/actions";
import { PhotoDropzone } from "@/components/plants/photo-dropzone";
import { ErrorBanner } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
        >
          Plant settings
        </Button>
        {menuOpen ? (
          <>
            <button
              type="button"
              className="fixed inset-0 z-30"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            />
            <div
              role="menu"
              className="absolute right-0 z-40 mt-2 min-w-[10rem] rounded-lg border border-border bg-card py-1 shadow-lg"
            >
              <button
                type="button"
                role="menuitem"
                className="w-full px-4 py-2 text-left text-sm hover:bg-muted"
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
                className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-muted"
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-plant-title"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-xl">
        <h2
          id="edit-plant-title"
          className="font-heading text-xl font-semibold"
        >
          Edit plant
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
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
            <Label>Cover photo (optional)</Label>
            {plant.image_url && files.length === 0 ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted">
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-nickname">Nickname</Label>
            <Input
              id="edit-nickname"
              name="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. chillie 1"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={pending}>
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-plant-title"
    >
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
        <h2
          id="delete-plant-title"
          className="font-heading text-xl font-semibold text-destructive"
        >
          Delete plant?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{displayName}</span> and
          all data will be removed permanently, including{" "}
          {checkinCount > 0 ? checkinLabel : "any check-ins"} and photos in
          storage. This cannot be undone.
        </p>

        {error ? (
          <div className="mt-4">
            <ErrorBanner message={error} />
          </div>
        ) : null}

        <div className="mt-6 flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="flex-1"
            disabled={pending}
            onClick={onConfirm}
          >
            {pending ? "Deleting…" : "Delete plant"}
          </Button>
        </div>
      </div>
    </div>
  );
}
