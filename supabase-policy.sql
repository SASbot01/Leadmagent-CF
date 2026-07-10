-- =========================================================================
-- Activa el guardado de leads del diagnóstico (Leadmagent-CF) en `all_leads`
-- usando la anon key (pública) del navegador.
--
-- Ejecútalo EN BLOQUE (selecciónalo TODO y Run) en:
--   Supabase → SQL Editor → New query
--
-- IMPORTANTE: ejecuta las 5 sentencias juntas. La última (SELECT) debe
-- devolver una fila con roles={anon}, cmd=INSERT → así confirmas que quedó bien.
--
-- Seguridad: la anon key SOLO podrá INSERTAR filas con project='creatorfounder'.
-- No puede leer, editar ni borrar nada. El repo Next.js usa service_role
-- (bypassa RLS), así que esto no le afecta.
-- =========================================================================

grant insert on table public.all_leads to anon;

alter table public.all_leads enable row level security;

drop policy if exists "anon insert diagnostico creatorfounder" on public.all_leads;

create policy "anon insert diagnostico creatorfounder"
  on public.all_leads
  for insert
  to anon
  with check (project = 'creatorfounder');

-- Verificación (debe listar la policy):
select policyname, roles, cmd
from pg_policies
where tablename = 'all_leads';
