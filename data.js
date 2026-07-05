/* =========================================================================
   Creator Founder — Diagnóstico Personalizado
   Lógica del lead magnet según el diagrama del cliente:
     P1 (punto de partida) → 3 perfiles
        cada perfil → Q1 (define la ETAPA 1–5) + Q2 (define el RETO actual)
   Perfiles: Founder Visible · Personal Brand Operator · Profesional Referente.
   Editar aquí el copy sin tocar la lógica de render (app.js).
   ========================================================================= */

/* ---------- PERFILES (los 3 puntos de partida) ---------- */
const PROFILES = {
  founder: {
    key: "founder",
    tag: "FOUNDER VISIBLE",
    name: "Founder Visible",
    accent: "red",
    short:
      "Tienes un negocio (o estás a punto de iniciarlo) y quieres usar tu contenido y tu marca personal como motor de crecimiento de la empresa.",
    long:
      "Eres fundador/a o emprendedor/a y entiendes que tu marca personal es el mayor multiplicador de tu negocio. El reto no es ‘crear contenido’, sino que ese contenido tenga impacto real: visibilidad que se convierte en confianza, confianza que acelera decisiones de compra y, al final, una marca que genera oportunidades, ventas y partnerships de forma consistente, sin depender de tu tiempo.",
    phasesLabel: "El camino: de negocio invisible a marca-motor",
    phaseOrder: ["f1", "f2", "f3", "f4", "f5"],
  },
  operator: {
    key: "operator",
    tag: "PERSONAL BRAND OPERATOR",
    name: "Personal Brand Operator",
    accent: "gray",
    short:
      "Operas (o quieres operar) marcas personales y negocios ajenos sin ser la cara visible: ventas, sistemas, monetización y producto desde la sombra.",
    long:
      "‘Shadow Operating’ es un modelo donde un especialista técnico se asocia con un creador o negocio para gestionar las operaciones internas. El creador es la cara pública y hace marketing; tú manejas ventas, sistemas y productos digitales desde el anonimato, con acuerdos de revenue share. La clave: mentalidad de liderazgo, ganancias compartidas y socios con audiencia establecida. De operar marcas ajenas a poseer la infraestructura del creator economy.",
    phasesLabel: "El camino: de aprendiz en la sombra a Shadow Founder",
    phaseOrder: ["o1", "o2", "o3", "o4", "o5"],
  },
  profesional: {
    key: "profesional",
    tag: "PROFESIONAL REFERENTE",
    name: "Profesional Referente",
    accent: "white",
    short:
      "Tienes un trabajo o experiencia real en un sector y quieres convertir tu marca personal en autoridad: posicionarte como referente y dejar de cambiar tiempo por dinero.",
    long:
      "Profesional con expertise real que ve la marca personal como palanca estratégica para ganar autoridad. Tu objetivo no es descubrir quién eres, sino convertir tu conocimiento y reputación en un activo escalable: pasar de no publicar (o publicar sin estrategia) a ser reconocido por un tema concreto y, finalmente, a una marca que genera oportunidades de forma constante.",
    phasesLabel: "El camino: de profesional silencioso a marca-compañía",
    phaseOrder: ["p1", "p2", "p3", "p4", "p5"],
  },
};

/* ---------- ETAPAS (nombres estilo Hormozi + descripción breve) ----------
   Fuente: doc "PERFILES - LM_ESTILO_HORMOZI". Es el nombre que se muestra en la
   página de enhorabuena ("Enhorabuena, eres ...") con su descripción corta.   */
const STAGES = {
  /* Founder Visible */
  f1: { name: "Narrador en Potencia", blurb: "Aún no tienes una marca construida, pero sí lo más valioso: el inicio de tu camino. Tu reto es perder el miedo a exponerte y documentar tu proceso en tiempo real con constancia." },
  f2: { name: "El Creador Perdido", blurb: "Ya apareces en redes, pero tu comunicación es dispersa y sin dirección clara. Existes, pero no se te recuerda: necesitas definir tu mensaje y a quién hablas." },
  f3: { name: "El Constructor", blurb: "Comunicas con intención y empiezas a generar reconocimiento. Estás afinando tu posicionamiento y vinculando tu contenido con oportunidades reales." },
  f4: { name: "El Referente", blurb: "Tu nombre ya se asocia a un tema concreto y tu contenido influye en decisiones. Ahora toca convertir esa autoridad en un activo más estructurado." },
  f5: { name: "El Multiplicador", blurb: "Tu marca personal es un motor de crecimiento que moviliza audiencia. Tu reto ya no es crecer, sino escalar tu impacto sin depender de tu tiempo." },
  /* Personal Brand Operator */
  o1: { name: "Estratega Aspirante", blurb: "Aquí no construyes negocio: construyes capacidad. Aprendes los fundamentos de monetización, funnels y ofertas para ver los patrones que otros no ven." },
  o2: { name: "Operador Junior", blurb: "Das el salto a la acción con creadores pequeños y bajo riesgo. Aprendes haciendo, validas ofertas y generas tus primeros ingresos." },
  o3: { name: "Estratega Consolidado", blurb: "Ya no improvisas: optimizas. Trabajas con creadores medianos, piensas en sistemas y generas ingresos consistentes de 5 cifras al mes." },
  o4: { name: "El Socio de Crecimiento", blurb: "Multiplicas lo que ya funciona gestionando varios creadores con sistemas replicables. Tus ingresos crecen de forma compuesta, no lineal a tu tiempo." },
  o5: { name: "El Founder", blurb: "Dejas de operar creadores y creas el sistema donde los creadores operan. Pasas de revenue share a ownership: infraestructura, equity y marcas propias." },
  /* Profesional Referente */
  p1: { name: "El Profesional Invisible", blurb: "Tienes valor real, pero nadie lo percibe. Dependes al 100% del CV y de procesos tradicionales: eres uno más, intercambiable fuera de tu entorno." },
  p2: { name: "El Profesional Inseguro", blurb: "Sabes que deberías trabajar tu visibilidad, pero la parálisis y la inseguridad te frenan. Hay intención, pero todavía no hay posicionamiento." },
  p3: { name: "El Profesional en Crecimiento", blurb: "Publicas con constancia y ya creces: audiencia, engagement y reconocimiento en tu entorno. Destacas más que la media, pero aún no posees un territorio claro." },
  p4: { name: "El Profesional Referente", blurb: "Defines tu nicho y mensaje, y empiezas a ser identificado por un tema específico. Conviertes visibilidad en autoridad real." },
  p5: { name: "El Profesional Escalable", blurb: "Tu marca personal funciona como una ventaja competitiva estructural. Ya no persigues oportunidades: las atraes y las seleccionas." },
};

/* Mapea el valor de la P1 al prefijo de sus preguntas (Q1/Q2). */
const BRANCH = { founder: "founder", operator: "operator", profesional: "prof" };

/* ---------- FASES / CAMINOS (5 etapas por perfil) ----------
   Cada fase: profile, index, code, title, role, income, pain, objective,
   doing[], (opcional) constraints[], graduate[], next{title,points[]} | null,
   mindset, (opcional) stat, notIcp + notIcpNote.                           */
const PHASES = {
  /* ===== FOUNDER VISIBLE ===== */
  f1: {
    profile: "founder",
    index: 1,
    code: "ETAPA 01",
    title: "El Negocio Invisible",
    role: "Fundador sin voz pública",
    income: "El contenido aún no influye en el negocio",
    stat: "La mayoría de negocios no mueren por mal producto, sino en silencio.",
    pain: "Tienes un negocio (o la idea) pero tu contenido tiene muy poco o ningún impacto en su crecimiento.",
    objective: "Dejar de ser invisible: definir tu mensaje y empezar a existir para tu mercado.",
    doing: [
      "Definir el mensaje central: qué resuelves, para quién y por qué tú.",
      "Elegir una plataforma y empezar a publicar con intención, no por publicar.",
      "Conectar cada pieza de contenido con un objetivo del negocio, no con vanity metrics.",
    ],
    graduate: [
      { title: "Mensaje y posicionamiento claros", detail: "“Ayudo a X a conseguir Y”, en una frase que tu mercado entiende." },
      { title: "Presencia activa en 1 plataforma", detail: "Publicas de forma consistente, aunque sea mínima." },
    ],
    next: {
      title: "Etapa 2 · Presencia con estrategia",
      points: ["Pasar de publicar suelto a una línea editorial.", "Hablar del problema y del resultado, no solo de tu día a día.", "Abrir las primeras conversaciones desde el contenido."],
    },
    mindset: "Si tu mercado no te ve, tu negocio crece a fuerza bruta. El contenido es apalancamiento.",
  },
  f2: {
    profile: "founder",
    index: 2,
    code: "ETAPA 02",
    title: "Presencia sin Tracción",
    role: "Fundador visible, sin retorno",
    income: "Visibilidad, pero sin resultados claros",
    pain: "Tu contenido te da algo de visibilidad, pero no se traduce en resultados de negocio.",
    objective: "Convertir la visibilidad en una estrategia que genere interés cualificado.",
    doing: [
      "Pasar de publicar suelto a una línea editorial con temas y ángulos definidos.",
      "Hablar del problema y del resultado que generas, no solo de tu día a día.",
      "Introducir llamadas a la acción suaves que abran conversaciones.",
    ],
    graduate: [
      { title: "Línea editorial consistente", detail: "Temas y ángulos enfocados en tu cliente ideal." },
      { title: "Primeras conversaciones reales", detail: "Contactos cualificados que nacen del contenido." },
    ],
    next: { title: "Etapa 3 · Atracción y captación", points: ["Crear un activo de captación conectado a tu oferta.", "Diseñar el recorrido de contenido a venta.", "Medir qué contenido atrae al cliente correcto."] },
    mindset: "Visibilidad sin estrategia es ruido. La estrategia convierte atención en oportunidades.",
  },
  f3: {
    profile: "founder",
    index: 3,
    code: "ETAPA 03",
    title: "Atracción Inicial",
    role: "Fundador que empieza a atraer",
    income: "Interés, contactos y primeros leads",
    pain: "Empiezas a atraer interés, contactos o potenciales clientes, pero la captación es irregular.",
    objective: "Sistematizar la captación para que el contenido genere leads de forma predecible.",
    doing: [
      "Crear un activo de captación (lead magnet, webinar, lista) conectado a tu oferta.",
      "Diseñar el recorrido del contenido a la conversación de venta.",
      "Medir qué contenido atrae a los clientes correctos y doblar la apuesta.",
    ],
    graduate: [
      { title: "Captación recurrente", detail: "Un sistema que produce leads de forma predecible." },
      { title: "Recorrido contenido → oferta", detail: "Un camino claro desde la atención hasta la venta." },
    ],
    next: { title: "Etapa 4 · Autoridad que vende", points: ["Construir prueba dentro de tu narrativa.", "Que el lead llegue ‘pre-vendido’.", "Subir pricing apoyado en autoridad."] },
    mindset: "No quieres más alcance; quieres a las personas correctas entrando en tu mundo.",
  },
  f4: {
    profile: "founder",
    index: 4,
    code: "ETAPA 04",
    title: "Autoridad que Vende",
    role: "Fundador de referencia",
    income: "El contenido acelera decisiones de compra",
    pain: "Tu contenido genera confianza, pero el cierre y el crecimiento todavía dependen de ti.",
    objective: "Que tu marca personal acorte el ciclo de venta y eleve tu pricing.",
    doing: [
      "Construir prueba (casos, resultados, testimonios) dentro de tu narrativa.",
      "Alinear contenido y oferta para que el lead llegue ‘pre-vendido’.",
      "Subir precios apoyado en autoridad, no en horas.",
    ],
    graduate: [
      { title: "Leads pre-vendidos", detail: "Llegan convencidos y con menos fricción para comprar." },
      { title: "Pricing premium", detail: "Sostenido por tu autoridad, no por tu disponibilidad." },
    ],
    next: { title: "Etapa 5 · Marca-motor", points: ["Construir equipo y sistemas de contenido.", "Productizar tu conocimiento.", "Convertir la marca en plataforma de partnerships."] },
    mindset: "Cuando tu marca vende por ti, dejas de perseguir clientes y empiezas a elegirlos.",
  },
  f5: {
    profile: "founder",
    index: 5,
    code: "ETAPA 05",
    title: "Marca-Motor",
    role: "Founder con marca-compañía",
    income: "Oportunidades, ventas y partnerships consistentes",
    pain: "Generas oportunidades de forma consistente, pero todo sigue pasando por tu tiempo.",
    objective: "Escalar el impacto del contenido sin depender de tu presencia constante.",
    doing: [
      "Construir equipo/sistemas de contenido (ghostwriting, edición, distribución).",
      "Productizar tu conocimiento (cursos, programas, IP) para escalar más allá de tu tiempo.",
      "Convertir tu marca en plataforma de partnerships y nuevas líneas de negocio.",
    ],
    graduate: [
      { title: "Máquina de contenido", detail: "Funciona sin tu ejecución diaria." },
      { title: "Marca que genera negocio", detail: "Ventas y partnerships de forma sistemática." },
    ],
    next: null,
    mindset: "Tu marca personal ya no es marketing: es el activo que multiplica todo lo demás.",
  },

  /* ===== PERSONAL BRAND OPERATOR ===== */
  o1: {
    profile: "operator",
    index: 1,
    code: "ETAPA 01",
    title: "El Aprendiz en la Sombra",
    role: "Operador sin experiencia previa",
    income: "$0 · aún sin primer caso",
    stat: "El 100% de los operadores exitosos empezaron sin experiencia.",
    pain: "Te atrae operar marcas ajenas, pero tienes ninguna o muy poca experiencia práctica.",
    objective: "Entender el modelo Shadow Operating y conseguir tu primer caso real, sin necesitar capital ni audiencia.",
    doing: [
      "Aprender el modelo: liderazgo anónimo, revenue share y selección de socios.",
      "Dominar la IA especializada para hacer el trabajo de un equipo tú solo.",
      "Identificar micro-creadores (10k–100k) con audiencia fiel sin monetizar.",
    ],
    graduate: [
      { title: "Modelo comprendido", detail: "Tienes claro tu rol como operador y cómo se genera el dinero." },
      { title: "Primer socio potencial", detail: "Un creador interesado en una propuesta de revenue share." },
    ],
    next: { title: "Etapa 2 · El Arquitecto Silencioso", points: ["Cerrar tu primer revenue share 70/30.", "Lanzar un producto de alto margen.", "Implementar cobros sin fricción."] },
    mindset: "No necesitas ser famoso ni tener capital: necesitas mentalidad de liderazgo y un sistema.",
    notIcp: true,
    notIcpNote:
      "Hoy tu reto es de aprendizaje y primer caso, no de escalado. Lo prioritario es entender el modelo y conseguir reps reales antes de pensar en sistemas.",
  },
  o2: {
    profile: "operator",
    index: 2,
    code: "ETAPA 02",
    title: "El Arquitecto Silencioso",
    role: "Operador novato con primer caso",
    income: "$0 – $1.000 / mes · buscando el primer éxito",
    team: "1 (tú + herramientas de IA)",
    pain: "Has ayudado puntualmente o aprendido por tu cuenta, pero sin procesos claros.",
    objective: "Conseguir el primer éxito tangible y convertir tu intuición en un proceso repetible. Sin equipo ni dinero: una computadora y herramientas de IA.",
    doing: [
      "Cerrar tu primer revenue share 70/30, sin cobrar nada por adelantado.",
      "Lanzar un producto ‘high leverage’ (info-producto o coaching), no merch barato.",
      "Implementar payment splitting: el reparto 70/30 ocurre en tiempo real.",
    ],
    constraints: [
      { area: "MENTALIDAD", bad: "Crees que necesitas ser famoso o tener capital para empezar.", good: "Entender el Liderazgo Anónimo: tú pones la gestión, ellos la cara." },
      { area: "SOURCING", bad: "Intentas contactar a influencers masivos que te ignoran.", good: "Identificar micro-creadores (10k–100k): audiencia fiel sin monetizar." },
      { area: "LA OFERTA", bad: "Intentas cobrar un fee fijo por adelantado y te rechazan.", good: "Proponer RevShare 70/30: riesgo cero para el creador." },
      { area: "OPERACIONES", bad: "Te paralizas pensando que necesitas contratar copywriters o diseñadores.", good: "Dominar la IA especializada: el trabajo de un equipo, tú solo, desde el día 1." },
      { area: "FINANZAS", bad: "No tienes dinero para invertir en anuncios.", good: "Empezar con coste $0. Tu inversión es tiempo; el capital sale de las ventas." },
    ],
    graduate: [
      { title: "Modelo de ingresos validado (no servicios)", detail: "Cierra un revenue share: el creador pone la audiencia, tú la infraestructura. Split 70/30." },
      { title: "Producto ‘high leverage’ lanzado", detail: "Nada de ebooks de $10. Un producto de $100 al 2% de 10k supera cualquier patrocinio." },
      { title: "Infraestructura sin fricción", detail: "Payment splitting en tiempo real: tú no tocas su dinero, él no toca el tuyo." },
    ],
    next: { title: "Etapa 3 · El Estratega Ninja", points: ["Optimización avanzada de conversión.", "La IA ejecuta funnels y correos; tú supervisas.", "Maximizar cada lanzamiento sin añadir horas."] },
    mindset: "Tu objetivo en esta fase no es hacerte rico, es validar que tu sistema funciona.",
  },
  o3: {
    profile: "operator",
    index: 3,
    code: "ETAPA 03",
    title: "El Estratega Ninja",
    role: "Ejecutor con resultados",
    income: "Maximizando cada lanzamiento",
    team: "1 creador + IA",
    pain: "Ya has ejecutado proyectos con resultados, pero dejas dinero sobre la mesa en cada lanzamiento.",
    objective: "Maximizar las ganancias de cada lanzamiento y establecer pagos sin fricción. El foco pasa de ‘conseguir el cliente’ a ‘exprimir el valor’.",
    doing: [
      "Lanzar productos digitales de alto margen (cursos, coaching, membresías).",
      "Implementar payment splitting para que el 70/30 ocurra en tiempo real.",
      "Aplicar tácticas ‘nivel ninja’ y backend para que cada lanzamiento supere al anterior.",
    ],
    graduate: [
      { title: "Cobro automático estable", detail: "El reparto 70/30 ocurre en tiempo real, sin pedir transferencias." },
      { title: "Lanzamientos optimizados", detail: "Frameworks de conversión y backend probados que se repiten." },
      { title: "Listo para más de un creador", detail: "El sistema ya no depende de tu atención constante." },
    ],
    next: { title: "Etapa 4 · El Operador Multiplicador", points: ["Gestionar 2–4 creadores a la vez.", "Sistematizar para añadir creadores sin caos.", "Objetivo: múltiples 5 cifras al mes."] },
    mindset: "El cliente ya está; ahora el juego es exprimir el valor de cada lanzamiento.",
  },
  o4: {
    profile: "operator",
    index: 4,
    code: "ETAPA 04",
    title: "El Operador Multiplicador",
    role: "Líder de sistemas · gestor de cartera",
    income: "Múltiples 5 cifras / mes",
    team: "2–4 creadores + IA",
    pain: "Has liderado sistemas y monetización con impacto, pero tu tiempo sigue demasiado atado a los resultados.",
    objective: "Generar múltiples 5 cifras al mes gestionando varios creadores y diversificar ingresos sin quemarte.",
    doing: [
      "Manejar 2, 3 o 4 creadores a la vez: la IA hace el trabajo pesado de ejecución.",
      "Crear estructuras operativas para añadir creadores sin añadir caos.",
      "Pasar de buscar el primer cheque de $10k a un negocio sólido de múltiples 5 cifras.",
    ],
    graduate: [
      { title: "Cartera estable de creadores", detail: "Tus ingresos no dependen de un único socio." },
      { title: "Operativa sistematizada y delegable", detail: "Procesos que permiten crecer de forma compuesta." },
      { title: "Mentalidad de dueño de sistemas", detail: "Piensas en infraestructura, no solo en operar personas." },
    ],
    next: { title: "Etapa 5 · El Arquitecto del Imperio Invisible", points: ["Dejar de operar personas y empezar a poseer sistemas, marcas y capital.", "Equity deals y SaaS en lugar de solo revenue share.", "Convertir el modelo en una empresa vendible o automatizada."] },
    mindset: "10 creadores pequeños valen más que 1 creador grande.",
  },
  o5: {
    profile: "operator",
    index: 5,
    code: "ETAPA 05",
    title: "El Arquitecto del Imperio Invisible",
    role: "Shadow Founder",
    income: "MRR de SaaS · equity exits · licencias · holding",
    team: "Sistemas, marcas y capital",
    pain: "Gestionas múltiples operaciones, pero sigues dependiendo de creadores individuales en lugar de poseer la infraestructura.",
    objective: "Pasar de operar a poseer: construir un activo multimillonario y convertir el modelo en una empresa vendible o automatizada. Ya no ganas dinero operando creadores, sino poseyendo infraestructura del creator economy.",
    doing: [
      "IP propia: agencia, SaaS interno, plataforma de revenue share o holding de marcas.",
      "Equity deals y joint ventures; lanzar marcas propias con ‘front creators’ contratados.",
      "Productizar el método (software de funnels, CRM, payment splitting, playbooks).",
      "Operar creadores como un portafolio (Creator Portfolio Fund) y automatizar todo.",
    ],
    graduate: [
      { title: "Infraestructura propia en marcha", detail: "SaaS, plataforma o holding que otros usan: eres el sistema, no el operador." },
      { title: "Ingresos por equity y recurrencia", detail: "MRR, licencias y participaciones, no solo revenue share." },
      { title: "Negocio automatizado / vendible", detail: "Ventas evergreen, managers e IA ejecutando; tú decides qué escalar." },
    ],
    next: null,
    mindset: "No trabajo para creadores. Los creadores trabajan dentro de mi sistema.",
  },

  /* ===== PROFESIONAL REFERENTE ===== */
  p1: {
    profile: "profesional",
    index: 1,
    code: "ETAPA 01",
    title: "El Profesional Silencioso",
    role: "Experto sin presencia",
    income: "Autoridad real sin capitalizar",
    pain: "Todavía no publicas o apenas has empezado a compartir cosas sobre tu camino.",
    objective: "Empezar a hacer visible tu expertise con un mensaje y un tema claros.",
    doing: [
      "Definir el tema con el que quieres que te asocien.",
      "Convertir tu experiencia en historias y aprendizajes compartibles.",
      "Empezar a publicar con una regularidad mínima viable.",
    ],
    graduate: [
      { title: "Tema y posicionamiento elegidos", detail: "Sabes sobre qué quieres ser reconocido." },
      { title: "Primeras publicaciones con intención", detail: "Dejas de ser invisible para tu sector." },
    ],
    next: { title: "Etapa 2 · Presencia inicial", points: ["Definir temas pilares ligados a tu expertise.", "Crear un ritmo de publicación sostenible.", "Conseguir estructura y accountability."] },
    mindset: "Tu reputación offline no escala; tu contenido sí.",
    notIcp: true,
    notIcpNote:
      "En esta etapa tu reto es de claridad y constancia, no de sistema. Primero conviene definir tu tema y empezar a publicar antes de pensar en escalar.",
  },
  p2: {
    profile: "profesional",
    index: 2,
    code: "ETAPA 02",
    title: "Presencia Inicial",
    role: "Profesional que publica sin estrategia",
    income: "Visibilidad intermitente",
    pain: "Publicas de vez en cuando, pero sin mucha estrategia ni constancia.",
    objective: "Dar estructura y constancia a tu contenido.",
    doing: [
      "Definir 3–4 temas pilares ligados a tu expertise.",
      "Crear un ritmo de publicación que puedas sostener.",
      "Conseguir estructura y accountability para no abandonar.",
    ],
    graduate: [
      { title: "Línea editorial con pilares", detail: "Temas claros sobre los que aportas valor." },
      { title: "Constancia sostenida", detail: "Publicas con un ritmo estable, no a ratos." },
    ],
    next: { title: "Etapa 3 · Contenido con intención", points: ["Pasar de informar a posicionar opinión.", "Introducir prueba (casos, resultados).", "Empezar a captar interés cualificado."] },
    mindset: "La constancia vence al talento que publica a ratos.",
  },
  p3: {
    profile: "profesional",
    index: 3,
    code: "ETAPA 03",
    title: "Contenido con Intención",
    role: "Creator",
    income: "Audiencia que crece, sin monetizar del todo",
    pain: "Ya compartes contenido con cierta intención y regularidad, pero no se traduce en oportunidades claras.",
    objective: "Convertir la regularidad en autoridad percibida y en pipeline.",
    doing: [
      "Pasar de informar a posicionar tu opinión y punto de vista.",
      "Introducir prueba (casos, resultados) en tu narrativa.",
      "Empezar a capturar interés (DMs, lista, llamadas).",
    ],
    graduate: [
      { title: "Audiencia cualificada", detail: "Personas que encajan con tu oferta, no vanity metrics." },
      { title: "Primeras oportunidades", detail: "Contactos y conversaciones nacidas del contenido." },
    ],
    next: { title: "Etapa 4 · Referente reconocido", points: ["Definir una oferta alineada con tu posicionamiento.", "Sistematizar la captación.", "Aplicar pricing premium por autoridad."] },
    mindset: "No buscas más seguidores; buscas que te asocien a un problema que sabes resolver.",
  },
  p4: {
    profile: "profesional",
    index: 4,
    code: "ETAPA 04",
    title: "Referente Reconocido",
    role: "Autoridad temática",
    income: "Reconocimiento sin sistematizar ingresos",
    pain: "La gente empieza a asociarte con un tema concreto, pero aún no monetizas ese reconocimiento de forma sistemática.",
    objective: "Capitalizar tu autoridad: convertir reconocimiento en ingresos y oportunidades.",
    doing: [
      "Definir una oferta clara alineada con tu posicionamiento.",
      "Sistematizar la captación: de contenido a conversación a venta.",
      "Aplicar pricing premium por autoridad.",
    ],
    graduate: [
      { title: "Oferta que monetiza tu autoridad", detail: "Productos/servicios alineados con tu posicionamiento." },
      { title: "Pipeline predecible", detail: "La captación deja de ser azarosa." },
    ],
    next: { title: "Etapa 5 · Marca que genera oportunidades", points: ["Productizar tu conocimiento.", "Construir equipo y sistemas.", "Cerrar partnerships, media y licencias."] },
    mindset: "La autoridad sin oferta es un activo sin cobrar.",
  },
  p5: {
    profile: "profesional",
    index: 5,
    code: "ETAPA 05",
    title: "Marca que Genera Oportunidades",
    role: "Marca-compañía",
    income: "Activo empresarial · oportunidades entrantes",
    pain: "Tu marca personal ya genera oportunidades de forma constante, pero depende demasiado de tu tiempo.",
    objective: "Escalar tu marca como un activo de negocio: equipo, IP y sistemas.",
    doing: [
      "Productizar tu conocimiento (cursos, programas, comunidad).",
      "Construir equipo y sistemas de contenido y captación.",
      "Cerrar partnerships, media y licencias.",
    ],
    graduate: [
      { title: "Productos escalables en marcha", detail: "Ingresos que no dependen de tus horas." },
      { title: "Marca operada como compañía", detail: "Equipo, IP y sistemas con valuation propia." },
    ],
    next: null,
    mindset: "Tu marca ya no es tu trabajo: es tu compañía.",
  },
};

/* ---------- RETOS (Q2 de cada perfil) ----------
   Personalizan el resultado: el mayor reto actual y por dónde empezar.   */
const RETOS = {
  founder: {
    a: { label: "Claridad sobre qué contenido crear y qué mensaje comunicar", focus: "Empieza por tu mensaje: una frase que diga a quién ayudas y a qué resultado les llevas. Sin claridad, ningún volumen de contenido funciona." },
    b: { label: "Ser constante y mantener una estrategia sin improvisar", focus: "Tu palanca es un sistema de contenido, no más fuerza de voluntad. Define pilares y un ritmo que puedas sostener sin depender de la inspiración." },
    c: { label: "Diferenciarte y construir una marca personal que te haga destacar", focus: "Diferénciate con tu ángulo y tu historia, no con el formato. Lo que solo tú puedes contar es lo que te hace destacar." },
    d: { label: "Conseguir que el contenido genere clientes, confianza o ventas reales", focus: "Conecta cada pieza con tu oferta y añade prueba (casos, resultados). El contenido que vende educa sobre el problema y demuestra el resultado." },
    e: { label: "Escalar el contenido sin depender siempre de tu tiempo (equipo, sistema, procesos)", focus: "Es momento de delegar y productizar: equipo de contenido e IP para que tu marca crezca sin consumir tu tiempo." },
  },
  operator: {
    a: { label: "Entender/mejorar cómo funcionan la monetización, funnels, ofertas o sistemas", focus: "Domina primero la monetización: ofertas, funnels y revenue share. Sin entender cómo se gana el dinero, la ejecución no tiene dirección." },
    b: { label: "Conseguir experiencia práctica y aprender ejecutando con casos reales", focus: "Necesitas reps, no más teoría. Consigue un primer caso real (aunque sea a revenue share) y aprende ejecutando." },
    c: { label: "Mejorar tu capacidad para generar resultados consistentes (ventas, conversión, operaciones)", focus: "Tu siguiente nivel es la conversión: frameworks de oferta y backend que hagan que cada lanzamiento supere al anterior." },
    d: { label: "Crear procesos, automatizaciones o sistemas escalables sin depender tanto de tu tiempo", focus: "Sistematiza y automatiza: procesos e IA que te permitan añadir creadores sin añadir caos ni horas." },
    e: { label: "Pasar de prestar servicios a construir activos, ownership o estructuras escalables", focus: "Pasa de cobrar por servicios a poseer: equity, SaaS, IP. Deja de alquilar tu tiempo y empieza a construir activos." },
  },
  prof: {
    a: { label: "Nunca has creado contenido o apenas estás empezando", focus: "Empieza por lo más simple: elige un tema y publica tu primera serie de piezas. La claridad llega ejecutando, no planificando." },
    b: { label: "Has publicado alguna vez, pero sin constancia ni dirección clara", focus: "Tu reto es la constancia: define pilares y un ritmo mínimo sostenible. Mejor poco y constante que mucho y a ratos." },
    c: { label: "Publicas con cierta frecuencia y estás intentando encontrar qué funciona", focus: "Ya publicas; ahora afina el posicionamiento y la oferta. Mide qué atrae a las personas correctas y dobla la apuesta." },
    d: { label: "Tienes una estrategia bastante clara y tu contenido ya genera confianza u oportunidades", focus: "Tu marca ya genera confianza: conéctala a una oferta clara y sistematiza la captación para convertirla en ingresos." },
    e: { label: "El contenido ya forma parte de tu crecimiento y te ayuda a atraer de forma consistente", focus: "Estás listo para escalar: productiza, construye equipo y opera tu marca como una compañía." },
  },
};

/* ---------- QUIZ: árbol de preguntas ---------- */
const QUESTIONS = {
  start: {
    id: "start",
    eyebrow: "Pregunta 1",
    title: "¿Qué describe mejor tu punto de partida?",
    subtitle: "Elige la opción que más se parezca a tu situación actual.",
    options: [
      { value: "founder", icon: "◆", label: "Ya tengo un negocio, o quiero iniciar uno", desc: "Quiero usar mi contenido y mi marca personal para hacer crecer mi empresa." },
      { value: "operator", icon: "◐", label: "Opero o me interesa operar marcas personales", desc: "Quiero construir negocios desde la sombra, sin ser la cara pública." },
      { value: "profesional", icon: "▲", label: "Tengo un trabajo y soy profesional en un sector", desc: "Quiero convertir mi experiencia en autoridad y un activo escalable." },
    ],
  },

  /* --- rama FOUNDER VISIBLE --- */
  founder_stage: {
    id: "founder_stage",
    key: "stage",
    eyebrow: "Pregunta 2",
    title: "¿Qué impacto tiene hoy tu contenido en el crecimiento de tu empresa?",
    subtitle: "Sé honesto: marca lo que ocurre de verdad, no lo que aspiras a tener.",
    options: [
      { value: "f1", icon: "1", label: "Muy poco o ninguno", desc: "Mi contenido aún no mueve el negocio." },
      { value: "f2", icon: "2", label: "Me da algo de visibilidad, pero sin resultados claros", desc: "Me ven, pero no se traduce en negocio." },
      { value: "f3", icon: "3", label: "Empieza a atraer interés, contactos o potenciales clientes", desc: "Llega interés, aunque irregular." },
      { value: "f4", icon: "4", label: "Genera confianza y acelera decisiones de compra", desc: "El contenido ayuda a cerrar." },
      { value: "f5", icon: "5", label: "Genera oportunidades, ventas o partnerships de forma consistente", desc: "La marca ya es un motor de negocio." },
    ],
  },
  founder_reto: {
    id: "founder_reto",
    key: "reto",
    eyebrow: "Pregunta 3",
    title: "¿Qué es lo que más te cuesta de cara a impulsar tu marca personal?",
    subtitle: "Elige tu mayor reto ahora mismo.",
    options: [
      { value: "a", icon: "○", label: "Claridad de contenido y mensaje", desc: "Tener claridad sobre qué crear y qué comunicar." },
      { value: "b", icon: "○", label: "Constancia y estrategia", desc: "Ser constante y mantener una estrategia sin improvisar." },
      { value: "c", icon: "○", label: "Diferenciación", desc: "Construir una marca personal que me haga destacar." },
      { value: "d", icon: "○", label: "Que el contenido convierta", desc: "Conseguir que genere clientes, confianza o ventas reales." },
      { value: "e", icon: "○", label: "Escalar sin depender de mi tiempo", desc: "Equipo, sistema y procesos para escalar el contenido." },
    ],
  },

  /* --- rama PERSONAL BRAND OPERATOR --- */
  operator_stage: {
    id: "operator_stage",
    key: "stage",
    eyebrow: "Pregunta 2",
    title: "¿Con qué nivel de experiencia has trabajado gestionando marcas personales ajenas?",
    subtitle: "Esto define tu etapa de partida como operador.",
    options: [
      { value: "o1", icon: "1", label: "Ninguna o muy poca experiencia práctica", desc: "Me atrae el modelo pero aún no he ejecutado." },
      { value: "o2", icon: "2", label: "He ayudado puntualmente o aprendido por mi cuenta", desc: "Sin procesos claros todavía." },
      { value: "o3", icon: "3", label: "He ejecutado proyectos o gestionado operaciones con resultados", desc: "Ya tengo casos con resultados." },
      { value: "o4", icon: "4", label: "He liderado sistemas, monetización o procesos con impacto real", desc: "Resultados con sistemas propios." },
      { value: "o5", icon: "5", label: "He gestionado múltiples operaciones o equipos con sistemas escalables", desc: "Opero a escala." },
    ],
  },
  operator_reto: {
    id: "operator_reto",
    key: "reto",
    eyebrow: "Pregunta 3",
    title: "¿Qué es lo que más te cuesta hoy —o te gustaría mejorar— para crecer operando detrás de creadores o negocios?",
    subtitle: "Elige tu mayor reto ahora mismo.",
    options: [
      { value: "a", icon: "○", label: "Entender la monetización", desc: "Cómo funcionan monetización, funnels, ofertas o sistemas." },
      { value: "b", icon: "○", label: "Experiencia práctica", desc: "Aprender ejecutando con casos reales." },
      { value: "c", icon: "○", label: "Resultados consistentes", desc: "Ventas, conversión y operaciones que se repitan." },
      { value: "d", icon: "○", label: "Procesos y automatización", desc: "Sistemas escalables sin depender de mi tiempo." },
      { value: "e", icon: "○", label: "De servicios a activos", desc: "Construir ownership y estructuras escalables." },
    ],
  },

  /* --- rama PROFESIONAL REFERENTE --- */
  prof_stage: {
    id: "prof_stage",
    key: "stage",
    eyebrow: "Pregunta 2",
    title: "¿Cuál es tu situación con tu marca personal como profesional?",
    subtitle: "Marca el punto más avanzado que ya hayas alcanzado de verdad.",
    options: [
      { value: "p1", icon: "1", label: "Todavía no publico o apenas he empezado", desc: "Apenas comparto cosas sobre mi camino." },
      { value: "p2", icon: "2", label: "Publico de vez en cuando, pero sin mucha estrategia", desc: "Visibilidad intermitente." },
      { value: "p3", icon: "3", label: "Comparto contenido con cierta intención y regularidad", desc: "Ya hay constancia e intención." },
      { value: "p4", icon: "4", label: "La gente empieza a asociarme con un tema concreto", desc: "Empiezo a ser reconocido." },
      { value: "p5", icon: "5", label: "Mi marca personal ya genera oportunidades de forma constante", desc: "La marca trabaja para mí." },
    ],
  },
  prof_reto: {
    id: "prof_reto",
    key: "reto",
    eyebrow: "Pregunta 3",
    title: "¿Cuál es tu punto de partida con el contenido?",
    subtitle: "Elige lo que mejor describe tu relación actual con el contenido.",
    options: [
      { value: "a", icon: "○", label: "Empezando de cero", desc: "Nunca he creado contenido o apenas empiezo." },
      { value: "b", icon: "○", label: "Sin constancia", desc: "He publicado alguna vez, sin dirección clara." },
      { value: "c", icon: "○", label: "Buscando qué funciona", desc: "Publico con cierta frecuencia y experimento." },
      { value: "d", icon: "○", label: "Estrategia clara", desc: "Mi contenido ya genera confianza u oportunidades." },
      { value: "e", icon: "○", label: "Crecimiento consistente", desc: "El contenido atrae clientes y comunidad de forma estable." },
    ],
  },
};

/* ---------- MOTOR: siguiente pregunta y resultado ---------- */
function nextQuestion(answers) {
  if (!answers.start) return "start";
  const b = BRANCH[answers.start];
  if (!b) return null;
  if (!answers[b + "_stage"]) return b + "_stage";
  if (!answers[b + "_reto"]) return b + "_reto";
  return null;
}

function computeResult(answers) {
  const b = BRANCH[answers.start];
  if (!b) return null;
  const profile = answers.start; // founder | operator | profesional
  const order = PROFILES[profile].phaseOrder;
  const phase = answers[b + "_stage"] || order[0];
  const reto = answers[b + "_reto"] || null;
  return { profile, phase, reto, retoGroup: b };
}
