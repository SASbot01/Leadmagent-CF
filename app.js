/* =========================================================================
   Creator Founder — app
   Render de landing + motor del diagnóstico (lead magnet).
   Flujo: CONTACTO (datos) → P1 perfil → Q1 etapa → Q2 reto → CARGA → RESULTADO.
   Depende de data.js (PROFILES, PHASES, STAGES, QUESTIONS, RETOS, BRANCH,
   nextQuestion, computeResult).
   ========================================================================= */
(function () {
  "use strict";

  // Color por perfil (branding Creator): Founder rojo · Operator gris · Profesional blanco.
  const ACCENT = { red: "#E5322D", gray: "#8A8A94", white: "#FFFFFF" };
  const DEFAULT_ACCENT = "#FFFFFF";
  const accentFor = (profileKey) =>
    profileKey && PROFILES[profileKey] ? ACCENT[PROFILES[profileKey].accent] : DEFAULT_ACCENT;
  const el = (sel, ctx = document) => ctx.querySelector(sel);
  const els = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const esc = (s) =>
    String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Landing: nav scroll state ---------------- */
  const nav = el("#nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- Scroll reveal (IntersectionObserver) ---------------- */
  function initReveal() {
    const items = els("[data-reveal]");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((n) => n.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const node = entry.target;
          const delay = parseInt(node.dataset.revealDelay || "0", 10);
          setTimeout(() => node.classList.add("is-visible"), delay);
          obs.unobserve(node);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );
    items.forEach((n) => io.observe(n));
  }

  /* Marca elementos para reveal y aplica un stagger por grupo */
  function markReveal(nodes, step = 70) {
    nodes.forEach((n, i) => {
      n.setAttribute("data-reveal", "");
      n.dataset.revealDelay = String(i * step);
    });
  }

  /* ---------------- Spotlight: las cards siguen al cursor ---------------- */
  function initSpotlight(scope = document) {
    if (reduceMotion) return;
    els(".card", scope).forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---------------- Landing: profile cards (nombre en rojo) ---------------- */
  function renderProfiles() {
    const grid = el("#profilesGrid");
    if (!grid) return;
    const shortName = { founder: "Founder", operator: "Operator", profesional: "Profesional" };
    grid.innerHTML = Object.values(PROFILES)
      .map(
        (p) => `
      <article class="card pcard" style="--accent:${ACCENT[p.accent]}">
        <h3 class="pcard__name">${esc(shortName[p.key] || p.name)}</h3>
        <p class="pcard__desc">${esc(p.short)}</p>
      </article>`
      )
      .join("");
    markReveal(els(".pcard", grid), 90);
    initSpotlight(grid);
  }

  /* =========================================================================
     QUIZ ENGINE
     ========================================================================= */
  const quiz = el("#quiz");
  const quizBody = el("#quizBody");
  const quizProgressEl = el("#quizProgress"); // contenedor (role=progressbar)
  const quizProgress = el("#quizProgress span"); // relleno visual
  let answers = {};
  let contact = {}; // { name, phone, email }
  let history = []; // pila de pasos visitados: "contact" + ids de QUESTIONS
  let lastFocused = null; // elemento al que devolver el foco al cerrar el quiz

  // Pasos totales (para la barra): contacto + 3 preguntas.
  function totalSteps() {
    return 4;
  }

  // El fondo se vuelve inerte mientras el modal está abierto (foco + lectores de pantalla)
  const bgRegions = () => [el("#nav"), el("main"), el(".footer")].filter(Boolean);
  function setBackgroundInert(on) {
    bgRegions().forEach((n) => (on ? n.setAttribute("inert", "") : n.removeAttribute("inert")));
  }

  function openQuiz() {
    lastFocused = document.activeElement;
    answers = {};
    contact = {};
    history = [];
    quiz.classList.add("is-open");
    quiz.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    setBackgroundInert(true);
    renderContact();
  }
  function closeQuiz() {
    quiz.classList.remove("is-open");
    quiz.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    setBackgroundInert(false);
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus({ preventScroll: true });
    }
  }

  function setProgress(stepNo) {
    const pct = Math.min(100, Math.round((stepNo / (totalSteps() + 1)) * 100));
    quizProgress.style.width = pct + "%";
    if (quizProgressEl) quizProgressEl.setAttribute("aria-valuenow", String(pct));
  }

  function focusTitle() {
    const title = el(".step__title, .result__title, .loading__title", quizBody);
    if (title) title.focus({ preventScroll: true });
  }
  function scrollTop() {
    quizBody.scrollTop = 0;
    quiz.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------------- Paso 0: DATOS DE CONTACTO ---------------- */
  function renderContact() {
    history.push("contact");
    setProgress(history.length);
    quiz.style.setProperty("--accent", DEFAULT_ACCENT);

    quizBody.innerHTML = `
      <div class="step">
        <span class="step__eyebrow">Antes de empezar</span>
        <h2 class="step__title" tabindex="-1">¿A dónde enviamos tu diagnóstico?</h2>
        <p class="step__sub">Déjanos tus datos para preparar tu hoja de ruta personalizada. Tardarás menos de 2 minutos.</p>
        <form class="contact" id="contactForm" novalidate>
          <div class="field">
            <label for="cName">Nombre y apellido</label>
            <input id="cName" type="text" autocomplete="name" placeholder="Tu nombre y apellido" required value="${esc(contact.name || "")}" />
          </div>
          <div class="field">
            <label for="cPhone">Teléfono</label>
            <input id="cPhone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+34 600 000 000" required value="${esc(contact.phone || "")}" />
          </div>
          <div class="field">
            <label for="cEmail">Correo</label>
            <input id="cEmail" type="email" inputmode="email" autocomplete="email" placeholder="tu@email.com" required value="${esc(contact.email || "")}" />
          </div>
          <div class="contact__msg" id="contactMsg" role="alert" aria-live="assertive"></div>
          <button class="btn btn--primary btn--lg contact__submit" type="submit">Empezar mi diagnóstico →</button>
        </form>
      </div>`;

    const form = el("#contactForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = el("#cName").value.trim();
      const phone = el("#cPhone").value.trim();
      const email = el("#cEmail").value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const phoneOk = phone.replace(/[^\d]/g, "").length >= 7;
      const msg = el("#contactMsg");
      if (name.length < 2) {
        msg.textContent = "Introduce tu nombre y apellido.";
        el("#cName").focus();
        return;
      }
      if (!phoneOk) {
        msg.textContent = "Introduce un teléfono válido.";
        el("#cPhone").focus();
        return;
      }
      if (!emailOk) {
        msg.textContent = "Introduce un email válido.";
        el("#cEmail").focus();
        return;
      }
      contact = { name, phone, email };
      renderStep("start");
    });

    scrollTop();
    focusTitle();
  }

  /* ---------------- Pasos de pregunta ---------------- */
  function renderStep(qid) {
    const q = QUESTIONS[qid];
    if (!q) return;
    history.push(qid);
    setProgress(history.length);
    quiz.style.setProperty("--accent", accentFor(answers.start));

    const questionNo = history.length - 1; // descontamos el paso de contacto
    quizBody.innerHTML = `
      <div class="step">
        <span class="step__eyebrow">${esc(q.eyebrow)}</span>
        <h2 class="step__title" tabindex="-1">${esc(q.title)}</h2>
        <p class="step__sub">${esc(q.subtitle)}</p>
        <div class="options">
          ${q.options
            .map(
              (o) => `
            <button class="option" data-value="${esc(o.value)}">
              <span class="option__icon">${esc(o.icon)}</span>
              <span class="option__txt"><h4>${esc(o.label)}</h4><p>${esc(o.desc)}</p></span>
            </button>`
            )
            .join("")}
        </div>
        <div class="step__nav">
          <button class="step__back" ${history.length <= 1 ? 'style="visibility:hidden"' : ""}>← Atrás</button>
          <span class="step__count">Paso ${questionNo} de 3</span>
        </div>
      </div>`;

    const opts = els(".option", quizBody);
    opts.forEach((btn) =>
      btn.addEventListener("click", () => {
        answers[qid] = btn.dataset.value;
        // Feedback inmediato con el color del perfil elegido.
        quiz.style.setProperty("--accent", accentFor(answers.start));
        opts.forEach((o) => (o.style.pointerEvents = "none"));
        btn.classList.add("is-selected");
        const advance = () => {
          const next = nextQuestion(answers);
          if (next) renderStep(next);
          else renderLoading();
        };
        reduceMotion ? advance() : setTimeout(advance, 260);
      })
    );
    const back = el(".step__back", quizBody);
    if (back) back.addEventListener("click", goBack);
    scrollTop();
    focusTitle();
  }

  function goBack() {
    if (history.length <= 1) return;
    history.pop(); // quita el paso actual
    const prev = history.pop(); // destino (se vuelve a empujar al renderizar)
    // Conserva solo respuestas de pasos anteriores al destino; olvida el resto.
    const keep = new Set(history);
    Object.keys(answers).forEach((k) => {
      if (!keep.has(k)) delete answers[k];
    });
    if (prev === "contact") renderContact();
    else renderStep(prev);
  }

  /* ---------------- Pantalla de CARGA (procesando ~7s) ---------------- */
  function renderLoading() {
    setProgress(totalSteps()); // ~80%
    quiz.style.setProperty("--accent", accentFor(answers.start));
    quizBody.innerHTML = `
      <div class="loading">
        <div class="loading__ring" aria-hidden="true">
          <svg viewBox="0 0 80 80"><circle class="loading__track" cx="40" cy="40" r="34"/><circle class="loading__bar" cx="40" cy="40" r="34"/></svg>
        </div>
        <h2 class="loading__title" tabindex="-1">Creando tu diagnóstico personalizado…</h2>
        <p class="loading__sub">Estamos procesando tus respuestas y preparando tu hoja de ruta.</p>
        <div class="loading__progress"><span id="loadingBar"></span></div>
      </div>`;
    focusTitle();
    scrollTop();
    // La barra se llena en ~7s; al terminar, mostramos el resultado.
    const bar = el("#loadingBar");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (bar) bar.style.width = "100%";
      });
    });
    setProgress(totalSteps() + 1); // barra superior a 100%
    setTimeout(renderResult, 4500);
  }

  /* Construye el PLAN detallado de la fase (lo que se descarga en PDF).
     Mismos bloques que el diagnóstico completo: dolor, objetivo, qué haces,
     matriz, cómo graduarte, siguiente nivel y mentalidad. */
  function buildPlan(r, prof, ph, stage) {
    const order = prof.phaseOrder;
    const activeIdx = order.indexOf(r.phase);
    const reto = r.reto && RETOS[r.retoGroup] ? RETOS[r.retoGroup][r.reto] : null;

    const timeline = `<div class="youhere">${order
      .map((k, i) => {
        const p = PHASES[k];
        const state = i < activeIdx ? "is-done" : i === activeIdx ? "is-active" : "";
        const dot = `<div class="youhere__dot ${state}"><span class="youhere__circle"></span><span class="youhere__lbl">${esc(p.title)}</span></div>`;
        const line = i < order.length - 1 ? `<span class="youhere__line"></span>` : "";
        return dot + line;
      })
      .join("")}</div>`;

    const metrics = [
      ph.income ? `<span class="chip"><strong>Métrica:</strong> ${esc(ph.income)}</span>` : "",
      ph.team ? `<span class="chip"><strong>Equipo:</strong> ${esc(ph.team)}</span>` : "",
      ph.stat ? `<span class="chip">${esc(ph.stat)}</span>` : "",
    ]
      .filter(Boolean)
      .join("");

    const doingBlock = ph.doing
      ? `<div class="rblock"><div class="rblock__title">Qué haces en esta fase</div><ul class="rlist">${ph.doing.map((d) => `<li>${esc(d)}</li>`).join("")}</ul></div>`
      : "";
    const matrixBlock = ph.constraints
      ? `<div class="rblock"><div class="rblock__title">La matriz de restricciones</div><div class="matrix"><div class="matrix__row matrix__head"><span>Área</span><span>La restricción (te duele)</span><span>Para graduarte</span></div>${ph.constraints
          .map((c) => `<div class="matrix__row"><span class="matrix__area">${esc(c.area)}</span><span class="matrix__bad">${esc(c.bad)}</span><span class="matrix__good">${esc(c.good)}</span></div>`)
          .join("")}</div></div>`
      : "";
    const warnBlock = ph.notIcp
      ? `<div class="warn"><div class="warn__tag">⚠ LECTURA HONESTA</div><p>${esc(ph.notIcpNote)}</p></div>`
      : "";
    const retoBlock = reto
      ? `<div class="rblock"><div class="rblock__title">Tu mayor reto ahora</div><p style="color:var(--text);font-size:16px;margin-bottom:12px"><strong>${esc(reto.label)}</strong></p><p><strong style="color:var(--text)">Por dónde empezar:</strong> ${esc(reto.focus)}</p></div>`
      : "";
    const gradBlock = ph.graduate
      ? `<div class="rblock"><div class="rblock__title">Cómo graduarte al siguiente nivel</div><ul class="grad-list">${ph.graduate
          .map((g) => `<li><span class="gcheck">✓</span><div><h4>${esc(g.title)}</h4><p>${esc(g.detail)}</p></div></li>`)
          .join("")}</ul></div>`
      : "";
    const nextBlock = ph.next
      ? `<div class="rblock next-prev"><div class="rblock__title">Tu siguiente nivel · ${esc(ph.next.title)}</div><ul class="rlist">${ph.next.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>`
      : `<div class="rblock next-prev"><div class="rblock__title">Has llegado a la cima del camino</div><p>Estás en la fase final del modelo. A partir de aquí el juego es poseer infraestructura, capital y marcas.</p></div>`;
    const mindsetBlock = ph.mindset ? `<p class="mindset">${esc(ph.mindset)}”</p>` : "";

    return `
      <div class="plan" id="planDoc" aria-hidden="true">
        <div class="plan__head">
          <span class="plan__brand">Diagnóstico Creator Founder</span>
          <h2 class="plan__title">${esc(stage.name)}</h2>
          <p class="plan__meta">${esc(prof.name)} · ${esc(ph.code)} — ${esc(ph.title)}</p>
          <p class="plan__blurb">${esc(stage.blurb)}</p>
        </div>
        ${timeline}
        <div class="rblock" style="margin-top:26px">
          <div class="rblock__title">Dónde estás ahora · ${esc(ph.code)}: ${esc(ph.title)}</div>
          <p style="color:var(--text);font-size:16px;margin-bottom:14px"><strong>Tu dolor:</strong> ${esc(ph.pain)}</p>
          <p><strong style="color:var(--text)">Tu objetivo:</strong> ${esc(ph.objective)}</p>
          ${metrics ? `<div class="result__metrics" style="justify-content:flex-start;margin-top:18px">${metrics}</div>` : ""}
        </div>
        ${warnBlock}${retoBlock}${doingBlock}${matrixBlock}${gradBlock}${nextBlock}${mindsetBlock}
      </div>`;
  }

  /* =========================================================================
     RESULTADO — Enhorabuena + etapa + VSL + descarga del plan (PDF)
     ========================================================================= */
  function renderResult() {
    setProgress(totalSteps() + 1);
    const r = computeResult(answers);
    const prof = PROFILES[r.profile];
    const accent = ACCENT[prof.accent];
    const ph = PHASES[r.phase];
    const stage = STAGES[r.phase] || { name: (ph && ph.title) || prof.name, blurb: "" };

    quizBody.innerHTML = `
      <div class="result result--v2" style="--accent:${accent}">
        <div class="result__head">
          <span class="result__congrats">✓ Diagnóstico completado</span>
          <h1 class="result__title" tabindex="-1">Tu perfil es<br><span class="result__stage">${esc(stage.name)}</span></h1>
          <p class="result__blurb">${esc(stage.blurb)}</p>
        </div>

        <div class="result__actions">
          <button class="btn btn--primary btn--lg" id="downloadBtn" type="button">Descargar mi diagnóstico completo →</button>
        </div>

        <div class="vsl vsl--result" aria-label="Tu vídeo de diagnóstico">
          <div class="vsl__frame">
            <button class="vsl__play" type="button" aria-label="Reproducir vídeo"><span class="vsl__triangle"></span></button>
            <span class="vsl__label">Tu vídeo (VSL) aquí</span>
          </div>
        </div>

        <div class="result__restart"><button id="restartBtn">↺ Volver a empezar</button></div>

        ${buildPlan(r, prof, ph, stage)}
      </div>`;

    focusTitle();

    // Persistencia local del lead con sus datos de contacto (placeholder hasta CRM/backend).
    try {
      const leads = JSON.parse(localStorage.getItem("cf_leads") || "[]");
      leads.push({
        name: contact.name || "",
        phone: contact.phone || "",
        email: contact.email || "",
        profile: r.profile,
        phase: r.phase,
        stage: stage.name,
        reto: r.reto || null,
        ts: Date.now(),
      });
      localStorage.setItem("cf_leads", JSON.stringify(leads));
    } catch (_) {}

    // Descargar plan en PDF: usamos el render real del navegador (idéntico a la web)
    // vía "Guardar como PDF". Solo se imprime el bloque .plan (la enhorabuena/VSL quedan fuera).
    const docTitle = `Diagnóstico · ${stage.name} · ${prof.name}`;
    el("#downloadBtn").addEventListener("click", () => {
      const prevTitle = document.title;
      document.title = docTitle;
      document.body.classList.add("printing");
      const cleanup = () => {
        document.body.classList.remove("printing");
        document.title = prevTitle;
        window.removeEventListener("afterprint", cleanup);
      };
      window.addEventListener("afterprint", cleanup);
      setTimeout(cleanup, 1500); // fallback si afterprint no dispara
      window.print();
    });

    el("#restartBtn").addEventListener("click", () => {
      answers = {};
      history = ["contact"]; // conservamos contacto; permite volver atrás
      renderStep("start");
    });

    scrollTop();
  }

  /* ---------------- wiring ---------------- */
  els("[data-open-quiz]").forEach((b) => b.addEventListener("click", openQuiz));
  // La cruz de cierre se ha quitado para no permitir salir del diagnóstico.
  // Escape se mantiene como salida discreta (accesibilidad), no visible.
  const closeBtn = el("#quizClose");
  if (closeBtn) closeBtn.addEventListener("click", closeQuiz);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && quiz.classList.contains("is-open")) closeQuiz();
  });

  // Focus trap: el Tab no se escapa del modal mientras está abierto.
  const FOCUSABLE =
    'a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])';
  quiz.addEventListener("keydown", (e) => {
    if (e.key !== "Tab" || !quiz.classList.contains("is-open")) return;
    const nodes = els(FOCUSABLE, quiz).filter((n) => n.offsetParent !== null);
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  /* ---------------- init ---------------- */
  renderProfiles();
  markReveal(els(".section .section__head"), 0);
  els(".section__cta").forEach((n) => n.setAttribute("data-reveal", ""));
  initSpotlight(document);
  initReveal();
})();
