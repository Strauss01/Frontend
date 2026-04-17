"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUploadDocument } from "@/features/documents/hooks";

const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "text/plain": [".txt"],
};

export function DropzoneUpload() {
  const upload = useUploadDocument();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) setSelectedFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: ACCEPTED_TYPES,
      maxFiles: 1,
      maxSize: 50 * 1024 * 1024, // 50 MB
      disabled: upload.isPending,
    });

  const handleUpload = () => {
    if (!selectedFile) return;
    upload.mutate(selectedFile, {
      onSuccess: () => setSelectedFile(null),
    });
  };

  const rejection = fileRejections[0]?.errors[0];

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
          isDragActive
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border hover:border-primary/50 hover:bg-accent/50",
          upload.isPending && "pointer-events-none opacity-60"
        )}
      >
        <input {...getInputProps()} aria-label="File upload" />

        <div className="flex flex-col items-center gap-3">
          <div
            className={cn(
              "p-4 rounded-full transition-colors",
              isDragActive ? "bg-primary/20" : "bg-muted"
            )}
          >
            <UploadCloud
              className={cn(
                "h-7 w-7 transition-colors",
                isDragActive ? "text-primary" : "text-muted-foreground"
              )}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {isDragActive
                ? "Drop to upload"
                : "Drag & drop or click to browse"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, DOC, DOCX, TXT · max 50 MB
            </p>
          </div>
        </div>
      </div>

      {rejection && (
        <p className="text-xs text-destructive">{rejection.message}</p>
      )}

      {/* Selected file preview */}
      {selectedFile && (
        <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card animate-in">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="h-4 w-4 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground font-mono">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={handleUpload}
              disabled={upload.isPending}
            >
              {upload.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Uploading…
                </>
              ) : (
                "Upload"
              )}
            </Button>
            {!upload.isPending && (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => setSelectedFile(null)}
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
