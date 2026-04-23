-- Enum de categorias
CREATE TYPE public.categoria_propriedade AS ENUM (
  'turismo',
  'producao',
  'pecuaria',
  'agrofloresta',
  'agricultura',
  'reserva',
  'outro'
);

-- Tabela de propriedades rurais
CREATE TABLE public.propriedades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  categoria public.categoria_propriedade NOT NULL DEFAULT 'outro',
  descricao TEXT,
  geometria JSONB NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_propriedades_categoria ON public.propriedades(categoria);
CREATE INDEX idx_propriedades_nome ON public.propriedades(nome);

-- RLS aberto (sistema sem autenticação, uso interno)
ALTER TABLE public.propriedades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualquer um pode ver propriedades"
  ON public.propriedades FOR SELECT USING (true);

CREATE POLICY "Qualquer um pode criar propriedades"
  ON public.propriedades FOR INSERT WITH CHECK (true);

CREATE POLICY "Qualquer um pode editar propriedades"
  ON public.propriedades FOR UPDATE USING (true);

CREATE POLICY "Qualquer um pode excluir propriedades"
  ON public.propriedades FOR DELETE USING (true);

-- Trigger para atualizar atualizado_em
CREATE OR REPLACE FUNCTION public.update_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_propriedades_atualizado_em
  BEFORE UPDATE ON public.propriedades
  FOR EACH ROW
  EXECUTE FUNCTION public.update_atualizado_em();