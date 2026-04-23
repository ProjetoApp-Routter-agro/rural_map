import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Categoria, GeoJSONGeometry } from "@/types/propriedade";
import { PropriedadeForm } from "./PropriedadeForm";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  geometria: GeoJSONGeometry | null;
  onCreate: (values: {
    nome: string;
    categoria: Categoria;
    descricao: string;
    geometria: GeoJSONGeometry;
  }) => Promise<boolean>;
}

export function NovaPropriedadeDialog({ open, onOpenChange, geometria, onCreate }: Props) {
  if (!geometria) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova propriedade</DialogTitle>
          <DialogDescription>
            Preencha as informações da propriedade desenhada no mapa.
          </DialogDescription>
        </DialogHeader>
        <PropriedadeForm
          geometria={geometria}
          submitLabel="Cadastrar"
          onCancel={() => onOpenChange(false)}
          onSubmit={async (values) => {
            const ok = await onCreate({ ...values, geometria });
            if (ok) onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}