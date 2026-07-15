-- No Pain No Gain ft. Sofi — esquema inicial
-- Ejecutar en Supabase: Dashboard > SQL Editor > New query > pegar todo > Run

create extension if not exists pgcrypto;

-- ============================================================
-- usuarios
-- Preparada para multi-usuario desde el inicio, aunque hoy
-- solo exista una fila (Sofi) y no haya pantalla de login.
-- ============================================================
create table usuarios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  altura_cm numeric,
  peso_kg numeric,
  objetivo_agua_ml integer not null default 2000,
  created_at timestamptz not null default now()
);

-- ============================================================
-- rutinas ("Tren superior", "Full body", etc.)
-- ============================================================
create table rutinas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references usuarios(id) on delete cascade,
  nombre text not null,
  orden integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ejercicios de cada rutina. Siempre 4 series (fijo, no configurable).
-- ============================================================
create table ejercicios (
  id uuid primary key default gen_random_uuid(),
  rutina_id uuid not null references rutinas(id) on delete cascade,
  user_id uuid not null references usuarios(id) on delete cascade,
  nombre text not null,
  orden integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- entrenamientos: una sesión de entrenamiento (el cronómetro).
-- rutina_nombre queda como "foto" del nombre al momento de entrenar,
-- para que el historial no cambie si después renombrás o borrás la rutina.
-- ============================================================
create table entrenamientos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references usuarios(id) on delete cascade,
  rutina_id uuid references rutinas(id) on delete set null,
  rutina_nombre text not null,
  iniciado_en timestamptz not null default now(),
  finalizado_en timestamptz,
  comentario text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- series_entrenamiento: cada una de las 4 series cargadas por
-- ejercicio dentro de un entrenamiento (peso + repeticiones).
-- ============================================================
create table series_entrenamiento (
  id uuid primary key default gen_random_uuid(),
  entrenamiento_id uuid not null references entrenamientos(id) on delete cascade,
  ejercicio_id uuid references ejercicios(id) on delete set null,
  ejercicio_nombre text not null,
  numero_serie smallint not null check (numero_serie between 1 and 4),
  peso_kg numeric,
  repeticiones integer,
  completada boolean not null default false,
  created_at timestamptz not null default now(),
  unique (entrenamiento_id, ejercicio_id, numero_serie)
);

-- ============================================================
-- registros_hidratacion: un registro por cada "+250 ml" / "+500 ml".
-- El total del día y el historial se calculan sumando por fecha.
-- ============================================================
create table registros_hidratacion (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references usuarios(id) on delete cascade,
  fecha date not null default current_date,
  cantidad_ml integer not null check (cantidad_ml > 0),
  created_at timestamptz not null default now()
);

-- ============================================================
-- índices para las consultas más frecuentes
-- ============================================================
create index idx_rutinas_user on rutinas(user_id);
create index idx_ejercicios_rutina on ejercicios(rutina_id);
create index idx_entrenamientos_user on entrenamientos(user_id, iniciado_en desc);
create index idx_series_entrenamiento on series_entrenamiento(entrenamiento_id);
create index idx_series_ejercicio on series_entrenamiento(ejercicio_id, created_at desc);
create index idx_hidratacion_user_fecha on registros_hidratacion(user_id, fecha);

-- ============================================================
-- Row Level Security: habilitada en todas las tablas.
-- Hoy no hay login, así que la policy permite todo a través de la
-- anon key. El día que agreguemos autenticación, estas policies se
-- reemplazan por reglas del tipo "auth.uid() = user_id" sin tocar
-- el resto de la app.
-- ============================================================
alter table usuarios enable row level security;
alter table rutinas enable row level security;
alter table ejercicios enable row level security;
alter table entrenamientos enable row level security;
alter table series_entrenamiento enable row level security;
alter table registros_hidratacion enable row level security;

create policy "permitir todo (sin auth todavia)" on usuarios for all using (true) with check (true);
create policy "permitir todo (sin auth todavia)" on rutinas for all using (true) with check (true);
create policy "permitir todo (sin auth todavia)" on ejercicios for all using (true) with check (true);
create policy "permitir todo (sin auth todavia)" on entrenamientos for all using (true) with check (true);
create policy "permitir todo (sin auth todavia)" on series_entrenamiento for all using (true) with check (true);
create policy "permitir todo (sin auth todavia)" on registros_hidratacion for all using (true) with check (true);

-- ============================================================
-- Semilla: tu usuario. La app va a leer siempre "el primer usuario"
-- de esta tabla (no hay login todavía, así que no hace falta un id fijo).
-- ============================================================
insert into usuarios (nombre) values ('Sofi');
