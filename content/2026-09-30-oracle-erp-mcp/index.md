---
title: "Un MCP en Rust para consultar el diccionario técnico de Oracle Fusion ERP"
date: 2026-09-30
tags: [oracle, mcp, ai, rust]
path: blog/oracle-erp-mcp
cover: ./preview.jpg
excerpt: "Nació de un dolor real: construir reportes BI sobre Oracle Fusion con un agente que se inventa tablas y columnas. Indexé el diccionario técnico en SQLite + FTS5 y lo expuse como servidor MCP en Rust."
---

Este proyecto no nació de una idea bonita, nació de un dolor muy concreto: **construir reportes BI sobre Oracle Fusion con un agente de IA que se inventa las tablas**.

El equipo trabaja a diario contra el diccionario técnico de Oracle Fusion, y la documentación oficial es —siendo generoso— hostil: miles de tablas repartidas en el *Oracle Help Center*, sin un buscador decente, versionadas release por release y con la información dispersa entre páginas que un LLM no puede recorrer en tiempo de inferencia. El resultado es predecible: le pides al agente de Cursor un reporte, escribe la consulta con `AP_INVOICES_...` y el nombre real de la tabla era otro, o la columna que usa simplemente no existe. Y ese error no revienta al compilar: aparece cuando el reporte ya está en manos de alguien y los números no cuadran.

De ahí nació **oracle-fusion-erp-catalog-mcp**: un RAG léxico, sin embeddings, empaquetado como servidor [MCP](https://modelcontextprotocol.io) en Rust. Indexa localmente el diccionario técnico de Oracle Fusion Financials y SCM y expone herramientas de consulta exacta, búsqueda léxica, estructura y **joins reales**. La meta es concreta: que el equipo construya reportes BI con metadatos verificables en lugar de nombres inventados.

## Por qué un índice léxico y no embeddings

Lo importante es entender que el diccionario **sí es información oficial y precisa**: publica, release por release (26A, 26B, …), las tablas de cada módulo con sus columnas, índices y referencias. El problema no es la calidad del dato, es el formato:

- está pensado para leerse en un navegador, no para consultarse;
- cambia entre releases y conviene mantenerlas separadas;
- un agente no puede recorrerlo en tiempo de inferencia.

Y como los metadatos son nombres técnicos (`AP_INVOICES_ALL`, `PO_HEADERS_ALL`), un índice **léxico local** rinde mejor que uno vectorial: la búsqueda exacta + FTS5 es determinista, explicable, offline y no depende de que un embedding "entienda" el nombre de una tabla de Oracle.

## Arquitectura

El binario es una sola pieza con responsabilidades separadas:

```text
src/
├── main.rs    # transporte JSON-RPC 2.0 sobre stdin/stdout + CLI
├── db.rs      # modelos, esquema SQLite, FTS5 y queries
├── paths.rs   # rutas de datos por plataforma
├── install.rs # registro global en Cursor, Claude Code, Codex y OpenCode
└── sync.rs    # extracción desde Oracle Help Center y sincronización trimestral
```

Sin argumentos, el binario habla MCP: entra JSON-RPC 2.0 por stdin y sale por stdout. **Los logs van a stderr**, porque un solo `println!` contamina el protocolo y rompe al cliente. Ese detalle, que parece trivial, es la convención que más veces se viola al escribir servidores MCP.

```sh
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' \
  | oracle-fusion-erp-catalog-mcp
```

## El modelo de datos

Todo vive en SQLite (con `rusqlite` en modo `bundled`, sin dependencias del sistema). El esquema separa releases, tablas, columnas, referencias e índices:

```sql
CREATE TABLE versions (
    id INTEGER PRIMARY KEY,
    release_code TEXT NOT NULL UNIQUE,
    synced_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active_bool INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE tables (
    id INTEGER PRIMARY KEY,
    version_id INTEGER NOT NULL REFERENCES versions(id) ON DELETE CASCADE,
    module TEXT NOT NULL,
    table_name TEXT NOT NULL,
    description TEXT,
    source_url TEXT,
    object_type TEXT,
    UNIQUE(version_id, table_name)
);

CREATE VIRTUAL TABLE tables_fts USING fts5(
    table_name,
    table_description,
    column_names,
    column_descriptions,
    table_id UNINDEXED,
    version_id UNINDEXED,
    tokenize = 'unicode61 remove_diacritics 2'
);
```

Dos decisiones importantes: cada release es una fila en `versions`, y **solo la release activa se consulta** (salvo que una función pida explícitamente otra). Así puedes sincronizar 26B sin perder 26A, y comparar.

## Buscar bien es buscar en dos pasos

La herramienta `search_table_structure` no confía solo en FTS5. Primero busca coincidencia exacta por nombre y luego completa con la búsqueda léxica: si escribes el nombre real de la tabla, no quieres que un resultado "parecido" se cuele arriba.

```sql
SELECT t.id, t.table_name, t.description, t.source_url
FROM tables t WHERE t.version_id = ?1 AND t.table_name = ?2
UNION ALL
SELECT t.id, t.table_name, t.description, t.source_url
FROM tables_fts f JOIN tables t ON t.id = f.table_id
WHERE f.version_id = ?1 AND tables_fts MATCH ?3 AND t.table_name <> ?2
ORDER BY table_name LIMIT ?4
```

Y el término del usuario se sanea antes de entrar a FTS5, porque la sintaxis de `MATCH` no es la de `LIKE`: los operadores especiales hacen que una consulta cualquiera explote con un error de sintaxis.

```rust
let fts_query = format!("\"{}\"*", query.replace('"', " "));
```

Comillas fuera, prefijo a la derecha y listo: `AP_INV*` encuentra `AP_INVOICES_ALL` sin interpretar nada raro.

## Joins sin adivinar

La parte que más tiempo ahorra es `suggest_joins`. Las referencias de clave foránea ya están extraídas, así que la herramienta responde con las columnas exactas que conectan dos tablas, en cualquiera de las dos direcciones:

```sql
SELECT r.source_column, r.target_column, r.constraint_name
FROM foreign_key_references r
JOIN tables source ON source.id = r.source_table_id
JOIN tables target ON target.id = r.target_table_id
WHERE source.version_id = ?1
  AND ((source.table_name = upper(?2) AND target.table_name = upper(?3))
    OR (source.table_name = upper(?3) AND target.table_name = upper(?2)))
ORDER BY r.id
```

En lugar de que el agente proponga un join "probable", recibe el constraint real que Oracle publica.

## Sincronización versionada

El comando `sync` descarga y parsea el diccionario desde Oracle Help Center, y trabaja por release y módulo:

```sh
oracle-fusion-erp-catalog-mcp sync --release 26B
oracle-fusion-erp-catalog-mcp sync --release 26B --module scm --no-activate
```

Al terminar, activa la release nueva y elimina la anterior solo si tuvo éxito. Si un módulo falta, se puede mergear en una release existente en vez de crear una incompleta.

## Cosas que aprendí construyéndolo

- **El índice FTS5 hay que persistirlo explícitamente.** Al principio se reconstruía en cada arranque y el servidor tardaba de más; ahora se puebla al sincronizar y se reconstruye solo cuando una migración lo exige.
- **Migrar de esquema se vuelve urgente.** La primera versión tenía el esquema en español (`tablas`, `columnas`, `referencias`). Renombrarlo después implicó una migración con detección de columnas y reconstrucción del índice, no un simple `ALTER TABLE`.
- **`panic!`/`unwrap()` no tienen lugar aquí.** El servidor nunca debe morir por una entrada rara: todo se propaga con `Result` y `thiserror`, y los tests (`cargo test --workspace`) cubren el proceso MCP completo, no solo las funciones.
- **No inventar metadatos es un requisito, no un estilo.** Cada fila conserva release, módulo y `source_url`; si un dato no está en la fuente, no existe.
- **Los instaladores de agentes son configuración ajena.** El registro en Cursor, Claude Code, Codex y OpenCode es idempotente, preserva lo que no le pertenece y soporta `--dry-run`.

## Cómo probarlo

```sh
curl -fsSL \
  https://raw.githubusercontent.com/thegreatyamori/oracle-fusion-erp-catalog-mcp/main/scripts/install.sh \
  | sh

oracle-fusion-erp-catalog-mcp sync --release 26B
oracle-fusion-erp-catalog-mcp install opencode --binary "$HOME/.local/bin/oracle-fusion-erp-catalog-mcp"
```

La base se resuelve al directorio de datos del usuario según la plataforma, y `ORACLE_MCP_DATABASE` la puede sobrescribir.

## Cierre

La lección de fondo no es "usa FTS5": es que **un agente solo es útil si sus herramientas son deterministas**. Cuando puede pedir la estructura real de una tabla y el join que Oracle publica, deja de adivinar y empieza a construir. Ese era exactamente el punto: el equipo no debería gastar la tarde reconciliando nombres de columnas inventados, debería gastarla en el reporte BI. Meter el diccionario en SQLite con herramientas precisas cuesta mucho menos que depurar un número equivocado.

*Oracle y Oracle Fusion son marcas de Oracle Corporation. Este proyecto no está afiliado ni respaldado por Oracle.*
