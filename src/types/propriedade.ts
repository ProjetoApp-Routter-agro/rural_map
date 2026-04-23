/**
 * Tipos compartilhados do domínio de Propriedades Rurais.
 */

export type Categoria =
  | "turismo"
  | "producao"
  | "pecuaria"
  | "agrofloresta"
  | "agricultura"
  | "reserva"
  | "outro";

export const CATEGORIAS: { value: Categoria; label: string }[] = [
  { value: "turismo", label: "Turismo" },
  { value: "producao", label: "Produção" },
  { value: "pecuaria", label: "Pecuária" },
  { value: "agrofloresta", label: "Agrofloresta" },
  { value: "agricultura", label: "Agricultura" },
  { value: "reserva", label: "Reserva" },
  { value: "outro", label: "Outro" },
];

export const categoriaLabel = (c: Categoria) =>
  CATEGORIAS.find((x) => x.value === c)?.label ?? c;

/** GeoJSON Geometry simplificada (Point | Polygon). */
export type GeoJSONGeometry =
  | { type: "Point"; coordinates: [number, number] }
  | { type: "Polygon"; coordinates: [number, number][][] }
  | { type: "MultiPolygon"; coordinates: [number, number][][][] }
  | { type: "LineString"; coordinates: [number, number][] };

export interface Propriedade {
  id: string;
  nome: string;
  categoria: Categoria;
  descricao: string | null;
  geometria: GeoJSONGeometry;
  criado_em: string;
  atualizado_em: string;
}

export type PropriedadeInput = {
  nome: string;
  categoria: Categoria;
  descricao?: string | null;
  geometria: GeoJSONGeometry;
};