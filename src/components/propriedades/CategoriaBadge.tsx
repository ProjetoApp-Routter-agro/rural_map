import { cn } from "@/lib/utils";
import { Categoria, categoriaLabel } from "@/types/propriedade";

const COLORS: Record<Categoria, string> = {
  turismo: "bg-cat-turismo/15 text-cat-turismo border-cat-turismo/30",
  producao: "bg-cat-producao/15 text-cat-producao border-cat-producao/30",
  pecuaria: "bg-cat-pecuaria/15 text-cat-pecuaria border-cat-pecuaria/30",
  agrofloresta: "bg-cat-agrofloresta/15 text-cat-agrofloresta border-cat-agrofloresta/30",
  agricultura: "bg-cat-agricultura/15 text-cat-agricultura border-cat-agricultura/30",
  reserva: "bg-cat-reserva/15 text-cat-reserva border-cat-reserva/30",
  outro: "bg-cat-outro/15 text-cat-outro border-cat-outro/30",
};

export const CATEGORIA_HSL_VAR: Record<Categoria, string> = {
  turismo: "var(--cat-turismo)",
  producao: "var(--cat-producao)",
  pecuaria: "var(--cat-pecuaria)",
  agrofloresta: "var(--cat-agrofloresta)",
  agricultura: "var(--cat-agricultura)",
  reserva: "var(--cat-reserva)",
  outro: "var(--cat-outro)",
};

export function CategoriaBadge({
  categoria,
  className,
}: {
  categoria: Categoria;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        COLORS[categoria],
        className,
      )}
    >
      {categoriaLabel(categoria)}
    </span>
  );
}