import { Search, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CATEGORIAS, Categoria, Propriedade } from "@/types/propriedade";
import { CategoriaBadge } from "./CategoriaBadge";
import { cn } from "@/lib/utils";

interface SidebarProps {
  propriedades: Propriedade[];
  total: number;
  busca: string;
  setBusca: (v: string) => void;
  filtro: Categoria | "todas";
  setFiltro: (v: Categoria | "todas") => void;
  onSelect: (p: Propriedade) => void;
  onUploadClick: () => void;
  onNovoClick: () => void;
  selectedId?: string | null;
}

export function Sidebar({
  propriedades,
  total,
  busca,
  setBusca,
  filtro,
  setFiltro,
  onSelect,
  onUploadClick,
  onNovoClick,
  selectedId,
}: SidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-card md:w-[340px]">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
              <path d="M12 2 4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight text-foreground">GeoRural</h1>
            <p className="text-xs text-muted-foreground">Gestão de propriedades</p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button onClick={onNovoClick} className="flex-1" size="sm">
            <Plus className="mr-1 h-4 w-4" /> Nova
          </Button>
          <Button onClick={onUploadClick} variant="outline" size="sm" className="flex-1">
            <Upload className="mr-1 h-4 w-4" /> KML
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="space-y-2 border-b border-border p-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            className="pl-8"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <Select value={filtro} onValueChange={(v) => setFiltro(v as Categoria | "todas")}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as categorias</SelectItem>
            {CATEGORIAS.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Mostrando <span className="font-semibold text-foreground">{propriedades.length}</span> de {total}
        </p>
      </div>

      {/* Lista */}
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {propriedades.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Nenhuma propriedade encontrada.
            </div>
          ) : (
            propriedades.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelect(p)}
                className={cn(
                  "w-full rounded-md border border-transparent px-3 py-2 text-left transition hover:bg-muted",
                  selectedId === p.id && "border-primary/30 bg-primary/5",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-foreground">
                      {p.nome}
                    </div>
                    {p.descricao && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {p.descricao}
                      </p>
                    )}
                  </div>
                  <CategoriaBadge categoria={p.categoria} />
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}