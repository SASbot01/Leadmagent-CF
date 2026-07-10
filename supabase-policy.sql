-- =========================================================================
-- Policy RLS para que el sitio estático (Leadmagent-CF) pueda INSERTAR leads
-- del diagnóstico en `all_leads` usando la anon key (pública, en el navegador).
--
-- Ejecútalo UNA vez en: Supabase → SQL Editor → New query → Run.
--
-- Seguridad: la anon key SOLO podrá INSERTAR filas con project='creatorfounder'.
-- No podrá leer (SELECT), ni modificar, ni borrar, ni tocar otros proyectos.
-- El repo Next.js usa la service_role key (bypassa RLS), así que esto NO le afecta.
-- =========================================================================

-- 1) Activa RLS en la tabla (si no lo estaba ya).
alter table public.all_leads enable row level security;

-- 2) Permite INSERT anónimo, pero solo para este proyecto.
drop policy if exists "anon insert diagnostico creatorfounder" on public.all_leads;
create policy "anon insert diagnostico creatorfounder"
  on public.all_leads
  for insert
  to anon
  with check (project = 'creatorfounder');

-- Nota: no creamos ninguna policy de SELECT para `anon`, así que la anon key
-- NO puede leer nada de all_leads. Solo escribir leads de creatorfounder.
