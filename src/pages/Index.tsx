import { useMemo, useState } from "react";
import { Sidebar } from "@/components/propriedades/Sidebar";
import { MapView } from "@/components/propriedades/MapView";
import { PropriedadeDialog } from "@/components/propriedades/PropriedadeDialog";
import { NovaPropriedadeDialog } from "@/components/propriedades/NovaPropriedadeDialog";
import { UploadKMLDialog } from "@/components/propriedades/UploadKMLDialog";
import { usePropriedades } from "@/hooks/usePropriedades";
import type { Categoria, GeoJSONGeometry, Propriedade } from "@/types/propriedade";

/**
 * Página principal — GeoRural
 * Sidebar (lista + filtros) | Mapa interativo
 */
const Index = () => {
  const { propriedades, criar, criarMuitas, atualizar, excluir } = usePropriedades();

  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Categoria | "todas">("todas");
  const [selecionada, setSelecionada] = useState<Propriedade | null>(null);
  const [detalheOpen, setDetalheOpen] = useState(false);
  const [novaGeom, setNovaGeom] = useState<GeoJSONGeometry | null>(null);
  const [novaOpen, setNovaOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const filtradas = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return propriedades.filter((p) => {
      if (filtro !== "todas" && p.categoria !== filtro) return false;
      if (q && !p.nome.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [propriedades, busca, filtro]);

  const abrirDetalhe = (p: Propriedade) => {
    setSelecionada(p);
    setDetalheOpen(true);
  };

  return (
    <div className="flex h-screen flex-col bg-background md:flex-row">
      <Sidebar
        propriedades={filtradas}
        total={propriedades.length}
        busca={busca}
        setBusca={setBusca}
        filtro={filtro}
        setFiltro={setFiltro}
        onSelect={abrirDetalhe}
        onUploadClick={() => setUploadOpen(true)}
        onNovoClick={() => {
          // Abre nova com geometria placeholder no centro do mapa atual?
          // UX: orientamos o usuário a desenhar no mapa.
          // Aqui abrimos com um ponto fictício em Pouso Alegre como ponto de partida.
          setNovaGeom({ type: "Point", coordinates: [-45.9387, -22.2293] });
          setNovaOpen(true);
        }}
        selectedId={selecionada?.id ?? null}
      />

      <main className="relative flex-1">
        <MapView
          propriedades={filtradas}
          onSelect={abrirDetalhe}
          onCreateGeometry={(geom) => {
            setNovaGeom(geom);
            setNovaOpen(true);
          }}
          selectedId={selecionada?.id ?? null}
        />

        {/* Dica flutuante */}
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-[400] -translate-x-1/2 rounded-full bg-card/95 px-4 py-2 text-xs text-muted-foreground shadow-md backdrop-blur">
          Use as ferramentas no canto superior esquerdo para desenhar uma nova propriedade.
        </div>
      </main>

      <PropriedadeDialog
        propriedade={selecionada}
        open={detalheOpen}
        onOpenChange={setDetalheOpen}
        onSave={(id, values) => atualizar(id, values)}
        onDelete={excluir}
      />

      <NovaPropriedadeDialog
        open={novaOpen}
        onOpenChange={(o) => {
          setNovaOpen(o);
          if (!o) setNovaGeom(null);
        }}
        geometria={novaGeom}
        onCreate={(values) =>
          criar({
            nome: values.nome,
            categoria: values.categoria,
            descricao: values.descricao,
            geometria: values.geometria,
          })
        }
      />

      <UploadKMLDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onImport={criarMuitas}
      />
    </div>
  );
};

export default Index;
