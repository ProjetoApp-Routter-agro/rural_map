import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Categoria, GeoJSONGeometry, Propriedade } from "@/types/propriedade";
import { CategoriaBadge } from "./CategoriaBadge";
import { PropriedadeForm } from "./PropriedadeForm";

interface Props {
  propriedade: Propriedade | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, values: { nome: string; categoria: Categoria; descricao: string }) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

/**
 * Dialog que mostra detalhes da propriedade e permite editar/excluir.
 */
export function PropriedadeDialog({
  propriedade,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: Props) {
  const [editando, setEditando] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  if (!propriedade) return null;

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(o) => {
          onOpenChange(o);
          if (!o) setEditando(false);
        }}
      >
        <DialogContent className="max-w-md">
          {!editando ? (
            <>
              <DialogHeader>
                <DialogTitle className="pr-8 text-xl">{propriedade.nome}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 pt-1">
                  <CategoriaBadge categoria={propriedade.categoria} />
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Descrição
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">
                    {propriedade.descricao?.trim() || (
                      <span className="italic text-muted-foreground">Sem descrição.</span>
                    )}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                  <div>
                    <p className="font-medium uppercase tracking-wide">Tipo</p>
                    <p className="mt-0.5 text-foreground">
                      {propriedade.geometria.type === "Point" ? "Ponto" : "Polígono"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium uppercase tracking-wide">Criado em</p>
                    <p className="mt-0.5 text-foreground">
                      {new Date(propriedade.criado_em).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setConfirmDel(true)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-1 h-4 w-4" /> Excluir
                </Button>
                <Button onClick={() => setEditando(true)}>
                  <Pencil className="mr-1 h-4 w-4" /> Editar
                </Button>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Editar propriedade</DialogTitle>
              </DialogHeader>
              <PropriedadeForm
                initial={propriedade}
                geometria={propriedade.geometria as GeoJSONGeometry}
                submitLabel="Salvar alterações"
                onCancel={() => setEditando(false)}
                onSubmit={async (values) => {
                  const ok = await onSave(propriedade.id, values);
                  if (ok) setEditando(false);
                }}
              />
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDel} onOpenChange={setConfirmDel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir propriedade?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação removerá <strong>{propriedade.nome}</strong> permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                const ok = await onDelete(propriedade.id);
                if (ok) {
                  setConfirmDel(false);
                  onOpenChange(false);
                }
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}