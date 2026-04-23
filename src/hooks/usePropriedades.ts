import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Propriedade, PropriedadeInput, GeoJSONGeometry } from "@/types/propriedade";
import type { Json } from "@/integrations/supabase/types";
import { toast } from "sonner";

const toJson = (g: GeoJSONGeometry): Json => g as unknown as Json;

/**
 * Hook que centraliza o CRUD de propriedades contra o Lovable Cloud.
 */
export function usePropriedades() {
  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [loading, setLoading] = useState(true);

  const carregar = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("propriedades")
      .select("*")
      .order("criado_em", { ascending: false });
    if (error) {
      toast.error("Erro ao carregar propriedades", { description: error.message });
    } else {
      setPropriedades((data ?? []) as unknown as Propriedade[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    carregar();

    // Realtime: atualiza ao haver mudanças
    const channel = supabase
      .channel("propriedades-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "propriedades" },
        () => carregar(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [carregar]);

  const criar = useCallback(async (input: PropriedadeInput) => {
    const { error } = await supabase.from("propriedades").insert({
      nome: input.nome,
      categoria: input.categoria,
      descricao: input.descricao ?? null,
      geometria: toJson(input.geometria),
    });
    if (error) {
      toast.error("Erro ao criar", { description: error.message });
      return false;
    }
    toast.success("Propriedade criada");
    return true;
  }, []);

  const criarMuitas = useCallback(async (inputs: PropriedadeInput[]) => {
    if (inputs.length === 0) return false;
    const rows = inputs.map((i) => ({
      nome: i.nome,
      categoria: i.categoria,
      descricao: i.descricao ?? null,
      geometria: toJson(i.geometria),
    }));
    const { error } = await supabase.from("propriedades").insert(rows);
    if (error) {
      toast.error("Erro ao importar", { description: error.message });
      return false;
    }
    toast.success(`${inputs.length} propriedade(s) importada(s)`);
    return true;
  }, []);

  const atualizar = useCallback(
    async (id: string, input: Partial<PropriedadeInput>) => {
      const patch: {
        nome?: string;
        categoria?: PropriedadeInput["categoria"];
        descricao?: string | null;
        geometria?: Json;
      } = {};
      if (input.nome !== undefined) patch.nome = input.nome;
      if (input.categoria !== undefined) patch.categoria = input.categoria;
      if (input.descricao !== undefined) patch.descricao = input.descricao;
      if (input.geometria !== undefined) patch.geometria = toJson(input.geometria);
      const { error } = await supabase.from("propriedades").update(patch).eq("id", id);
      if (error) {
        toast.error("Erro ao atualizar", { description: error.message });
        return false;
      }
      toast.success("Propriedade atualizada");
      return true;
    },
    [],
  );

  const excluir = useCallback(async (id: string) => {
    const { error } = await supabase.from("propriedades").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir", { description: error.message });
      return false;
    }
    toast.success("Propriedade excluída");
    return true;
  }, []);

  return { propriedades, loading, carregar, criar, criarMuitas, atualizar, excluir };
}