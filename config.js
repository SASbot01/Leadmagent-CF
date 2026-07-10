/* =========================================================================
   Config pública del sitio estático (se carga ANTES que app.js).

   La anon/publishable key de Supabase es PÚBLICA por diseño: va en el
   navegador y no da acceso a nada por sí sola. La escritura en `all_leads`
   la protege una policy RLS que solo permite INSERT de filas con
   project = 'creatorfounder' (ver supabase-policy.sql).

   ⚠️ NUNCA pongas aquí la service_role key: esa bypassa RLS y daría acceso
   total a la base de datos desde el navegador.
   ========================================================================= */
window.CF_CONFIG = {
  SUPABASE_URL: "https://veaakomomguktgzbryfy.supabase.co",
  // Supabase → Settings → API → Project API keys → "anon" / "public".
  // Key pública (rol "anon"): segura en el navegador; la protege la policy RLS.
  SUPABASE_ANON_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlYWFrb21vbWd1a3RnemJyeWZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MjgwMzIsImV4cCI6MjA5MjMwNDAzMn0.aPD3fbqCBOe82PCqpXKOBxBQrNhIsWeviKgNtChlZ_c",
  PROJECT_SLUG: "creatorfounder",

  // GHL / NEO — Inbound Webhook del pipeline "Lead Magnet · Diagnóstico".
  // La URL de un inbound webhook NO es secreta (solo permite ENVIAR datos, no
  // leer), así que sí puede ir en el navegador. Pega aquí la URL que te da GHL
  // en: Automation → Workflows → Trigger "Inbound Webhook" → Copy URL.
  // Mientras esté vacía, el envío a GHL se salta sin romper nada.
  GHL_LEAD_WEBHOOK_URL: "",
};
