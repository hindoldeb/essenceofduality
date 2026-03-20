import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  currentUrl?: string;
  onUploaded: (url: string) => void;
  label?: string;
  className?: string;
}

export default function ImageUpload({ currentUrl, onUploaded, label = "Upload Image", className = "" }: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(currentUrl || "");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = trpc.admin.uploadImage.useMutation({
    onSuccess: (data) => {
      setPreview(data.url);
      onUploaded(data.url);
      toast.success("Image uploaded successfully");
      setUploading(false);
    },
    onError: (err) => {
      toast.error("Upload failed: " + err.message);
      setUploading(false);
    },
  });

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("Image must be under 10MB"); return; }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string).split(",")[1];
      upload.mutate({ filename: file.name, contentType: file.type, dataBase64: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div
        className="border border-gold/20 hover:border-gold/50 transition-all cursor-pointer relative overflow-hidden"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        {preview ? (
          <div className="relative group">
            <img src={preview} alt="Preview" className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="font-mono text-xs text-gold">Click to replace</p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setPreview(""); onUploaded(""); }}
              className="absolute top-2 right-2 bg-black/70 text-cream-dim hover:text-destructive p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="h-32 flex flex-col items-center justify-center gap-2 bg-card/50">
            {uploading ? (
              <Loader2 size={20} className="text-gold animate-spin" />
            ) : (
              <>
                <Upload size={20} className="text-gold/40" />
                <p className="font-mono text-xs text-cream-dim/50">{label}</p>
                <p className="font-mono text-xs text-cream-dim/30">Drag & drop or click</p>
              </>
            )}
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
}
