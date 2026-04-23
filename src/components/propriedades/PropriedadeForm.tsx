import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIAS, Categoria, GeoJSONGeometry, Propriedade } from "@/types/propriedade";

interface Props {
  initial?: Partial<Propriedade>;
  geometria: GeoJSONGeometry;
  onSubmit: (values: { nome: string; categoria: Categoria; descricao: string }) => void;
  onCancel: () => void;
  submitLabel?: string;
}

/**
 * Formulário compartilhado para criação e edição de propriedades.
 * A geometria é definida fora do formulário (clique no mapa, KML, draw).
 */
export function PropriedadeForm({
  initial,
  geometria,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
}: Props) {
  const [nome, setNome] = useState(initial?.nome ?? "");
  const [categoria, setCategoria] = useState<Categoria>(
    (initial?.categoria as Categoria) ?? "outro",
  );
  const [descricao, setDescricao] = useState(initial?.descricao ?? "");

  useEffect(() => {
    setNome(initial?.nome ?? "");
    setCategoria((initial?.categoria as Categoria) ?? "outro");
    setDescricao(initial?.descricao ?? "");
  }, [initial]);

  const tipoGeometria =
    geometria.type === "Point"
      ? "Ponto"
      : geometria.type === "Polygon" || geometria.type === "MultiPolygon"
        ? "Polígono"
        : "Linha";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!nome.trim()) return;
        onSubmit({ nome: nome.trim(), categoria, descricao: descricao.trim() });
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="nome">Nome da propriedade *</Label>
        <Input
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex.: Fazenda Boa Vista"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Categoria</Label>
        <Select value={categoria} onValueChange={(v) => setCategoria(v as Categoria)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIAS.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Informações adicionais sobre a propriedade..."
          rows={4}
        />
      </div>

      <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
        Geometria: <span className="font-medium text-foreground">{tipoGeometria}</span>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}