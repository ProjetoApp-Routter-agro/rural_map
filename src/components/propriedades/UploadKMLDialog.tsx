import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";
import { parseKML } from "@/lib/kml";
import type { PropriedadeInput } from "@/types/propriedade";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (props: PropriedadeInput[]) => Promise<boolean>;
}

export function UploadKMLDialog({ open, onOpenChange, onImport }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<PropriedadeInput[] | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [importing, setImporting] = useState(false);

  const handleFile = async (file: File) => {
    try {
      const text = await file.text();
      const props = parseKML(text);
      if (props.length === 0) {
        toast.warning("Nenhuma propriedade encontrada no KML.");
        return;
      }
      setPreview(props);
      setFileName(file.name);
    } catch (e) {
      toast.error("Erro ao ler KML", {
        description: e instanceof Error ? e.message : String(e),
      });
    }
  };

  const reset = () => {
    setPreview(null);
    setFileName("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const importar = async () => {
    if (!preview) return;
    setImporting(true);
    const ok = await onImport(preview);
    setImporting(false);
    if (ok) {
      reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) reset();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Importar KML</DialogTitle>
          <DialogDescription>
            Selecione um arquivo .kml com propriedades (pontos ou polígonos).
          </DialogDescription>
        </DialogHeader>

        {!preview ? (
          <div
            onClick={() => inputRef.current?.click()}
            className="cursor-pointer rounded-lg border-2 border-dashed border-border p-8 text-center transition hover:border-primary/50 hover:bg-muted/40"
          >
            <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium text-foreground">
              Clique para selecionar um arquivo KML
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              ou arraste e solte aqui
            </p>
            <input
              ref={inputRef}
              type="file"
              accept=".kml,application/vnd.google-earth.kml+xml,text/xml"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="truncate text-sm">{fileName}</span>
            </div>
            <p className="text-sm text-foreground">
              <strong>{preview.length}</strong> propriedade(s) detectada(s):
            </p>
            <ul className="max-h-48 overflow-y-auto rounded-md border border-border text-sm">
              {preview.slice(0, 50).map((p, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between border-b border-border px-3 py-1.5 last:border-b-0"
                >
                  <span className="truncate">{p.nome}</span>
                  <span className="text-xs text-muted-foreground">
                    {p.geometria.type === "Point" ? "ponto" : "polígono"}
                  </span>
                </li>
              ))}
              {preview.length > 50 && (
                <li className="px-3 py-1.5 text-xs text-muted-foreground">
                  ...e mais {preview.length - 50}
                </li>
              )}
            </ul>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={reset} disabled={importing}>
                Trocar arquivo
              </Button>
              <Button onClick={importar} disabled={importing}>
                {importing ? "Importando..." : `Importar ${preview.length}`}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}