"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ImageAttachment } from "@/types";

interface ImagePreviewProps {
  images: ImageAttachment[];
  onRemove: (id: string) => void;
  disabled?: boolean;
}

export function ImagePreview({ images, onRemove, disabled }: ImagePreviewProps) {
  if (images.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 p-2">
      {images.map((image) => (
        <div
          key={image.id}
          className="group relative h-20 w-20 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700"
        >
          <img
            src={`data:${image.mediaType};base64,${image.data}`}
            alt={image.name || "Attached image"}
            className="h-full w-full object-cover"
          />
          {!disabled && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute -right-1 -top-1 h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => onRemove(image.id)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove image</span>
            </Button>
          )}
          {image.name && (
            <div className="absolute bottom-0 left-0 right-0 truncate bg-black/50 px-1 py-0.5 text-xs text-white">
              {image.name}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
