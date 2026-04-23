import { useEffect, useRef } from "react";
import L, { LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import type { GeoJSONGeometry, Propriedade } from "@/types/propriedade";
import { CATEGORIA_HSL_VAR } from "./CategoriaBadge";

interface MapViewProps {
  propriedades: Propriedade[];
  onSelect: (p: Propriedade) => void;
  /** Quando o usuário desenha algo novo no mapa. */
  onCreateGeometry: (geom: GeoJSONGeometry) => void;
  selectedId?: string | null;
}

// Pouso Alegre / Sul de MG como centro inicial
const CENTRO_INICIAL: [number, number] = [-22.2293, -45.9387];

function corCategoria(p: Propriedade): string {
  return `hsl(${CATEGORIA_HSL_VAR[p.categoria]})`;
}

function geomToLayer(p: Propriedade, onClick: () => void): L.Layer | null {
  const cor = corCategoria(p);
  const g = p.geometria;
  if (g.type === "Point") {
    const [lng, lat] = g.coordinates;
    const marker = L.circleMarker([lat, lng], {
      radius: 9,
      color: cor,
      fillColor: cor,
      weight: 2,
      fillOpacity: 0.8,
    });
    marker.on("click", onClick);
    marker.bindTooltip(p.nome, { direction: "top", offset: [0, -8] });
    return marker;
  }
  if (g.type === "Polygon" || g.type === "MultiPolygon" || g.type === "LineString") {
    const layer = L.geoJSON(g as GeoJSON.GeometryObject, {
      style: {
        color: cor,
        weight: 2,
        fillColor: cor,
        fillOpacity: 0.25,
      },
    });
    layer.on("click", onClick);
    layer.bindTooltip(p.nome, { sticky: true });
    return layer;
  }
  return null;
}

export function MapView({
  propriedades,
  onSelect,
  onCreateGeometry,
  selectedId,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersGroup = useRef<L.FeatureGroup | null>(null);
  const drawnGroup = useRef<L.FeatureGroup | null>(null);
  const fittedRef = useRef(false);
  const onCreateRef = useRef(onCreateGeometry);
  onCreateRef.current = onCreateGeometry;
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // Inicializa o mapa apenas uma vez
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: CENTRO_INICIAL,
      zoom: 11,
      zoomControl: true,
    });

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      },
    ).addTo(map);

    const group = L.featureGroup().addTo(map);
    const drawn = L.featureGroup().addTo(map);
    layersGroup.current = group;
    drawnGroup.current = drawn;

    // Controle de desenho
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const DrawControl = (L.Control as any).Draw;
    const drawControl = new DrawControl({
      position: "topleft",
      draw: {
        polygon: { allowIntersection: false, showArea: true },
        marker: true,
        polyline: false,
        rectangle: false,
        circle: false,
        circlemarker: false,
      },
      edit: { featureGroup: drawn, edit: false, remove: false },
    });
    map.addControl(drawControl);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map.on((L as any).Draw.Event.CREATED, (e: any) => {
      const layer = e.layer as L.Layer & { toGeoJSON: () => GeoJSON.Feature };
      const feature = layer.toGeoJSON();
      const geom = feature.geometry as GeoJSONGeometry;
      // Não persistimos o desenho no mapa: o componente pai decide
      onCreateRef.current(geom);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      layersGroup.current = null;
      drawnGroup.current = null;
    };
  }, []);

  // Re-renderiza camadas quando propriedades mudam
  useEffect(() => {
    const map = mapRef.current;
    const group = layersGroup.current;
    if (!map || !group) return;

    group.clearLayers();
    propriedades.forEach((p) => {
      const layer = geomToLayer(p, () => onSelectRef.current(p));
      if (layer) {
        // marca o id para localizar depois
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (layer as any)._propId = p.id;
        group.addLayer(layer);
      }
    });

    if (!fittedRef.current && propriedades.length > 0) {
      const bounds = group.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds.pad(0.15) as LatLngBoundsExpression);
        fittedRef.current = true;
      }
    }
  }, [propriedades]);

  // Foca a propriedade selecionada
  useEffect(() => {
    const map = mapRef.current;
    const group = layersGroup.current;
    if (!map || !group || !selectedId) return;
    let target: L.Layer | null = null;
    group.eachLayer((l) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((l as any)._propId === selectedId) target = l;
    });
    if (target) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const t = target as any;
      if (typeof t.getBounds === "function") {
        map.fitBounds(t.getBounds().pad(0.4));
      } else if (typeof t.getLatLng === "function") {
        map.setView(t.getLatLng(), Math.max(map.getZoom(), 14));
      }
    }
  }, [selectedId]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
