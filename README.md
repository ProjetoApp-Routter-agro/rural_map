# GeoRural — Gestão de Propriedades Rurais Georreferenciadas

Aplicação web para importar arquivos **KML**, visualizar propriedades rurais em um **mapa interativo** (Leaflet + OpenStreetMap) e realizar **CRUD completo** (criar, ler, editar, excluir).

Pensado como um **CRM geográfico rural** para regiões como Pouso Alegre/MG.

## ✨ Funcionalidades

- 📤 **Upload de KML** — importa pontos e polígonos automaticamente
- 🗺️ **Mapa interativo** com Leaflet — visualize todas as propriedades
- 🖱️ **Popup ao clicar** — vê nome, categoria, descrição, com botões de Editar e Excluir
- ✏️ **Cadastro manual** — desenhe um ponto ou polígono direto no mapa
- 🔎 **Busca por nome** e **filtro por categoria**
- ♻️ **Realtime** — alterações aparecem em tempo real (Lovable Cloud)

## 🏷️ Categorias suportadas

Turismo, Produção, Pecuária, Agrofloresta, Agricultura, Reserva, Outro.

## 🧱 Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Mapa**: Leaflet + leaflet-draw + OpenStreetMap
- **Parser KML**: `@tmcw/togeojson`
- **Backend**: Lovable Cloud (Supabase) — PostgreSQL com geometria como GeoJSON (JSONB)

## 🗄️ Estrutura do banco

Tabela `propriedades`:

| Coluna        | Tipo        | Descrição                                |
|---------------|-------------|------------------------------------------|
| id            | uuid (PK)   | Identificador                            |
| nome          | text        | Nome da propriedade                      |
| categoria     | enum        | turismo, producao, pecuaria, ...         |
| descricao     | text        | Descrição livre                          |
| geometria     | jsonb       | GeoJSON (Point / Polygon / MultiPolygon) |
| criado_em     | timestamptz | Criado em                                |
| atualizado_em | timestamptz | Atualizado em (trigger)                  |

## 🚀 Rodando localmente no VS Code

```bash
git clone <SEU_REPO_URL>
cd <NOME_DO_PROJETO>
npm install
npm run dev
```

Abra `http://localhost:8080`. O Lovable Cloud já está configurado — não há `.env` para preencher.

## 📂 Dados de exemplo

Veja `public/exemplo-pouso-alegre.kml`. No app, clique em **KML** e selecione o arquivo para importar 5 propriedades de exemplo em Pouso Alegre/MG.

## 🗂️ Estrutura de pastas

```
src/
  components/
    propriedades/      # Mapa, Sidebar, Dialogs (CRUD)
    ui/                # shadcn/ui
  hooks/
    usePropriedades.ts # CRUD + realtime
  lib/
    kml.ts             # Parser KML → GeoJSON
  pages/Index.tsx      # Página principal
  types/propriedade.ts # Tipos do domínio
  integrations/supabase/  # Cliente Lovable Cloud
public/exemplo-pouso-alegre.kml
supabase/migrations/   # Migrações SQL
```
# rural_map
