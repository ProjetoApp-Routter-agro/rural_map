import { kml as kmlToGeoJSON } from "@tmcw/togeojson";
import type { GeoJSONGeometry, PropriedadeInput, Categoria } from "@/types/propriedade";

/**
 * Faz o parse de um conteúdo KML e devolve uma lista de propriedades
 * prontas para serem inseridas no banco.
 */
export function parseKML(kmlText: string): PropriedadeInput[] {
  const parser = new DOMParser();
  const xml = parser.parseFromString(kmlText, "text/xml");

  // Detecta erro de parsing
  if (xml.getElementsByTagName("parsererror").length > 0) {
    throw new Error("Arquivo KML inválido.");
  }

  const geo = kmlToGeoJSON(xml);
  const features = geo.features ?? [];

  const propriedades: PropriedadeInput[] = [];

  for (const f of features) {
    if (!f.geometry) continue;
    const t = f.geometry.type;
    if (!["Point", "Polygon", "MultiPolygon", "LineString"].includes(t)) continue;

    const props = (f.properties ?? {}) as Record<string, unknown>;
    const nome =
      (props.name as string) ||
      (props.Name as string) ||
      "Propriedade sem nome";
    const descricao =
      (props.description as string) ||
      (props.Description as string) ||
      null;

    propriedades.push({
      nome,
      categoria: inferirCategoria(nome, descricao),
      descricao,
      geometria: f.geometry as GeoJSONGeometry,
    });
  }

  return propriedades;
}

/** Tenta adivinhar a categoria a partir do nome/descrição. */
function inferirCategoria(nome: string, descricao: string | null): Categoria {
  const txt = `${nome} ${descricao ?? ""}`.toLowerCase();
  if (/(turism|pousada|hotel|hospedagem)/.test(txt)) return "turismo";
  if (/(pecu|gado|boi|leit)/.test(txt)) return "pecuaria";
  if (/(agroflor|saf)/.test(txt)) return "agrofloresta";
  if (/(agricult|plant|lavoura|caf|hort)/.test(txt)) return "agricultura";
  if (/(reserva|preserv|apa|rppn)/.test(txt)) return "reserva";
  if (/(produ|f[aá]brica|ind[uú]stria)/.test(txt)) return "producao";
  return "outro";
}